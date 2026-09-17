import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalRequirements,
      openRequirements,
      totalSubmissions,
      activeVendors,
      submissions,
      vendorsWithSubmissions,
    ] = await Promise.all([
      prisma.requirement.count(),
      prisma.requirement.count({ where: { status: 'open' } }),
      prisma.submission.count(),
      prisma.vendor.count({ where: { isActive: true } }),
      prisma.submission.findMany({
        select: { status: true },
      }),
      prisma.vendor.findMany({
        include: {
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: {
          submissions: { _count: 'desc' },
        },
        take: 5,
      }),
    ]);

    const pipelineBreakdown = {
      submitted: submissions.filter((s) => s.status === 'submitted').length,
      screening_scheduled: submissions.filter((s) => s.status === 'screening_scheduled').length,
      screening_done: submissions.filter((s) => s.status === 'screening_done').length,
      interview_scheduled: submissions.filter((s) => s.status === 'interview_scheduled').length,
      offer_offered: submissions.filter((s) => s.status === 'offer_offered').length,
      approved: submissions.filter((s) => s.status === 'approved').length,
      rejected: submissions.filter((s) => s.status === 'rejected').length,
    };

    const vendorLeaderboard = vendorsWithSubmissions.map((v) => ({
      vendorId: v.id,
      vendorName: v.companyName,
      totalSubmissions: v._count.submissions,
    }));

    return NextResponse.json({
      metrics: {
        totalRequirements,
        openRequirements,
        totalSubmissions,
        activeVendors,
      },
      pipelineBreakdown,
      vendorLeaderboard,
    });
  } catch (error: any) {
    console.error('Fetch reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
