import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    const where: any = {};
    if (vendorId) where.vendorId = vendorId;

    const documents = await prisma.vendorDocument.findMany({
      where,
      include: {
        vendor: { select: { companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = documents.map((d) => ({
      id: d.id,
      vendorId: d.vendorId,
      vendorName: d.vendor.companyName,
      name: d.name,
      type: d.type,
      fileUrl: d.fileUrl || undefined,
      uploadedBy: d.uploadedById,
      responseUrl: d.responseUrl || undefined,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));

    return NextResponse.json({ documents: formatted });
  } catch (error: any) {
    console.error('Fetch documents error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId, name, type = 'contract', fileUrl, uploadedById = 'u1' } = body;

    if (!vendorId || !name) {
      return NextResponse.json({ error: 'vendorId and name are required' }, { status: 400 });
    }

    const doc = await prisma.vendorDocument.create({
      data: {
        vendorId,
        name,
        type,
        fileUrl,
        uploadedById,
        status: 'pending_response',
      },
    });

    return NextResponse.json({ success: true, document: doc }, { status: 201 });
  } catch (error: any) {
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, responseUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'Document id is required' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (responseUrl !== undefined) dataToUpdate.responseUrl = responseUrl;

    const updated = await prisma.vendorDocument.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, document: updated });
  } catch (error: any) {
    console.error('Update document error:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
