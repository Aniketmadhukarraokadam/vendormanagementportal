import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const requirementId = searchParams.get('requirementId');
    const status = searchParams.get('status');

    const where: any = {};
    if (vendorId) where.vendorId = vendorId;
    if (requirementId) where.requirementId = requirementId;
    if (status && status !== 'all') where.status = status;

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        requirement: {
          select: { title: true },
        },
        vendor: {
          select: { companyName: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = submissions.map((s) => ({
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
      cvFilename: s.cvFilename || undefined,
      cvUrl: s.cvUrl || undefined,
      status: s.status,
      screeningDate: s.screeningDate || undefined,
      screeningTimeSlot: s.screeningTimeSlot || undefined,
      meetingLink: s.meetingLink || undefined,
      scheduledAt: s.scheduledAt || undefined,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    return NextResponse.json({ submissions: formatted });
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      requirementId,
      vendorId,
      candidateName,
      candidateEmail,
      candidatePhone,
      totalExperience = 0,
      relevantExperience = 0,
      jdComfortable = true,
      cvFilename,
      cvUrl,
    } = body;

    if (!requirementId || !vendorId || !candidateName || !candidateEmail) {
      return NextResponse.json(
        { error: 'requirementId, vendorId, candidateName, and candidateEmail are required' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        requirementId,
        vendorId,
        candidateName,
        candidateEmail,
        candidatePhone: candidatePhone || '',
        totalExperience: Number(totalExperience),
        relevantExperience: Number(relevantExperience),
        jdComfortable: Boolean(jdComfortable),
        cvFilename,
        cvUrl: cvUrl || (cvFilename ? `/uploads/${cvFilename}` : null),
        status: 'submitted',
      },
      include: {
        requirement: true,
        vendor: true,
      },
    });

    // Notify HR / Admins
    const hrAdmins = await prisma.user.findMany({
      where: { role: { in: ['admin', 'hr'] } },
    });

    for (const u of hrAdmins) {
      await prisma.notification.create({
        data: {
          userId: u.id,
          type: 'submission_update',
          title: 'New Candidate Submitted',
          message: `${submission.vendor.companyName} submitted ${submission.candidateName} for ${submission.requirement.title}`,
          relatedEntityType: 'submission',
          relatedEntityId: submission.id,
        },
      });
    }

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: any) {
    console.error('Create submission error:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
