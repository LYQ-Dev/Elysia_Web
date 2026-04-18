<script lang="ts">
	import Icon from "@iconify/svelte";
	import { navigateToPage } from "@utils/navigation-utils";
	import { onDestroy, onMount } from "svelte";

	import type { SearchResult } from "@/global";

	interface PostSearchMetaItem {
		id: string;
		title: string;
		description: string;
		tags: string[];
		url: string;
		published: number;
		category: string;
		password: boolean;
		section: string;
	}

	interface RankedSearchResult extends SearchResult {
		__score: number;
		__published: number;
	}

	let keywordDesktop = $state("");
	let keywordMobile = $state("");
	let result: SearchResult[] = $state([]);
	let postSearchIndex: PostSearchMetaItem[] = $state([]);
	let postIndexLoading = false;
	let postIndexLoaded = false;
	let postIndexPromise: Promise<void> | null = null;
	let pagefindLoaded = false;
	let initialized = $state(false);
	let isDesktopSearchExpanded = $state(false);
	let debounceTimer: NodeJS.Timeout;
	let windowJustFocused = false;
	let focusTimer: NodeJS.Timeout;
	let blurTimer: NodeJS.Timeout;
	const searchPlaceholder = "请输入文章标题或标签";

	const getCurrentKeyword = (): string => (keywordDesktop || keywordMobile).trim();

	const shouldShowNoResultPrompt = (): boolean =>
		getCurrentKeyword().length > 0 && result.length === 0;

	const normalizeText = (value: string): string =>
		value
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[\u0300-\u036f]/g, "")
			.trim();

	const compactText = (value: string): string =>
		normalizeText(value).replace(/\s+/g, "");

	const splitTokens = (value: string): string[] =>
		normalizeText(value)
			.split(/\s+/)
			.filter(Boolean);

	const escapeHtml = (value: string): string =>
		value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");

	const escapeRegExp = (value: string): string =>
		value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	const isSubsequenceMatch = (needle: string, haystack: string): boolean => {
		if (!needle || !haystack) {
			return false;
		}

		let needleIndex = 0;
		for (const ch of haystack) {
			if (ch === needle[needleIndex]) {
				needleIndex++;
				if (needleIndex === needle.length) {
					return true;
				}
			}
		}

		return false;
	};

	const highlightKeywords = (text: string, keyword: string): string => {
		const escaped = escapeHtml(text);
		const tokens = splitTokens(keyword);

		if (tokens.length === 0) {
			return escaped;
		}

		const pattern = tokens.map(escapeRegExp).join("|");
		const regex = new RegExp(`(${pattern})`, "gi");
		return escaped.replace(regex, "<mark>$1</mark>");
	};

	const normalizeResultUrl = (targetUrl: string): string =>
		targetUrl.replace(/#.*$/, "").replace(/\/+$/, "") || "/";

	const isValidPostSearchMetaItem = (
		item: unknown,
	): item is PostSearchMetaItem => {
		if (!item || typeof item !== "object") {
			return false;
		}

		const data = item as Record<string, unknown>;
		return (
			typeof data.id === "string" &&
			typeof data.title === "string" &&
			typeof data.url === "string"
		);
	};

	const loadPostSearchIndex = async (): Promise<void> => {
		if (postIndexLoaded) {
			return;
		}

		if (postIndexPromise) {
			await postIndexPromise;
			return;
		}

		postIndexPromise = (async () => {
			postIndexLoading = true;
			try {
				const response = await fetch("/api/allPostMeta.json");
				if (!response.ok) {
					throw new Error(`Failed to load post index: ${response.status}`);
				}

				const rawData = (await response.json()) as unknown[];
				postSearchIndex = Array.isArray(rawData)
					? rawData.filter(isValidPostSearchMetaItem).map((item) => ({
						id: item.id,
						title: item.title,
						description:
							typeof item.description === "string"
								? item.description
								: "",
						tags: Array.isArray(item.tags)
							? item.tags.filter(
									(tag): tag is string => typeof tag === "string",
								)
							: [],
						url: item.url,
						published:
							typeof item.published === "number"
								? item.published
								: 0,
						category:
							typeof item.category === "string"
								? item.category
								: "",
						password: Boolean(item.password),
						section:
							typeof item.section === "string"
								? item.section
								: "文章",
					}))
					: [];
			} catch (error) {
				console.error("Failed to load post search index:", error);
				postSearchIndex = [];
			} finally {
				postIndexLoading = false;
				postIndexLoaded = true;
				postIndexPromise = null;
			}
		})();

		await postIndexPromise;
	};

	const searchByTitleAndTags = (keyword: string): SearchResult[] => {
		const query = normalizeText(keyword);
		const queryCompact = compactText(keyword);
		const queryTokens = splitTokens(keyword);

		if (!query || postSearchIndex.length === 0) {
			return [];
		}

		const rankedResults: RankedSearchResult[] = [];

		for (const post of postSearchIndex) {
			if (post.password) {
				continue;
			}

			const titleNormalized = normalizeText(post.title);
			const titleCompact = compactText(post.title);
			const descriptionNormalized = normalizeText(post.description || "");
			const tagsNormalized = (post.tags || []).map((tag) =>
				normalizeText(tag),
			);
			const sectionNormalized = normalizeText(post.section || "");

			let score = 0;
			let titleMatched = false;
			let tagMatched = false;
			let fuzzyTitleMatched = false;
			let fuzzyTagMatched = false;

			if (titleNormalized.includes(query)) {
				score += 140;
				titleMatched = true;
			}

			if (tagsNormalized.some((tag) => tag.includes(query))) {
				score += 120;
				tagMatched = true;
			}

			if (sectionNormalized && sectionNormalized.includes(query)) {
				score += 24;
			}

			for (const token of queryTokens) {
				if (titleNormalized.includes(token)) {
					score += 28;
					titleMatched = true;
				}

				if (tagsNormalized.some((tag) => tag.includes(token))) {
					score += 24;
					tagMatched = true;
				}

				if (descriptionNormalized.includes(token)) {
					score += 8;
				}

				if (sectionNormalized && sectionNormalized.includes(token)) {
					score += 6;
				}
			}

			if (
				!titleMatched &&
				queryCompact.length > 1 &&
				isSubsequenceMatch(queryCompact, titleCompact)
			) {
				score += 45;
				fuzzyTitleMatched = true;
			}

			if (!tagMatched && queryCompact.length > 1) {
				for (const tag of tagsNormalized) {
					if (isSubsequenceMatch(queryCompact, compactText(tag))) {
						score += 38;
						fuzzyTagMatched = true;
						break;
					}
				}
			}

			if (score <= 0) {
				continue;
			}

			const matchedTags = (post.tags || [])
				.filter((tag) => {
					const normalizedTag = normalizeText(tag);
					return queryTokens.some((token) =>
						normalizedTag.includes(token),
					);
				})
				.slice(0, 3);

			const excerptParts: string[] = [];
			if (post.section) {
				excerptParts.push(`栏目: ${post.section}`);
			}
			if (titleMatched) {
				excerptParts.push("标题匹配");
			}
			if (tagMatched || fuzzyTagMatched) {
				excerptParts.push(
					matchedTags.length > 0
						? `标签: ${matchedTags.join(" / ")}`
						: "标签匹配",
				);
			}
			if (!titleMatched && !tagMatched && (fuzzyTitleMatched || fuzzyTagMatched)) {
				excerptParts.push("模糊匹配");
			}
			if (post.description) {
				excerptParts.push(post.description.slice(0, 84));
			}

			rankedResults.push({
				url: post.url,
				meta: {
					title: post.title,
				},
				excerpt: highlightKeywords(excerptParts.join(" · "), keyword),
				__score: score,
				__published: post.published,
			});
		}

		rankedResults.sort((a, b) => {
			if (b.__score !== a.__score) {
				return b.__score - a.__score;
			}
			return b.__published - a.__published;
		});

		return rankedResults.slice(0, 10).map((item) => ({
			url: item.url,
			meta: item.meta,
			excerpt: item.excerpt,
		}));
	};

	const searchWithPagefind = async (keyword: string): Promise<SearchResult[]> => {
		if (!(import.meta.env.PROD && pagefindLoaded && window.pagefind)) {
			return [];
		}

		try {
			const response = await window.pagefind.search(keyword);
			return Promise.all(response.results.map((item) => item.data()));
		} catch (error) {
			console.error("Pagefind search error:", error);
			return [];
		}
	};

	const mergeSearchResults = (
		localResults: SearchResult[],
		pagefindResults: SearchResult[],
	): SearchResult[] => {
		const merged: SearchResult[] = [];
		const seenUrls = new Set<string>();

		for (const item of [...localResults, ...pagefindResults]) {
			const normalizedUrl = normalizeResultUrl(item.url);
			if (seenUrls.has(normalizedUrl)) {
				continue;
			}

			seenUrls.add(normalizedUrl);
			merged.push(item);

			if (merged.length >= 12) {
				break;
			}
		}

		return merged;
	};

	const togglePanel = () => {
		const panel = document.getElementById("search-panel");
		panel?.classList.toggle("float-panel-closed");
		void loadPostSearchIndex();
		if (
			!panel?.classList.contains("float-panel-closed") &&
			typeof window.loadPagefind === "function"
		) {
			window.loadPagefind();
		}
	};

	const toggleDesktopSearch = () => {
		// 如果窗口刚获得焦点，不自动展开搜索框
		if (windowJustFocused) {
			return;
		}
		isDesktopSearchExpanded = !isDesktopSearchExpanded;
		if (isDesktopSearchExpanded) {
			void loadPostSearchIndex();
			setPanelVisibility(false, true);
			if (typeof window.loadPagefind === "function") {
				window.loadPagefind();
			}
			setTimeout(() => {
				const input = document.getElementById(
					"search-input-desktop",
				) as HTMLInputElement;
				input?.focus();
			}, 0);
		} else {
			setPanelVisibility(false, true);
		}
	};

	const collapseDesktopSearch = () => {
		if (!keywordDesktop) {
			isDesktopSearchExpanded = false;
		}
	};

	const handleBlur = () => {
		// 延迟处理以允许搜索结果的点击事件先于折叠逻辑执行
		blurTimer = setTimeout(() => {
			isDesktopSearchExpanded = false;
			// 仅隐藏面板并折叠，保留搜索关键词和结果以便下次展开时查看
			setPanelVisibility(false, true);
		}, 200);
	};

	const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
		const panel = document.getElementById("search-panel");
		if (!panel || !isDesktop) {
			return;
		}
		if (show) {
			panel.classList.remove("float-panel-closed");
		} else {
			panel.classList.add("float-panel-closed");
		}
	};

	const closeSearchPanel = (): void => {
		const panel = document.getElementById("search-panel");
		if (panel) {
			panel.classList.add("float-panel-closed");
		}
		// 清空搜索关键词和结果
		keywordDesktop = "";
		keywordMobile = "";
		result = [];
	};

	const handleResultClick = (event: Event, url: string): void => {
		event.preventDefault();
		closeSearchPanel();
		navigateToPage(url);
	};

	const search = async (
		keyword: string,
		isDesktop: boolean,
	): Promise<void> => {
		const trimmedKeyword = keyword.trim();
		if (!trimmedKeyword) {
			result = [];
			setPanelVisibility(false, isDesktop);
			return;
		}
		if (!initialized) {
			return;
		}
		try {
			await loadPostSearchIndex();
			const localResults = searchByTitleAndTags(trimmedKeyword);
			const pagefindResults = await searchWithPagefind(trimmedKeyword);
			result = mergeSearchResults(localResults, pagefindResults);
			setPanelVisibility(true, isDesktop);
		} catch (error) {
			console.error("Search error:", error);
			result = [];
			setPanelVisibility(true, isDesktop);
		}
	};

	onMount(() => {
		void loadPostSearchIndex();

		const initializeSearch = () => {
			initialized = true;
			pagefindLoaded =
				typeof window !== "undefined" &&
				!!window.pagefind &&
				typeof window.pagefind.search === "function";
			console.log("Search status on init:", {
				pagefindLoaded,
				postIndexLoaded,
			});
		};
		if (import.meta.env.DEV) {
			console.log("Search initialized in development mode.");
			initializeSearch();
		} else {
			document.addEventListener("pagefindready", () => {
				console.log("Pagefind ready event received.");
				initializeSearch();
			});
			document.addEventListener("pagefindloaderror", () => {
				console.warn(
					"Pagefind load error event received. Search functionality will be limited.",
				);
				initializeSearch(); // Initialize with pagefindLoaded as false
			});
			// Fallback in case events are not caught or pagefind is already loaded by the time this script runs
			setTimeout(() => {
				if (!initialized) {
					console.log("Fallback: Initializing search after timeout.");
					initializeSearch();
				}
			}, 2000); // Adjust timeout as needed
		}

		// 监听窗口焦点事件，防止切换窗口时自动展开搜索框
		const handleFocus = () => {
			windowJustFocused = true;
			clearTimeout(focusTimer);
			focusTimer = setTimeout(() => {
				windowJustFocused = false;
			}, 500); // 500ms 后才允许 mouseenter 触发展开
		};

		window.addEventListener("focus", handleFocus);

		return () => {
			window.removeEventListener("focus", handleFocus);
		};
	});

	$effect(() => {
		if (initialized) {
			const keyword = keywordDesktop || keywordMobile;
			const isDesktop = !!keywordDesktop || isDesktopSearchExpanded;

			clearTimeout(debounceTimer);
			if (keyword) {
				debounceTimer = setTimeout(() => {
					search(keyword, isDesktop);
				}, 300);
			} else {
				result = [];
				setPanelVisibility(false, isDesktop);
			}
		}
	});

	$effect(() => {
		if (typeof document !== "undefined") {
			const navbar = document.getElementById("navbar");
			if (isDesktopSearchExpanded) {
				navbar?.classList.add("is-searching");
			} else {
				navbar?.classList.remove("is-searching");
			}
		}
	});

	onDestroy(() => {
		if (typeof document !== "undefined") {
			const navbar = document.getElementById("navbar");
			navbar?.classList.remove("is-searching");
		}
		clearTimeout(debounceTimer);
		clearTimeout(focusTimer);
	});
