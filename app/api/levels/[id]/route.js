import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 删除级别
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // 检查级别是否存在
    const level = await prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      return NextResponse.json(
        { error: '级别不存在' },
        { status: 404 }
      );
    }

    // 级别存在，删除它
    await prisma.level.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除级别失败:', error);
    return NextResponse.json(
      { error: '删除级别失败' },
      { status: 500 }
    );
  }
} 