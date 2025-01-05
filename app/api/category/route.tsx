import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        dues: true,
        members: true,
      },
    });

    if (categories.length === 0) {
      console.error('No categories found');
      return NextResponse.json({ message: 'No categories found' }, { status: 404 });
    }

    console.log('GET API/category: categories found:', categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in API/category:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.description) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
        creation_date: new Date(),
        update_date: new Date(),
      },
    });

    console.log('POST API/category: category created:', category);

    const members = await prisma.member.findMany();
    if (members.length === 0) {
      console.log('No members found. Add members before creating categories.');
      return NextResponse.json({ message: 'No members found' }, { status: 400 });
    }

    const months = await prisma.month.findMany();
    if (months.length === 0) {
      console.log('No months found. Add months before creating categories.');
      return NextResponse.json({ message: 'No months found' }, { status: 400 });
    }

    for (const member of members) {
      for (const month of months) {
        await prisma.dues.create({
          data: {
            amount: 0,
            isLate: false,
            memberId: member.id,
            categoryId: category.id,
            monthId: month.id,
          },
        });
        console.log('Dues created successfully!');
      }
    }

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error in API/category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
