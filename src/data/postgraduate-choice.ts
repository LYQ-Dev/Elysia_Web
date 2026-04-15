// 考研择校数据配置
// 用于管理考研相关的学校信息和规划

export interface PostgraduateSchool {
	id: number;
	universityName: string;
	province: string;
	major: string;
	researchDirection?: string;
	ranking: number; // 大学排名
	difficulty: "easy" | "moderate" | "hard" | "very-hard";
	status: "target" | "backup" | "stretch" | "safety" | "planned";
	tuitionFee?: number;
	scholarshipLevel?: string;
	professorsOfInterest?: string[];
	labFocus?: string;
	admissionRate?: number; // 录取率 %
	averageScore?: number; // 平均成绩
	targetScore: number; // 目标分数
	achievedScore?: number; // 已达成绩
	admissionRequirements?: string;
	applicationDeadline?: string;
	notes?: string;
	link?: string;
	tags?: string[];
	addDate: string;
}

// 考研择校数据
const postgraduateChoiceData: PostgraduateSchool[] = [
	{
		id: 1,
		universityName: "Example University",
		province: "Beijing",
		major: "Computer Science",
		researchDirection: "Artificial Intelligence",
		ranking: 5,
		difficulty: "hard",
		status: "target",
		tuitionFee: 8000,
		scholarshipLevel: "First-class",
		professorsOfInterest: ["Prof. Chen", "Prof. Wang"],
		labFocus: "Deep Learning Optimization",
		admissionRate: 15,
		averageScore: 370,
		targetScore: 380,
		achievedScore: 375,
		admissionRequirements: "Bachelor's degree, research experience preferred",
		applicationDeadline: "2026-10-31",
		notes: "Strong AI research group, good employment prospects",
		link: "https://example.com/graduate",
		tags: ["Top-tier", "AI", "Research"],
		addDate: "2026-03-01T10:00:00Z",
	},
];

// 获取所有择校信息
export const getPostgraduateList = (limit?: number) => {
	const sortedData = [...postgraduateChoiceData].sort(
		(a, b) => a.ranking - b.ranking,
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按状态分类（目标/备选/冲刺/保底）
export const getSchoolsByStatus = (status: "target" | "backup" | "stretch" | "safety" | "planned") => {
	return postgraduateChoiceData.filter((school) => school.status === status);
};

// 按难度分类
export const getSchoolsByDifficulty = (difficulty: "easy" | "moderate" | "hard" | "very-hard") => {
	return postgraduateChoiceData.filter((school) => school.difficulty === difficulty);
};

// 按省份分类
export const getSchoolsByProvince = (province: string) => {
	return postgraduateChoiceData.filter((school) => school.province === province);
};

// 获取分数范围内的学校
export const getSchoolsByScoreRange = (minScore: number, maxScore: number) => {
	return postgraduateChoiceData.filter(
		(school) => school.targetScore >= minScore && school.targetScore <= maxScore,
	);
};

// 统计择校信息
export const getSchoolsStatistics = () => {
	const total = postgraduateChoiceData.length;
	const target = postgraduateChoiceData.filter((s) => s.status === "target").length;
	const backup = postgraduateChoiceData.filter((s) => s.status === "backup").length;
	const stretch = postgraduateChoiceData.filter((s) => s.status === "stretch").length;
	const safety = postgraduateChoiceData.filter((s) => s.status === "safety").length;
	return { total, target, backup, stretch, safety };
};

// 获取所有标签
export const getAllPostgraduateTags = () => {
	const tags = new Set<string>();
	postgraduateChoiceData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 获取需要准备的学校列表
export const getPreparationList = () => {
	return postgraduateChoiceData.filter(
		(school) => school.status === "target" || school.status === "backup" || school.status === "stretch",
	);
};
