import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		comment: z.boolean().optional().default(true),
		priority: z.number().optional(),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),

		/* Page encryption fields */
		encrypted: z.boolean().optional().default(false),
		password: z.string().optional().default(""),
		passwordHint: z.string().optional().default(""),

		/* Posts alias */
		alias: z.string().optional(),

		/* Custom permalink - 自定义固定链接，优先级高于 alias */
		permalink: z.string().optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

// Songs Collection
const songsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/songs" }),
	schema: z.object({
		title: z.string(),
		artist: z.string(),
		album: z.string(),
		cover: z.string().optional(),
		link: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
		rating: z.number().optional().default(5),
		addDate: z.date(),
		description: z.string().optional().default(""),
	}),
});

// Books Collection
const booksCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/books" }),
	schema: z.object({
		title: z.string(),
		author: z.string(),
		cover: z.string().optional(),
		status: z.enum(["reading", "completed", "planned", "abandoned"]),
		rating: z.number().optional(),
		pages: z.number().optional(),
		readPages: z.number().optional(),
		category: z.string(),
		publishDate: z.date().optional(),
		readDate: z.date().optional(),
		notes: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
		publisher: z.string().optional(),
		link: z.string().optional(),
	}),
});

// Sports Collection
const sportsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/sports" }),
	schema: z.object({
		title: z.string(),
		category: z.enum(["cardio", "strength", "flexibility", "ball", "outdoor", "other"]),
		duration: z.number(), // 分钟
		distance: z.number().optional(), // 公里
		calories: z.number().optional(), // 卡路里
		difficulty: z.enum(["easy", "medium", "hard"]),
		location: z.string().optional(),
		date: z.date(),
		notes: z.string().optional(),
		image: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
	}),
});

// Websites Collection
const websitesCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/websites" }),
	schema: z.object({
		title: z.string(),
		url: z.string(),
		description: z.string().optional(),
		icon: z.string().optional(),
		category: z.string(),
		tags: z.array(z.string()).optional().default([]),
		rating: z.number().optional().default(5),
		addDate: z.date(),
		lastVisit: z.date().optional(),
		useFrequency: z.enum(["daily", "weekly", "monthly", "rarely"]).optional(),
	}),
});

// Projects Collection
const projectsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string().optional(),
		category: z.enum(["web", "mobile", "desktop", "other"]),
		techStack: z.array(z.string()),
		status: z.enum(["completed", "in-progress", "planned"]),
		liveDemo: z.string().optional(),
		sourceCode: z.string().optional(),
		visitUrl: z.string().optional(),
		startDate: z.date(),
		endDate: z.date().optional(),
		featured: z.boolean().optional().default(false),
		tags: z.array(z.string()).optional().default([]),
	}),
});

// Anime Collection
const animeCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/anime" }),
	schema: z.object({
		title: z.string(),
		studio: z.string(),
		cover: z.string().optional(),
		status: z.enum(["watching", "completed", "planned", "dropped"]),
		rating: z.number().optional(),
		totalEpisodes: z.number(),
		watchedEpisodes: z.number().optional(),
		year: z.string(),
		genre: z.array(z.string()).optional().default([]),
		airDate: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
		link: z.string().optional(),
		addDate: z.date(),
	}),
});

// Diary Collection
const diaryCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/diary" }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		mood: z.string().optional(),
		weather: z.string().optional(),
		location: z.string().optional(),
		tags: z.array(z.string()).optional().default([]),
		images: z.array(z.string()).optional().default([]),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	songs: songsCollection,
	books: booksCollection,
	sports: sportsCollection,
	websites: websitesCollection,
	projects: projectsCollection,
	anime: animeCollection,
	diary: diaryCollection,
};
