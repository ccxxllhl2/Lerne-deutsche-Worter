const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 清理已有数据
  await prisma.word.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.level.deleteMany();
  
  // 创建德语级别 A1-C1
  const levels = [
    { name: 'A1' },
    { name: 'A2' },
    { name: 'B1' },
    { name: 'B2' },
    { name: 'C1' },
  ];
  
  console.log('开始添加德语级别...');
  
  for (const level of levels) {
    await prisma.level.create({
      data: level,
    });
  }
  
  console.log('德语级别添加完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 