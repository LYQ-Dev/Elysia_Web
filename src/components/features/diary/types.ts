import type { DiaryItem } from "../../../data/diary";

export interface MomentCardProps {
	moment: DiaryItem & { slug?: string };
	index: number;
	minutesAgo: string;
	hoursAgo: string;
	daysAgo: string;
	slug?: string;
}
