import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get('topicId');

    if (!topicId) {
      return NextResponse.json(
        { error: '缺少主题ID参数' },
        { status: 400 }
      );
    }

    const count = await prisma.word.count({
      where: {
        topicId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('获取单词数量失败:', error);
    return NextResponse.json(
      { error: '获取单词数量失败' },
      { status: 500 }
    );
  }
} 