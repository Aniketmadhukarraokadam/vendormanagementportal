import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const r = await prisma.requirement.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            vendor: true,
          },
        },
      },
    });

    if (!r) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    let mandatorySkills = [];
    let primarySkills = [];
    let secondarySkills = [];

    try { mandatorySkills = JSON.parse(r.mandatorySkills); } catch {}
    try { primarySkills = JSON.parse(r.primarySkills); } catch {}
    try { secondarySkills = JSON.parse(r.secondarySkills); } catch {}

    return NextResponse.json({
      requirement: {
        id: r.id,
        title: r.title,
        description: r.description,
        jobType: r.jobType,
        location: r.location,
        minExperience: r.minExperience,
        targetClosureDate: r.targetClosureDate,
        budget: r.budget,
        mandatorySkills,
        primarySkills,
        secondarySkills,
        status: r.status,
        createdBy: r.createdById,
        postedDate: r.postedDate,
        totalSubmissions: r.submissions.length,
        submissions: r.submissions,
      },
    });
  } catch (error: any) {
    console.error('Fetch requirement detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch requirement' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.budget !== undefined) dataToUpdate.budget = body.budget;
    if (body.location !== undefined) dataToUpdate.location = body.location;
    if (body.jobType !== undefined) dataToUpdate.jobType = body.jobType;
    if (body.minExperience !== undefined) dataToUpdate.minExperience = Number(body.minExperience);
    if (body.targetClosureDate !== undefined) dataToUpdate.targetClosureDate = body.targetClosureDate;
    if (body.mandatorySkills !== undefined) dataToUpdate.mandatorySkills = JSON.stringify(body.mandatorySkills);
    if (body.primarySkills !== undefined) dataToUpdate.primarySkills = JSON.stringify(body.primarySkills);
    if (body.secondarySkills !== undefined) dataToUpdate.secondarySkills = JSON.stringify(body.secondarySkills);

    const updated = await prisma.requirement.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, requirement: updated });
  } catch (error: any) {
    console.error('Update requirement error:', error);
    return NextResponse.json({ error: 'Failed to update requirement' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.requirement.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Requirement deleted' });
  } catch (error: any) {
    console.error('Delete requirement error:', error);
    return NextResponse.json({ error: 'Failed to delete requirement' }, { status: 500 });
  }
}
