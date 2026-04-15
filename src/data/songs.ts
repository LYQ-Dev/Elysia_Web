// 歌曲数据配置
// 用于管理生活中喜欢的歌曲

export interface SongItem {
	id: number;
	title: string;
	artist: string;
	album: string;
	cover: string;
	link: string;
	tags?: string[];
	rating: number;
	addDate: string;
	description?: string;
}

// 歌曲数据
const songsData: SongItem[] = [
	{
		id: 1,
		title: "Sample Song",
		artist: "Sample Artist",
		album: "Sample Album",
		cover: "/images/songs/sample.webp",
		link: "https://music.example.com",
		tags: ["Pop", "Favorite"],
		rating: 5,
		addDate: "2026-04-16T10:30:00Z",
		description: "A sample song entry",
	},
];

// 获取所有歌曲列表（按添加时间倒序）
export const getSongsList = (limit?: number) => {
	const sortedData = [...songsData].sort(
		(a, b) => new Date(b.addDate).getTime() - new Date(a.addDate).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllSongsTags = () => {
	const tags = new Set<string>();
	songsData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 按艺术家分组
export const getSongsByArtist = () => {
	const grouped: Record<string, SongItem[]> = {};
	songsData.forEach((song) => {
		if (!grouped[song.artist]) {
			grouped[song.artist] = [];
		}
		grouped[song.artist].push(song);
	});
	return grouped;
};

// 按评分获取歌曲
export const getSongsByRating = (minRating: number = 4) => {
	return songsData.filter((song) => song.rating >= minRating);
};
