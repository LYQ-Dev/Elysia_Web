// 运动数据配置
// 用于管理生活中的运动记录

export interface SportItem {
	id: number;
	name: string;
	category: "cardio" | "strength" | "flexibility" | "ball" | "outdoor" | "other";
	duration: number; // 分钟
	distance?: number; // 公里
	calories?: number; // 卡路里
	difficulty: "easy" | "medium" | "hard";
	location?: string;
	date: string;
	notes?: string;
	image?: string;
	tags?: string[];
}

// 运动数据
const sportsData: SportItem[] = [
	{
		id: 1,
		name: "Morning Run",
		category: "cardio",
		duration: 30,
		distance: 5.2,
		calories: 350,
		difficulty: "medium",
		location: "Local Park",
		date: "2026-04-16T07:00:00Z",
		tags: ["Running", "Morning"],
		notes: "Great weather today!",
	},
];

// 获取所有运动记录（按时间倒序）
export const getSportsList = (limit?: number) => {
	const sortedData = [...sportsData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按分类统计
export const getSportsByCategory = () => {
	const grouped: Record<string, SportItem[]> = {};
	sportsData.forEach((sport) => {
		if (!grouped[sport.category]) {
			grouped[sport.category] = [];
		}
		grouped[sport.category].push(sport);
	});
	return grouped;
};

// 获取总运动时长（分钟）
export const getTotalDuration = () => {
	return sportsData.reduce((total, sport) => total + sport.duration, 0);
};

// 获取总卡路里消耗
export const getTotalCalories = () => {
	return sportsData.reduce((total, sport) => total + (sport.calories || 0), 0);
};

// 按难度获取运动
export const getSportsByDifficulty = (difficulty: "easy" | "medium" | "hard") => {
	return sportsData.filter((sport) => sport.difficulty === difficulty);
};
