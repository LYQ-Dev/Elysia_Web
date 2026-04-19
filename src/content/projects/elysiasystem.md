---
title: JAVAWeb-ElysiaSystem
description: 基于 Spring Boot + MyBatis 的教务综合管理后端系统，支持 JWT 鉴权、OSS 上传与数据报表。
image: ""
category: web
techStack:
  - Java
  - Spring Boot
  - MyBatis
  - MySQL
  - JWT
status: in-progress
sourceCode: https://github.com/LYQ-Dev/JAVAWeb-ElysiaSystem
startDate: 2026-04-19
featured: false
tags:
  - Java
  - Backend
  - Management
---

# JAVAWeb-ElysiaSystem

> 一个基于 Spring Boot + MyBatis 构建的人员与教务综合管理后端系统，提供部门、员工、班级、学生的全链路 CRUD 管理，集成 JWT 鉴权、阿里云 OSS 文件上传、AOP 操作日志以及多维度数据报表功能。

GitHub 仓库：[LYQ-Dev/JAVAWeb-ElysiaSystem](https://github.com/LYQ-Dev/JAVAWeb-ElysiaSystem)

---

## 目录

- [技术栈](#技术栈)
- [功能模块](#功能模块)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
  - [前置要求](#前置要求)
  - [配置](#配置)
  - [构建 & 运行](#构建--运行)
- [API 概览](#api-概览)
- [鉴权机制](#鉴权机制)
- [操作日志](#操作日志)

---

## 技术栈

| 分类 | 技术 / 版本 |
|------|------------|
| 语言 | Java 17 |
| 框架 | Spring Boot 4.0.1 |
| ORM | MyBatis + mybatis-spring-boot-starter 4.0.0 |
| 数据库 | MySQL 8 |
| 分页 | PageHelper 2.1.0 |
| 鉴权 | JWT (jjwt 0.9.1) |
| 对象存储 | 阿里云 OSS SDK 3.17.4 |
| AOP | Spring AOP |
| 工具 | Lombok |
| 构建 | Maven |

---

## 功能模块

| 模块 | 功能 |
|------|------|
| **登录** | 用户名/密码登录，签发 JWT 令牌 |
| **部门管理** | 查询列表、新增、修改、删除（有员工时禁止删除） |
| **员工管理** | 分页查询（姓名/性别/入职日期筛选）、新增、修改、删除、按部门统计人数 |
| **班级管理** | 分页查询、查询全部、新增、修改、删除 |
| **学生管理** | 分页查询、新增、修改、删除、违纪扣分管理 |
| **文件上传** | 上传文件至阿里云 OSS，返回访问 URL |
| **数据报表** | 员工职位分布、员工性别分布、学生学历分布 |
| **操作日志** | 基于 AOP 的操作日志自动记录（操作人、方法、参数、耗时） |
| **全局异常** | 统一异常拦截与错误响应封装 |

---

## 项目结构

```
src/main/java/com/lyq/
├── TilasWebManagementApplication.java   # 启动类
├── anno/
│   └── LogOperation.java                # 操作日志自定义注解
├── aop/
│   └── OperationLogAspect.java          # 操作日志 AOP 切面
├── controller/                          # REST 控制器层
│   ├── LoginController.java
│   ├── DeptController.java
│   ├── EmpController.java
│   ├── ClazzController.java
│   ├── StudentController.java
│   ├── UploadController.java
│   └── ReportController.java
├── service/                             # 业务逻辑层（接口 + 实现）
├── mapper/                              # MyBatis Mapper 接口
├── pojo/                                # 实体类 & VO
├── filter/
│   └── TokenFilter.java                 # JWT 令牌校验过滤器
├── exception/
│   └── GlobalExceptionHandler.java      # 全局异常处理
└── utils/
    ├── JwtUtils.java                    # JWT 工具类
    ├── AliyunOSSOperator.java           # 阿里云 OSS 工具类
    ├── AliyunOSSProperties.java         # OSS 配置属性绑定
    └── CurrentHolder.java               # ThreadLocal 当前用户持有器

src/main/resources/
├── application.yml                      # 应用配置
├── logback.xml                          # 日志配置
└── com/lyq/mapper/                      # MyBatis XML 映射文件
```

---

## 快速开始

### 前置要求

- JDK 17+
- Maven 3.8+
- MySQL 8+
- 阿里云 OSS Bucket（用于文件上传）

### 配置

1. 创建数据库 `tlias` 并导入对应建表 SQL。

2. 修改 `src/main/resources/application.yml`，填入实际配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tlias
    username: <your_db_user>
    password: <your_db_password>

aliyun:
  oss:
    endpoint: https://oss-cn-<region>.aliyuncs.com
    bucketName: <your_bucket_name>
    region: cn-<region>
```

> **注意**：阿里云 AccessKey 建议通过环境变量或配置中心注入，切勿硬编码在代码中。

### 构建 & 运行

```bash
# 克隆仓库
git clone https://github.com/LYQ-Dev/JAVAWeb-ElysiaSystem.git
cd JAVAWeb-ElysiaSystem

# 打包（跳过测试）
mvn clean package -DskipTests

# 运行
java -jar target/tilas-web-management-0.0.1-SNAPSHOT.jar
```

服务默认监听 `http://localhost:8080`。

---

## API 概览

所有接口（除登录外）均需在请求头携带 JWT 令牌：

```
token: <your_jwt_token>
```

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/login` | 登录，返回 JWT |
| GET | `/depts` | 查询部门列表 |
| POST | `/depts` | 新增部门 |
| PUT | `/depts` | 修改部门 |
| DELETE | `/depts?id={id}` | 删除部门 |
| GET | `/emps` | 分页查询员工 |
| POST | `/emps` | 新增员工 |
| PUT | `/emps` | 修改员工 |
| DELETE | `/emps?ids={id,...}` | 批量删除员工 |
| GET | `/clazzs` | 分页查询班级 |
| POST | `/clazzs` | 新增班级 |
| PUT | `/clazzs` | 修改班级 |
| DELETE | `/clazzs/{id}` | 删除班级 |
| GET | `/students` | 分页查询学生 |
| POST | `/students` | 新增学生 |
| PUT | `/students` | 修改学生 |
| DELETE | `/students/{ids}` | 批量删除学生 |
| PUT | `/students/violation/{id}/{score}` | 学生违纪扣分 |
| POST | `/upload` | 上传文件至 OSS |
| GET | `/report/empJobData` | 员工职位分布 |
| GET | `/report/empGenderData` | 员工性别分布 |
| GET | `/report/studentDegreeData` | 学生学历分布 |

---

## 鉴权机制

系统使用 JWT（JSON Web Token）进行无状态鉴权：

1. 客户端通过 `/login` 接口提交凭证，服务端签发 JWT 并返回。
2. 后续请求在 HTTP Header 中携带 `token` 字段。
3. `TokenFilter` 拦截所有请求，解析并校验令牌有效性；校验通过后将当前用户 ID 存入 `ThreadLocal`，供后续业务层使用。
4. 请求结束后自动清理 `ThreadLocal`，防止内存泄漏。

---

## 操作日志

在需要记录操作日志的方法上添加 `@LogOperation` 注解，AOP 切面 `OperationLogAspect` 将自动：

- 记录操作员工 ID、操作时间、类名、方法名、方法参数、返回值及耗时。
- 将日志持久化到数据库 `operate_log` 表。

```java
@LogOperation
@PostMapping
public Result addClazz(@RequestBody Clazz clazz) { ... }
```
