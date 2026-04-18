import { getSortedPostsList } from "@/utils/content-utils";
import { normalizeCollectionEntrySlug } from "@/utils/url-utils";
import { getCollection } from "astro:content";

interface SearchMetaItem {
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

function getTime(value: Date | string | undefined): number {
	if (!value) {
		return 0;
	}

	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : 0;
}

export async function GET() {
	const posts = await getSortedPostsList();
	const [animeList, songs, books, sports, websites, projects, diaries] =
		await Promise.all([
			getCollection("anime"),
			getCollection("songs"),
			getCollection("books"),
			getCollection("sports"),
			getCollection("websites"),
			getCollection("projects"),
			getCollection("diary"),
		]);

	const postItems: SearchMetaItem[] = posts.map((post) => ({
			id: post.id,
			title: post.data.title,
			description: post.data.description || "",
			tags: post.data.tags || [],
			url: post.url || `/posts/${post.id}/`,
			published: post.data.published.getTime(),
			category: post.data.category || "",
			password: !!post.data.password,
			section: "文章",
		}));

	const animeItems: SearchMetaItem[] = animeList.map((anime) => ({
		id: `anime:${anime.id}`,
		title: anime.data.title,
		description: anime.data.studio ? `工作室: ${anime.data.studio}` : "",
		tags: [...(anime.data.tags || []), ...(anime.data.genre || [])],
		url: `/anime/${normalizeCollectionEntrySlug(anime.id)}/`,
		published: getTime(anime.data.addDate),
		category: anime.data.status || "",
		password: false,
		section: "追番",
	}));

	const songItems: SearchMetaItem[] = songs.map((song) => ({
		id: `song:${song.id}`,
		title: song.data.title,
		description: [song.data.artist, song.data.album, song.data.description]
			.filter(Boolean)
			.join(" · "),
		tags: song.data.tags || [],
		url: `/music/${normalizeCollectionEntrySlug(song.id)}/`,
		published: getTime(song.data.addDate),
		category: song.data.album || "",
		password: false,
		section: "音乐",
	}));

	const bookItems: SearchMetaItem[] = books.map((book) => ({
		id: `book:${book.id}`,
		title: book.data.title,
		description: [book.data.author, book.data.notes].filter(Boolean).join(" · "),
		tags: book.data.tags || [],
		url: `/books/${book.id}/`,
		published: getTime(book.data.readDate || book.data.publishDate),
		category: book.data.category || "",
		password: false,
		section: "书籍",
	}));

	const sportItems: SearchMetaItem[] = sports.map((sport) => ({
		id: `sport:${sport.id}`,
		title: sport.data.title,
		description: [sport.data.location, sport.data.notes].filter(Boolean).join(" · "),
		tags: sport.data.tags || [],
		url: `/sports/${normalizeCollectionEntrySlug(sport.id)}/`,
		published: getTime(sport.data.date),
		category: sport.data.category || "",
		password: false,
		section: "运动",
	}));

	const websiteItems: SearchMetaItem[] = websites.map((website) => ({
		id: `website:${website.id}`,
		title: website.data.title,
		description: website.data.description || "",
		tags: website.data.tags || [],
		url: `/websites/${website.id}/`,
		published: getTime(website.data.addDate),
		category: website.data.category || "",
		password: false,
		section: "网站",
	}));

	const projectItems: SearchMetaItem[] = projects.map((project) => ({
		id: `project:${project.id}`,
		title: project.data.title,
		description: project.data.description || "",
		tags: project.data.tags || [],
		url: `/projects/${project.id}/`,
		published: getTime(project.data.startDate),
		category: project.data.category || "",
		password: false,
		section: "项目",
	}));

	const diaryItems: SearchMetaItem[] = diaries.map((diary) => ({
		id: `diary:${diary.id}`,
		title: diary.data.title,
		description: [diary.data.mood, diary.data.location, diary.data.weather]
			.filter(Boolean)
			.join(" · "),
		tags: diary.data.tags || [],
		url: `/diary/${diary.id}/`,
		published: getTime(diary.data.date),
		category: "",
		password: false,
		section: "日记",
	}));

	const allPostsData = [
		...postItems,
		...animeItems,
		...songItems,
		...bookItems,
		...sportItems,
		...websiteItems,
		...projectItems,
		...diaryItems,
	].sort((a, b) => b.published - a.published);

	return new Response(JSON.stringify(allPostsData), {
		headers: { "Content-Type": "application/json" },
	});
}
