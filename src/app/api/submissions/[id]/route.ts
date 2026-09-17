import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const s = await prisma.submission.findUnique({
      where: { id },
      include: {
        requirement: true,
        vendor: true,
      },
    });

    if (!s) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({
      submission: {
        id: s.id,
        requirementId: s.requirementId,
        requirementTitle: s.requirement.title,
        vendorId: s.vendorId,
        vendorName: s.vendor.companyName,
        candidateName: s.candidateName,
        candidateEmail: s.candidateEmail,
        candidatePhone: s.candidatePhone,
        totalExperience: s.totalExperience,
        relevantExperience: s.relevantExperience,
        jdComfortable: s.jdComfortable,
        cvFilename: s.cvFilename,
        cvUrl: s.cvUrl,
        status: s.status,
        screeningDate: s.screeningDate,
        screeningTimeSlot: s.screeningTimeSlot,
        meetingLink: s.meetingLink,
        scheduledAt: s.scheduledAt,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Fetch submission error:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.screeningDate !== undefined) dataToUpdate.screeningDate = body.screeningDate;
    if (body.screeningTimeSlot !== undefined) dataToUpdate.screeningTimeSlot = body.screeningTimeSlot;
    if (body.meetingLink !== undefined) dataToUpdate.meetingLink = body.meetingLink;
    if (body.scheduledAt !== undefined) dataToUpdate.scheduledAt = body.scheduledAt;

    const updated = await prisma.submission.update({
      where: { id },
      data: dataToUpdate,
      include: {
        requirement: true,
        vendor: {
          include: {
            users: true,
          },
        },
      },
    });

    // Notify vendor users if status changed
    if (body.status && updated.vendor?.users) {
      for (const u of updated.vendor.users) {
        await prisma.notification.create({
          data: {
            userId: u.id,
            type: 'submission_update',
            title: `Candidate Status: ${body.status.replace(/_/g, ' ')}`,
            message: `${updated.candidateName} for ${updated.requirement.title} is now ${body.status.replace(/_/g, ' ')}.`,
            relatedEntityType: 'submission',
            relatedEntityId: updated.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error: any) {
    console.error('Update submission error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
