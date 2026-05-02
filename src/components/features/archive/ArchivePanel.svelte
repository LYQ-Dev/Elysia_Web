<script lang="ts">
	import I18nKey from "@i18n/i18nKey";
	import { i18n } from "@i18n/translation";
	import { getPostUrlBySlug } from "@utils/url-utils";
	import { onMount } from "svelte";

	export let tags: string[];
	export let categories: string[];
	export let sortedPosts: Post[] = [];

	const PAGE_SIZE = 10;

	const params = new URLSearchParams(window.location.search);
	tags = params.has("tag") ? params.getAll("tag") : [];
	categories = params.has("category") ? params.getAll("category") : [];
	const uncategorized = params.get("uncategorized");

	interface Post {
		id: string;
		url?: string; // 预计算的文章 URL
		data: {
			title: string;
			tags: string[];
			category?: string;
			published: Date;
			alias?: string;
			permalink?: string; // 自定义固定链接
		};
	}

	interface Group {
		year: number;
		posts: Post[];
	}

	let groups: Group[] = [];
	let filteredPosts: Post[] = [];
	let pagedPosts: Post[] = [];
	let currentPage = 1;
	let totalPages = 1;
	let pages: number[] = [];

	const HIDDEN = -1;
	const ADJ_DIST = 2;
	const VISIBLE = ADJ_DIST * 2 + 1;

	function formatDate(date: Date) {
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${month}-${day}`;
	}

	function formatTag(tagList: string[]) {
		return tagList.map((t) => `#${t}`).join(" ");
	}

	function updatePages() {
		pages = [];
		let count = 1;
		let l = currentPage;
		let r = currentPage;
		while (0 < l - 1 && r + 1 <= totalPages && count + 2 <= VISIBLE) {
			count += 2;
			l--;
			r++;
		}
		while (0 < l - 1 && count < VISIBLE) {
			count++;
			l--;
		}
		while (r + 1 <= totalPages && count < VISIBLE) {
			count++;
			r++;
		}

		if (l > 1) {
			pages.push(1);
		}
		if (l === 3) {
			pages.push(2);
		}
		if (l > 3) {
			pages.push(HIDDEN);
		}
		for (let i = l; i <= r; i++) {
			pages.push(i);
		}
		if (r < totalPages - 2) {
			pages.push(HIDDEN);
		}
		if (r === totalPages - 2) {
			pages.push(totalPages - 1);
		}
		if (r < totalPages) {
			pages.push(totalPages);
		}
	}

	function buildGroups(posts: Post[]) {
		const grouped = posts.reduce(
			(acc, post) => {
				const year = post.data.published.getFullYear();
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(post);
				return acc;
			},
			{} as Record<number, Post[]>,
		);

		const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
			year: Number.parseInt(yearStr, 10),
			posts: grouped[Number.parseInt(yearStr, 10)],
		}));

		groupedPostsArray.sort((a, b) => b.year - a.year);
		groups = groupedPostsArray;
	}

	function setCurrentPage(nextPage: number) {
		currentPage = Math.min(Math.max(1, nextPage), totalPages);
		const start = (currentPage - 1) * PAGE_SIZE;
		pagedPosts = filteredPosts.slice(start, start + PAGE_SIZE);
		buildGroups(pagedPosts);
		updatePages();
		const nextParams = new URLSearchParams(window.location.search);
		if (currentPage > 1) {
			nextParams.set("page", String(currentPage));
		} else {
			nextParams.delete("page");
		}
		const nextQuery = nextParams.toString();
		const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
		window.history.replaceState({}, "", nextUrl);
	}

	onMount(async () => {
		filteredPosts = sortedPosts;

		if (tags.length > 0) {
			filteredPosts = filteredPosts.filter(
				(post) =>
					Array.isArray(post.data.tags) &&
					post.data.tags.some((tag) => tags.includes(tag)),
			);
		}

		if (categories.length > 0) {
			filteredPosts = filteredPosts.filter(
				(post) =>
					post.data.category &&
					categories.includes(post.data.category),
			);
		}

		if (uncategorized) {
			filteredPosts = filteredPosts.filter((post) => !post.data.category);
		}

		// 按发布时间倒序排序，确保不受置顶影响
		filteredPosts = filteredPosts
			.slice()
			.sort(
				(a, b) =>
					b.data.published.getTime() - a.data.published.getTime(),
			);
		totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
		const pageParam = Number(params.get("page"));
		const initialPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
		setCurrentPage(initialPage);
	});
</script>

<div class="card-base px-8 py-6">
	{#each groups as group}
		<div>
			<div class="flex flex-row w-full items-center h-[3.75rem]">
				<div
					class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75"
				>
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div
						class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
					></div>
				</div>
				<div class="w-[70%] md:w-[80%] transition text-left text-50">
					{group.posts.length}
					{i18n(
						group.posts.length === 1
							? I18nKey.postCount
							: I18nKey.postsCount,
					)}
				</div>
			</div>

			{#each group.posts as post}
				<a
					href={post.url || getPostUrlBySlug(post.id)}
					aria-label={post.data.title}
					class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
				>
					<div
						class="flex flex-row justify-start items-center h-full"
					>
						<!-- date -->
						<div
							class="w-[15%] md:w-[10%] transition text-sm text-right text-50"
						>
							{formatDate(post.data.published)}
						</div>

						<!-- dot and line -->
						<div
							class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center"
						>
							<div
								class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
							></div>
						</div>

						<!-- post title -->
						<div
							class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
						>
							{post.data.title}
						</div>

						<!-- tag list -->
						<div
							class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
						>
							{formatTag(post.data.tags)}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/each}
</div>

{#if totalPages > 1}
	<div class="flex flex-row gap-3 justify-center mt-8">
		<button
			class:disabled={currentPage <= 1}
			class="btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11"
			aria-label="上一页"
			on:click={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
		>
			<span class="text-xl">‹</span>
		</button>
		<div
			class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold"
		>
			{#each pages as p}
				{#if p === HIDDEN}
					<span class="mx-2 text-sm">...</span>
				{:else if p === currentPage}
					<div
						class="h-11 w-11 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-white dark:text-black/70"
					>
						{p}
					</div>
				{:else}
					<button
						class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85]"
						aria-label={`Page ${p}`}
						on:click={() => setCurrentPage(p)}
					>
						{p}
					</button>
				{/if}
			{/each}
		</div>
		<button
			class:disabled={currentPage >= totalPages}
			class="btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11"
			aria-label="下一页"
			on:click={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
		>
			<span class="text-xl">›</span>
		</button>
	</div>
{/if}
