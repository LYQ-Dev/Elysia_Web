// 网站数据配置
// 用于管理生活中喜欢的网站

export interface WebsiteItem {
	id: number;
	name: string;
	url: string;
	description: string;
	icon?: string;
	category: string;
	tags?: string[];
	rating: number;
	addDate: string;
	lastVisit?: string;
	useFrequency: "daily" | "weekly" | "monthly" | "rarely";
}

// 网站数据
const websitesData: WebsiteItem[] = [
	{
		id: 1,
		name: "Sample Website",
		url: "https://example.com",
		description: "A sample website entry",
		icon: "/images/websites/sample.webp",
		category: "Productivity",
		tags: ["Tool", "Useful"],
		rating: 4.5,
		addDate: "2026-04-16T10:30:00Z",
		lastVisit: "2026-04-16T10:30:00Z",
		useFrequency: "daily",
	},
];

// 获取所有网站
export const getWebsitesList = (limit?: number) => {
	const sortedData = [...websitesData].sort(
		(a, b) => new Date(b.addDate).getTime() - new Date(a.addDate).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按分类统计
export const getWebsitesByCategory = () => {
	const grouped: Record<string, WebsiteItem[]> = {};
	websitesData.forEach((website) => {
		if (!grouped[website.category]) {
			grouped[website.category] = [];
		}
		grouped[website.category].push(website);
	});
	return grouped;
};

// 获取所有标签
export const getAllWebsitesTags = () => {
	const tags = new Set<string>();
	websitesData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 按使用频率分类
export const getWebsitesByFrequency = (frequency: "daily" | "weekly" | "monthly" | "rarely") => {
	return websitesData.filter((website) => website.useFrequency === frequency);
};

// 按评分排序
export const getWebsitesByRating = (minRating: number = 4) => {
	return websitesData.filter((website) => website.rating >= minRating);
};
