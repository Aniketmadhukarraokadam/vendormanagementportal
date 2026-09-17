import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const where: any = {};
    if (date) where.date = date;

    const slots = await prisma.screeningSlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return NextResponse.json({ slots });
  } catch (error: any) {
    console.error('Fetch interview slots error:', error);
    return NextResponse.json({ error: 'Failed to fetch interview slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, submissionId, meetingLink } = body;

    if (!slotId || !submissionId) {
      return NextResponse.json(
        { error: 'slotId and submissionId are required' },
        { status: 400 }
      );
    }

    const slot = await prisma.screeningSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || !slot.isAvailable) {
      return NextResponse.json({ error: 'Slot is not available' }, { status: 400 });
    }

    // Reserve slot
    await prisma.screeningSlot.update({
      where: { id: slotId },
      data: {
        isAvailable: false,
        submissionId,
      },
    });

    // Update submission with screening session
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'screening_scheduled',
        screeningDate: slot.date,
        screeningTimeSlot: slot.time,
        meetingLink: meetingLink || 'https://meet.google.com/screening-' + Math.random().toString(36).substring(7),
        scheduledAt: new Date().toISOString(),
      },
      include: {
        vendor: { include: { users: true } },
        requirement: true,
      },
    });

    // Notify vendor users
    if (updatedSubmission.vendor?.users) {
      for (const u of updatedSubmission.vendor.users) {
        await prisma.notification.create({
          data: {
            userId: u.id,
            type: 'screening_scheduled',
            title: 'Screening Scheduled',
            message: `Candidate ${updatedSubmission.candidateName} scheduled for ${slot.date} at ${slot.time}`,
            relatedEntityType: 'submission',
            relatedEntityId: updatedSubmission.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, submission: updatedSubmission });
  } catch (error: any) {
    console.error('Book interview slot error:', error);
    return NextResponse.json({ error: 'Failed to book interview slot' }, { status: 500 });
  }
}
