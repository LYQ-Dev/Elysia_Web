// 英语学习数据配置
// 用于管理学习中的英语内容和进度

export interface EnglishItem {
	id: number;
	title: string;
	category: "vocabulary" | "grammar" | "listening" | "speaking" | "writing" | "reading";
	level: "beginner" | "elementary" | "intermediate" | "upper-intermediate" | "advanced";
	status: "learning" | "mastered" | "review" | "planned";
	progress: number; // 0-100
	wordCount?: number; // 词汇数量
	practiceTime?: number; // 分钟
	score?: number; // 练习成绩
	notes?: string;
	resources?: string[]; // 学习资源
	startDate: string;
	completedDate?: string;
	tags?: string[];
}

// 英语学习数据
const englishData: EnglishItem[] = [
	{
		id: 1,
		title: "Present Tense",
		category: "grammar",
		level: "intermediate",
		status: "mastered",
		progress: 100,
		practiceTime: 120,
		score: 92,
		notes: "Simple and continuous forms",
		resources: ["https://example.com/grammar"],
		startDate: "2026-03-01T09:00:00Z",
		completedDate: "2026-04-01T09:00:00Z",
		tags: ["Grammar", "Tenses"],
	},
];

// 获取所有英语学习内容
export const getEnglishList = (limit?: number) => {
	const sortedData = [...englishData].sort(
		(a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按分类统计
export const getEnglishByCategory = () => {
	const grouped: Record<string, EnglishItem[]> = {};
	englishData.forEach((item) => {
		if (!grouped[item.category]) {
			grouped[item.category] = [];
		}
		grouped[item.category].push(item);
	});
	return grouped;
};

// 按级别分类
export const getEnglishByLevel = (level: string) => {
	return englishData.filter((item) => item.level === level);
};

// 按状态分类
export const getEnglishByStatus = (status: "learning" | "mastered" | "review" | "planned") => {
	return englishData.filter((item) => item.status === status);
};

// 获取学习进度统计
export const getEnglishProgress = () => {
	const total = englishData.length;
	const mastered = englishData.filter((item) => item.status === "mastered").length;
	const learning = englishData.filter((item) => item.status === "learning").length;
	const review = englishData.filter((item) => item.status === "review").length;
	return { total, mastered, learning, review };
};

// 获取所有标签
export const getAllEnglishTags = () => {
	const tags = new Set<string>();
	englishData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 计算总学习时间
export const getTotalPracticeTime = () => {
	return englishData.reduce((total, item) => total + (item.practiceTime || 0), 0);
};