</script>

<!-- search bar for desktop view (collapsed by default) -->
<div class="hidden lg:block relative w-11 h-11 shrink-0">
	<button
		id="search-bar"
		class="flex transition-all items-center h-11 rounded-lg absolute right-0 top-0 shrink-0 border-0 bg-transparent cursor-pointer
            {isDesktopSearchExpanded
			? 'bg-white/95 border border-white/90 shadow-sm hover:bg-white focus-within:bg-white dark:bg-white/95 dark:hover:bg-white dark:focus-within:bg-white'
			: 'btn-plain active:scale-90'}
            {isDesktopSearchExpanded ? 'w-72' : 'w-11'}"
		aria-label="Search"
		onmouseenter={() => {
			if (!isDesktopSearchExpanded) {
				toggleDesktopSearch();
			}
		}}
		onmouseleave={collapseDesktopSearch}
		onclick={() => {
			const input = document.getElementById(
				"search-input-desktop",
			) as HTMLInputElement;
			input?.focus();
		}}
	>
		<Icon
			icon="material-symbols:search"
			class="absolute text-[1.25rem] pointer-events-none {isDesktopSearchExpanded
				? 'left-3'
				: 'left-1/2 -translate-x-1/2'} transition top-1/2 -translate-y-1/2 {isDesktopSearchExpanded
				? 'text-slate-500'
				: ''}"
		></Icon>
		<input
			id="search-input-desktop"
			placeholder={searchPlaceholder}
			bind:value={keywordDesktop}
			onfocus={() => {
				clearTimeout(blurTimer);
				if (!isDesktopSearchExpanded) {
					toggleDesktopSearch();
				}
				search(keywordDesktop, true);
			}}
			onblur={handleBlur}
			class="transition-all pl-10 text-sm bg-transparent outline-0 placeholder:text-slate-400
                h-full {isDesktopSearchExpanded
				? 'w-60'
				: 'w-0'} text-slate-700"
		/>
	</button>
