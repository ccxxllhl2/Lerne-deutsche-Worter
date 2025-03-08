import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: '单词数据无效' },
        { status: 400 }
      );
    }

    // 检查级别和主题是否存在
    const firstWord = words[0];
    const level = await prisma.level.findUnique({
      where: { id: firstWord.levelId },
    });
    const topic = await prisma.topic.findUnique({
      where: { id: firstWord.topicId },
    });

    if (!level || !topic) {
      return NextResponse.json(
        { error: '级别或主题不存在' },
        { status: 400 }
      );
    }

    // 使用事务批量创建单词
    const result = await prisma.$transaction(async (tx) => {
      let count = 0;

      for (const word of words) {
        // 检查单词是否已存在
        const existingWord = await tx.word.findFirst({
          where: {
            german: word.german,
            levelId: word.levelId,
            topicId: word.topicId,
          },
        });

        // 如果不存在，则创建
        if (!existingWord) {
          await tx.word.create({
            data: {
              german: word.german,
              chinese: word.chinese,
              levelId: word.levelId,
              topicId: word.topicId,
            },
          });
          count++;
        }
      }

      return count;
    });

    return NextResponse.json({ count: result });
  } catch (error) {
    console.error('上传单词失败:', error);
    return NextResponse.json(
      { error: '上传单词失败' },
      { status: 500 }
    );
  }
} 