// 专业课学习数据配置
// 用于管理学习中的专业课内容和进度

export interface ProfessionalCourseItem {
	id: number;
	courseName: string;
	instructor: string;
	department: string;
	semester: string;
	credits: number;
	status: "completed" | "enrolled" | "planned";
	grade?: number; // 0-100
	finalGrade?: string; // A+, A, B, 等
	attendance?: number; // 出勤次数
	assignments?: number; // 作业完成数
	midtermScore?: number;
	finalExamScore?: number;
	syllabus?: string; // 课程大纲链接
	notes?: string;
	materials?: string[]; // 学习资料链接
	startDate: string;
	endDate?: string;
	tags?: string[];
}

// 专业课学习数据
const professionalCoursesData: ProfessionalCourseItem[] = [
	{
		id: 1,
		courseName: "Data Structures and Algorithms",
		instructor: "Prof. Smith",
		department: "Computer Science",
		semester: "Spring 2026",
		credits: 3,
		status: "enrolled",
		attendance: 14,
		assignments: 8,
		midtermScore: 88,
		grade: 85,
		notes: "Focus on graph algorithms and dynamic programming",
		materials: ["https://example.com/materials"],
		startDate: "2026-02-01T10:00:00Z",
		tags: ["CS", "Algorithms"],
	},
];

// 获取所有专业课
export const getProfessionalCoursesList = (limit?: number) => {
	const sortedData = [...professionalCoursesData].sort(
		(a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 按状态分类
export const getCoursesByStatus = (status: "completed" | "enrolled" | "planned") => {
	return professionalCoursesData.filter((course) => course.status === status);
};

// 按学期统计
export const getCoursesBySemester = (semester: string) => {
	return professionalCoursesData.filter((course) => course.semester === semester);
};

// 计算学分总数
export const getTotalCredits = () => {
	const completed = professionalCoursesData.filter((course) => course.status === "completed");
	return completed.reduce((total, course) => total + course.credits, 0);
};

// 计算平均成绩
export const getAverageGrade = (status?: "completed" | "enrolled" | "planned") => {
	let courses = professionalCoursesData;
	if (status) {
		courses = courses.filter((course) => course.status === status);
	}
	const coursesWithGrade = courses.filter((course) => course.finalGrade || course.grade);
	if (coursesWithGrade.length === 0) return 0;
	const sum = coursesWithGrade.reduce((total, course) => total + (course.grade || 0), 0);
	return Math.round(sum / coursesWithGrade.length);
};

// 获取所有标签
export const getAllProfessionalTags = () => {
	const tags = new Set<string>();
	professionalCoursesData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// 获取进度统计
export const getCoursesProgress = () => {
	const total = professionalCoursesData.length;
	const completed = professionalCoursesData.filter((c) => c.status === "completed").length;
	const enrolled = professionalCoursesData.filter((c) => c.status === "enrolled").length;
	const planned = professionalCoursesData.filter((c) => c.status === "planned").length;
	return { total, completed, enrolled, planned };
};