</div>

<!-- toggle btn for phone/tablet view -->
<button
	onclick={togglePanel}
	aria-label="Search Panel"
	id="search-switch"
	class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
>
	<Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div
	id="search-panel"
	class="float-panel float-panel-closed absolute md:w-[30rem] top-20 left-4 md:left-[unset] right-4 z-50 search-panel shadow-2xl rounded-2xl p-2"
>
	<!-- search bar inside panel for phone/tablet -->
	<div
		id="search-bar-inside"
		class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-white/95 border border-white/90 shadow-sm hover:bg-white focus-within:bg-white
      dark:bg-white/95 dark:hover:bg-white dark:focus-within:bg-white
  "
	>
		<Icon
			icon="material-symbols:search"
			class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-slate-500"
		></Icon>
		<input
			placeholder={searchPlaceholder}
			bind:value={keywordMobile}
			class="pl-10 absolute inset-0 text-sm bg-transparent outline-0 placeholder:text-slate-400
               focus:w-60 text-slate-700"
		/>
	</div>
	<!-- search results -->
	{#each result as item}
		<a
			href={item.url}
			onclick={(e) => handleResultClick(e, item.url)}
			class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
		>
			<div
				class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]"
			>
				{item.meta.title}<Icon
					icon="fa7-solid:chevron-right"
					class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"
				></Icon>
			</div>
			<div class="transition text-sm text-50">
				{@html item.excerpt}
			</div>
		</a>
	{/each}

	{#if shouldShowNoResultPrompt()}
		<div class="search-message">
			什么也没有喵~
		</div>
	{/if}
</div>

<style>
	input:focus {
		outline: 0;
	}
	:global(.search-panel) {
		max-height: calc(100vh - 100px);
		overflow-y: auto;
	}

	.search-message {
		margin-top: 0.5rem;
		padding: 0.8rem 0.85rem;
		text-align: center;
		font-size: 0.92rem;
		color: rgb(100 116 139 / 0.9);
		border-radius: 0.75rem;
		background: rgb(15 23 42 / 0.05);
	}

	:global(html.dark) .search-message {
		color: rgb(226 232 240 / 0.8);
		background: rgb(148 163 184 / 0.14);
	}
</style>
