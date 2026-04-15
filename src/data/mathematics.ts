// 数学学习数据配置
// 用于管理学习中的数学内容和进度

export interface MathItem {
	id: number;
	title: string;
	chapter: string;
	topic: string;
	level: "basic" | "intermediate" | "advanced";
	status: "learning" | "mastered" | "review" | "planned";
	progress: number; // 0-100
	notes?: string;
	resources?: string[]; // 学习资源链接
	startDate: string;
	completedDate?: string;
	tags?: string[];
	practiceProblems?: number;
	score?: number; // 练习成绩
}

// 数学学习数据
const mathematicsData: MathItem[] = [
	{
		id: 1,
		title: "Linear Algebra",
		chapter: "Chapter 1",
		topic: "Matrices and Vectors",
		level: "intermediate",
		status: "learning",
		progress: 60,
		notes: "Focus on eigenvalues and eigenvectors",
		resources: ["https://example.com/linear-algebra"],
		startDate: "2026-04-01T08:00:00Z",
		tags: ["Linear Algebra", "Matrices"],
		practiceProblems: 15,
		score: 85,
	},
];

// 获取所有数学学习内容
export const getMathematicsList = (limit?: number) => {
	const sortedData = [...mathematicsData].sort(
		(a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按状态分类
export const getMathByStatus = (status: "learning" | "mastered" | "review" | "planned") => {
	return mathematicsData.filter((item) => item.status === status);
};

// 按难度分类
export const getMathByLevel = (level: "basic" | "intermediate" | "advanced") => {
	return mathematicsData.filter((item) => item.level === level);
};

// 获取学习进度统计
export const getMathProgress = () => {
	const total = mathematicsData.length;
	const mastered = mathematicsData.filter((item) => item.status === "mastered").length;
	const learning = mathematicsData.filter((item) => item.status === "learning").length;
	const review = mathematicsData.filter((item) => item.status === "review").length;
	return { total, mastered, learning, review };
};

// 获取所有标签
export const getAllMathTags = () => {
	const tags = new Set<string>();
	mathematicsData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 计算平均分
export const getAverageScore = () => {
	const itemsWithScores = mathematicsData.filter((item) => item.score);
	if (itemsWithScores.length === 0) return 0;
	const sum = itemsWithScores.reduce((total, item) => total + (item.score || 0), 0);
	return Math.round(sum / itemsWithScores.length);
};
