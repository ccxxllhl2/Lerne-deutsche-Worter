import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 删除主题
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // 检查主题是否存在
    const topic = await prisma.topic.findUnique({
      where: { id },
    });

    if (!topic) {
      return NextResponse.json(
        { error: '主题不存在' },
        { status: 404 }
      );
    }

    // 主题存在，删除它
    await prisma.topic.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除主题失败:', error);
    return NextResponse.json(
      { error: '删除主题失败' },
      { status: 500 }
    );
  }
} 