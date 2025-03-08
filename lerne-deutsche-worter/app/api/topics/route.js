import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取主题列表
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const levelId = searchParams.get('levelId');

    if (!levelId) {
      return NextResponse.json(
        { error: '缺少级别ID参数' },
        { status: 400 }
      );
    }

    const topics = await prisma.topic.findMany({
      where: {
        levelId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error('获取主题失败:', error);
    return NextResponse.json(
      { error: '获取主题失败' },
      { status: 500 }
    );
  }
}

// 创建新主题
export async function POST(request) {
  try {
    const { name, levelId } = await request.json();

    if (!name || !levelId) {
      return NextResponse.json(
        { error: '主题名称和级别ID不能为空' },
        { status: 400 }
      );
    }

    // 检查级别是否存在
    const level = await prisma.level.findUnique({
      where: { id: levelId },
    });

    if (!level) {
      return NextResponse.json(
        { error: '级别不存在' },
        { status: 400 }
      );
    }

    // 检查主题名称在此级别下是否已存在
    const existingTopic = await prisma.topic.findFirst({
      where: {
        name,
        levelId,
      },
    });

    if (existingTopic) {
      return NextResponse.json(
        { error: '此级别下的主题名称已存在' },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        levelId,
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error('创建主题失败:', error);
    return NextResponse.json(
      { error: '创建主题失败' },
      { status: 500 }
    );
  }
} 