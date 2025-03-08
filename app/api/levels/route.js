import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取所有级别
export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(levels);
  } catch (error) {
    console.error('获取级别失败:', error);
    return NextResponse.json(
      { error: '获取级别失败' },
      { status: 500 }
    );
  }
}

// 创建新级别
export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: '级别名称不能为空' },
        { status: 400 }
      );
    }

    // 检查级别是否已存在
    const existingLevel = await prisma.level.findUnique({
      where: { name },
    });

    if (existingLevel) {
      return NextResponse.json(
        { error: '级别已存在' },
        { status: 400 }
      );
    }

    const level = await prisma.level.create({
      data: { name },
    });

    return NextResponse.json(level);
  } catch (error) {
    console.error('创建级别失败:', error);
    return NextResponse.json(
      { error: '创建级别失败' },
      { status: 500 }
    );
  }
} 