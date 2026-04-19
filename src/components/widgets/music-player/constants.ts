import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "春日影",
		artist: "藤田淳平",
		cover: "assets/music/cover/music.webp",
		url: "assets/music/url/chunriying.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "花の塔",
		artist: "さユり",
		cover: "assets/music/cover/music.webp",
		url: "assets/music/url/huazhita.mp3",
		duration: 240,
	},
	{
		id: 3,
		title: "手写的从前",
		artist: "周杰伦",
		cover: "assets/music/cover/music.webp",
		url: "assets/music/url/shouxiedecongqian.mp3",
		duration: 180,
	},
	{
		id: 4,
		title: "游园会",
		artist: "周杰伦",
		cover: "assets/music/cover/music.webp",
		url: "assets/music/url/youyuanhui.mp3",
		duration: 200,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "assets/music/cover/music.webp",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
