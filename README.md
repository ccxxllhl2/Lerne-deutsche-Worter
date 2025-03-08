# 学习德语词汇
本项目是配套[德国之声官方德语学习站点](https://learngerman.dw.com/)的词语复习APP。会按照级别（A1-C1）和课程主题（对应课程中的章节等）进行分类。例如，你既可以完整学习A1的所有词汇，也可以对B2某一节课的词汇进行学习。

## 使用说明
该项目通过 Next.js 构建，首先按照 Next.js 官网安装基本环境，之后按以下步骤部署并开始使用

* 进入应用目录
cd lerne-deutsche-worter

* 安装依赖
npm install

* 生成Prisma客户端
npx prisma generate

* 创建数据库并应用模型
npx prisma migrate dev --name init

* 初始化基础数据
npm run seed

* 在服务器上运行
npm run dev -- -H 0.0.0.0 -p 3001