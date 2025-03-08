import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取单词列表
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const levelId = searchParams.get('levelId');
    const topicId = searchParams.get('topicId');

    if (!levelId || !topicId) {
      return NextResponse.json(
        { error: '缺少级别ID或主题ID参数' },
        { status: 400 }
      );
    }

    const words = await prisma.word.findMany({
      where: {
        levelId,
        topicId,
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error('获取单词失败:', error);
    return NextResponse.json(
      { error: '获取单词失败' },
      { status: 500 }
    );
  }
} 