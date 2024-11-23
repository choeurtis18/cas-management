import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Gestionnaire pour les requêtes GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        dues: true,
        members: true,
      },
    });

    if (!category) {
      console.error('No category found');
      return NextResponse.json({ message: 'No category found' }, { status: 404 });
    }

    console.log('GET API/category/[id]: category found:', category);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Gestionnaire pour les requêtes PATCH
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const category = await prisma.category.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name,
        description,
        update_date: new Date(),
      },
    });

    console.log('PATCH API/category/[id]: category updated:', category);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Gestionnaire pour les requêtes DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    console.log('DELETE API/category/[id]: category deleted:', category);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
