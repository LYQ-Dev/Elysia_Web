import type { TimelineItem } from "../components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "high-school-2020-2023",
		title: "高中",
		description: "2020 年至 2023 年高中学习阶段。",
		type: "education",
		startDate: "2020-09-01",
		endDate: "2023-06-30",
		organization: "High School",
		icon: "material-symbols:school",
		color: "#2563EB",
	},
	{
		id: "cau-2023-present",
		title: "CAU",
		description: "2023 年开始在 CAU 学习，至今。",
		type: "education",
		startDate: "2023-09-01",
		organization: "CAU",
		icon: "material-symbols:school",
		color: "#059669",
		featured: true,
	},
];
