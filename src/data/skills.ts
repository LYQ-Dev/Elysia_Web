// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
id: string;
name: string;
description: string;
icon: string; // Iconify icon name
category: "frontend" | "backend" | "database" | "tools" | "other";
level: "beginner" | "intermediate" | "advanced" | "expert";
experience: {
years: number;
months: number;
};
projects?: string[]; // Related project IDs
certifications?: string[];
color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
{
id: "c",
name: "C",
description: "掌握 C 语言基础语法、指针、内存管理与常见算法实现。",
icon: "logos:c",
category: "backend",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#A8B9CC",
},
{
id: "cpp",
name: "C++",
description: "具备 C++ 面向对象与 STL 使用能力，可完成中等复杂度程序开发。",
icon: "logos:c-plusplus",
category: "backend",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#00599C",
},
{
id: "python",
name: "Python",
description: "能够使用 Python 完成脚本开发、数据处理与基础后端任务。",
icon: "logos:python",
category: "backend",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#3776AB",
},
{
id: "java",
name: "Java",
description: "掌握 Java 基础、集合框架与面向对象编程，具备后端开发能力。",
icon: "logos:java",
category: "backend",
level: "intermediate",
experience: { years: 1, months: 8 },
color: "#ED8B00",
},
{
id: "html",
name: "HTML",
description: "熟悉语义化标签与页面结构设计，能够构建规范可维护的页面骨架。",
icon: "logos:html-5",
category: "frontend",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#E34F26",
},
{
id: "css",
name: "CSS",
description: "掌握布局、响应式设计与常见动效实现，能够独立完成页面样式开发。",
icon: "logos:css-3",
category: "frontend",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#1572B6",
},
{
id: "javascript",
name: "JavaScript",
description: "熟悉 ES6+、异步编程与 DOM 交互，能够实现常见前端业务逻辑。",
icon: "logos:javascript",
category: "frontend",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#F7DF1E",
},
{
id: "computer-network",
name: "计算机网络",
description: "掌握 TCP/IP、HTTP/HTTPS、路由交换与常见网络故障排查基础。",
icon: "material-symbols:lan",
category: "other",
level: "intermediate",
experience: { years: 1, months: 6 },
color: "#0EA5E9",
},
{
id: "operating-system",
name: "操作系统",
description: "理解进程线程、内存管理、文件系统与调度机制等核心概念。",
icon: "material-symbols:desktop-windows",
category: "other",
level: "intermediate",
experience: { years: 1, months: 6 },
color: "#334155",
},
{
id: "data-structure",
name: "数据结构",
description: "掌握线性表、树、图、哈希等结构及其典型算法应用。",
icon: "material-symbols:account-tree",
category: "other",
level: "advanced",
experience: { years: 2, months: 0 },
color: "#7C3AED",
},
{
id: "computer-organization",
name: "计算机组成",
description: "理解计算机硬件组成、指令执行流程与存储层次结构。",
icon: "material-symbols:memory",
category: "other",
level: "intermediate",
experience: { years: 1, months: 3 },
color: "#6366F1",
},
{
id: "spring-boot",
name: "Spring Boot",
description: "能够基于 Spring Boot 构建 RESTful API，并完成基础后端服务开发。",
icon: "logos:spring-icon",
category: "backend",
level: "intermediate",
experience: { years: 1, months: 2 },
color: "#6DB33F",
},
{
id: "mysql",
name: "MySQL",
description: "掌握关系型数据库设计、SQL 编写与基础性能优化。",
icon: "logos:mysql-icon",
category: "database",
level: "intermediate",
experience: { years: 1, months: 6 },
color: "#4479A1",
},
{
id: "redis",
name: "Redis",
description: "能够使用 Redis 进行缓存、会话管理与基础数据结构存储。",
icon: "logos:redis",
category: "database",
level: "beginner",
experience: { years: 0, months: 8 },
color: "#DC382D",
},
];
