import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const jobType = searchParams.get('jobType');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (jobType && jobType !== 'all') {
      where.jobType = jobType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const requirements = await prisma.requirement.findMany({
      where,
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = requirements.map((r) => {
      let mandatorySkills = [];
      let primarySkills = [];
      let secondarySkills = [];

      try { mandatorySkills = JSON.parse(r.mandatorySkills); } catch {}
      try { primarySkills = JSON.parse(r.primarySkills); } catch {}
      try { secondarySkills = JSON.parse(r.secondarySkills); } catch {}

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        jobType: r.jobType,
        location: r.location,
        minExperience: r.minExperience,
        targetClosureDate: r.targetClosureDate,
        budget: r.budget || undefined,
        mandatorySkills,
        primarySkills,
        secondarySkills,
        status: r.status,
        createdBy: r.createdById,
        postedDate: r.postedDate,
        totalSubmissions: r._count.submissions,
      };
    });

    return NextResponse.json({ requirements: formatted });
  } catch (error: any) {
    console.error('Fetch requirements error:', error);
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      jobType = 'remote',
      location = 'Remote',
      minExperience = 0,
      targetClosureDate,
      budget,
      mandatorySkills = [],
      primarySkills = [],
      secondarySkills = [],
      status = 'open',
      createdById = 'u1',
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const requirement = await prisma.requirement.create({
      data: {
        title,
        description,
        jobType,
        location,
        minExperience: Number(minExperience),
        targetClosureDate: targetClosureDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        budget,
        mandatorySkills: JSON.stringify(mandatorySkills),
        primarySkills: JSON.stringify(primarySkills),
        secondarySkills: JSON.stringify(secondarySkills),
        status,
        createdById,
        postedDate: new Date().toISOString().split('T')[0],
      },
    });

    return NextResponse.json({ success: true, requirement }, { status: 201 });
  } catch (error: any) {
    console.error('Create requirement error:', error);
    return NextResponse.json({ error: 'Failed to create requirement' }, { status: 500 });
  }
}
