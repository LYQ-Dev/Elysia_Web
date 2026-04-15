// 书籍数据配置
// 用于管理生活中阅读的书籍

export interface BookItem {
	id: number;
	title: string;
	author: string;
	cover: string;
	status: "reading" | "completed" | "planned" | "abandoned";
	rating?: number;
	pages?: number;
	readPages?: number;
	category: string;
	publishDate?: string;
	readDate?: string; // 完成日期
	notes?: string;
	tags?: string[];
	publisher?: string;
	link?: string;
}

// 书籍数据
const booksData: BookItem[] = [
	{
		id: 1,
		title: "Sample Book",
		author: "Sample Author",
		cover: "/images/books/sample.webp",
		status: "reading",
		rating: 4.5,
		pages: 300,
		readPages: 150,
		category: "Fiction",
		publishDate: "2024-01-01",
		tags: ["Fiction", "Recommended"],
		publisher: "Sample Publisher",
		link: "https://example.com",
		notes: "Interesting story",
	},
];

// 获取所有书籍
export const getBooksList = (limit?: number) => {
	const sortedData = [...booksData].sort(
		(a, b) => new Date(b.readDate || b.publishDate || 0).getTime() - new Date(a.readDate || a.publishDate || 0).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按状态分类
export const getBooksByStatus = (status: "reading" | "completed" | "planned" | "abandoned") => {
	return booksData.filter((book) => book.status === status);
};

// 获取所有标签
export const getAllBooksTags = () => {
	const tags = new Set<string>();
	booksData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 按分类统计
export const getBooksByCategory = () => {
	const grouped: Record<string, BookItem[]> = {};
	booksData.forEach((book) => {
		if (!grouped[book.category]) {
			grouped[book.category] = [];
		}
		grouped[book.category].push(book);
	});
	return grouped;
};

// 计算阅读进度百分比
export const getReadingProgress = (bookId: number) => {
	const book = booksData.find((b) => b.id === bookId);
	if (!book || !book.pages || !book.readPages) return 0;
	return Math.round((book.readPages / book.pages) * 100);
};
