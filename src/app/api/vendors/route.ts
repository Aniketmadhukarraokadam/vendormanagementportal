import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: {
        companyName: 'asc',
      },
    });

    const formatted = vendors.map((v) => ({
      id: v.id,
      companyName: v.companyName,
      contactPerson: v.contactPerson,
      email: v.email,
      phone: v.phone || undefined,
      address: v.address || undefined,
      isActive: v.isActive,
      createdAt: v.createdAt.toISOString(),
      totalSubmissions: v._count.submissions,
    }));

    return NextResponse.json({ vendors: formatted });
  } catch (error: any) {
    console.error('Fetch vendors error:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, contactPerson, email, phone, address } = body;

    if (!companyName || !email || !contactPerson) {
      return NextResponse.json(
        { error: 'Company name, contact person, and email are required' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        companyName,
        contactPerson,
        email: email.trim().toLowerCase(),
        phone,
        address,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, vendor }, { status: 201 });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}
