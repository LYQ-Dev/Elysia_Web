---
title: 翊雪快送 (Sky Take-Out)
description: 基于 Spring Boot 的前后端分离外卖点餐平台，包含管理后台与微信小程序用户端。
image: ""
category: web
techStack:
  - Java
  - Spring Boot
  - MyBatis
  - MySQL
  - Redis
status: in-progress
sourceCode: https://github.com/LYQ-Dev/JAVA-Project01
startDate: 2024-01-01
featured: false
tags:
  - Java
  - Spring Boot
  - Takeout
---

# 翊雪快送 (Sky Take-Out)

> 一个基于 Spring Boot 的前后端分离外卖点餐平台，提供商家管理后台与微信小程序用户端双端服务。

GitHub 仓库：[LYQ-Dev/JAVA-Project01](https://github.com/LYQ-Dev/JAVA-Project01)

![Java](https://img.shields.io/badge/Java-8+-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.3-brightgreen?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Redis](https://img.shields.io/badge/Redis-latest-red?logo=redis)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
  - [环境要求](#环境要求)
  - [配置说明](#配置说明)
  - [构建与运行](#构建与运行)
- [API 文档](#api-文档)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目简介

**苍穹外卖**是一套完整的外卖点餐系统，包含：

- **管理端**（Web 后台）：供商家管理员进行员工、菜品、套餐、订单等日常运营管理，并提供数据统计报表。
- **用户端**（微信小程序）：供顾客浏览菜品/套餐、管理购物车、下单支付、查看历史订单。

---

## 功能特性

### 管理端
| 模块 | 功能 |
|------|------|
| 员工管理 | 新增、分页查询、启用/禁用、修改员工信息 |
| 分类管理 | 菜品分类与套餐分类的增删改查 |
| 菜品管理 | 菜品及口味的增删改查、启停售 |
| 套餐管理 | 套餐及关联菜品的增删改查、启停售 |
| 订单管理 | 查询、接单/拒单、派送、完成、取消订单 |
| 数据报表 | 营业额统计、用户量统计、订单统计、销量 Top10 导出 Excel |
| 工作台 | 今日运营数据概览 |
| 文件上传 | 对接阿里云 OSS 进行图片上传 |

### 用户端
| 模块 | 功能 |
|------|------|
| 微信登录 | 微信小程序授权登录、JWT 鉴权 |
| 菜品/套餐浏览 | 按分类展示菜品与套餐列表 |
| 购物车 | 添加、删除、清空购物车 |
| 地址簿 | 收货地址的增删改查、设置默认地址 |
| 订单 | 下单、微信支付、催单、取消订单、再来一单、历史订单查询 |

### 系统特性
- **JWT 双端鉴权**：管理端与用户端使用独立 Token 配置
- **AOP 公共字段自动填充**：创建时间、更新时间、操作人自动维护
- **Redis 缓存**：菜品/套餐数据缓存、店铺营业状态缓存
- **WebSocket 实时推送**：新订单与催单消息实时推送至商家端
- **定时任务**：自动处理超时未付款订单与长时间未完成订单

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 后端框架 | Spring Boot 2.7.3 |
| 持久层 | MyBatis 2.2.0 + Druid 连接池 |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis |
| 认证授权 | JWT (jjwt 0.9.1) |
| API 文档 | Knife4j 3.0.2 |
| 文件存储 | 阿里云 OSS |
| 支付 | 微信支付 (wechatpay-apache-httpclient) |
| 实时通信 | Spring WebSocket |
| 报表导出 | Apache POI 3.16 |
| 分页插件 | PageHelper 1.3.0 |
| 其他工具 | Lombok、FastJSON、Commons-Lang、AOP |

---

## 项目结构

```
sky-take-out/
├── sky-common/          # 公共模块：工具类、常量、异常、属性配置
│   └── src/main/java/com/sky/
│       ├── constant/    # 常量定义
│       ├── context/     # ThreadLocal 上下文
│       ├── enumeration/ # 枚举类型
│       ├── exception/   # 自定义异常
│       ├── json/        # Jackson 自定义序列化
│       ├── properties/  # 配置属性（JWT、OSS、微信）
│       ├── result/      # 统一响应结果封装
│       └── utils/       # 工具类（JWT、OSS、微信支付、HttpClient）
│
├── sky-pojo/            # 实体模块：Entity、DTO、VO
│   └── src/main/java/com/sky/
│       ├── dto/         # 数据传输对象
│       ├── entity/      # 数据库实体
│       └── vo/          # 视图对象
│
└── sky-server/          # 服务模块：主程序入口
    └── src/main/java/com/sky/
        ├── annotation/  # 自定义注解（AutoFill）
        ├── aspect/      # AOP 切面
        ├── config/      # Spring 配置类
        ├── controller/
        │   ├── admin/   # 管理端接口
        │   └── user/    # 用户端接口
        ├── handler/     # 全局异常处理
        ├── interceptor/ # JWT 拦截器
        ├── mapper/      # MyBatis Mapper 接口
        ├── service/     # 业务逻辑接口及实现
        ├── task/        # 定时任务
        └── websocket/   # WebSocket 服务
```

---

## 快速开始

### 环境要求

- **JDK** 8 或以上
- **Maven** 3.6+
- **MySQL** 8.0+
- **Redis** 6.0+

### 配置说明

1. **克隆仓库**

   ```bash
   git clone https://github.com/LYQ-Dev/JAVA-Project01.git
   cd JAVA-Project01
   ```

2. **初始化数据库**

   在 MySQL 中创建数据库并导入 SQL 脚本（如项目提供）：

   ```sql
   CREATE DATABASE sky_take_out CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **修改配置文件**

   在 `sky-server/src/main/resources/` 下创建 `application-dev.yml`，填写以下配置：

   ```yaml
   sky:
     datasource:
       driver-class-name: com.mysql.cj.jdbc.Driver
       host: localhost
       port: 3306
       database: sky_take_out
       username: root
       password: your_password
     alioss:
       endpoint: oss-cn-hangzhou.aliyuncs.com
       access-key-id: your_access_key_id
       access-key-secret: your_access_key_secret
       bucket-name: your_bucket_name
     redis:
       host: localhost
       port: 6379
       password: your_redis_password
       database: 0
     wechat:
       appid: your_wechat_appid
       secret: your_wechat_secret
   ```

### 构建与运行

```bash
# 安装依赖并打包
mvn clean package -DskipTests

# 启动服务
java -jar sky-server/target/sky-server-1.0-SNAPSHOT.jar
```

服务默认监听 **8080** 端口。

---

## API 文档

项目集成了 **Knife4j**，启动后访问以下地址查看在线接口文档：

```
http://localhost:8080/doc.html
```

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add your feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
