import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MindCrew HireHub database...');

  // Clean existing records in dependency order
  await prisma.notification.deleteMany();
  await prisma.screeningSlot.deleteMany();
  await prisma.vendorDocument.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vendor.deleteMany();

  // 1. Seed Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      id: 'v1',
      companyName: 'Vortex Soft Innovations',
      contactPerson: 'Chinthana',
      email: 'chinthana@vortexsoftinnovations.com',
      phone: '+91 98765 43210',
      address: 'Bangalore, Karnataka, India',
      isActive: true,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      id: 'v2',
      companyName: 'Apex Talent Solutions',
      contactPerson: 'Rahul Sharma',
      email: 'rahul@apextalent.com',
      phone: '+91 98111 22334',
      address: 'Hyderabad, Telangana, India',
      isActive: true,
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      id: 'v3',
      companyName: 'CloudScale Partners',
      contactPerson: 'Priya Patel',
      email: 'priya@cloudscale.io',
      phone: '+91 97222 33445',
      address: 'Pune, Maharashtra, India',
      isActive: true,
    },
  });

  // 2. Seed Users with Bcrypt Passwords
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const hrHash = await bcrypt.hash('Sarah@123', 10);
  const vendorHash = await bcrypt.hash('Qwerty@09', 10);

  const adminUser = await prisma.user.create({
    data: {
      id: 'u1',
      name: 'System Admin',
      email: 'admin@mindcrew.com',
      username: 'admin',
      passwordHash: adminHash,
      role: 'admin',
      isActive: true,
    },
  });

  const hrUser = await prisma.user.create({
    data: {
      id: 'u2',
      name: 'Sarah Connor',
      email: 'sarah@mindcrew.com',
      username: 'sarah_hr',
      passwordHash: hrHash,
      role: 'hr',
      isActive: true,
    },
  });

  const vendorUser = await prisma.user.create({
    data: {
      id: 'u3',
      name: 'Chinthana (Vortex)',
      email: 'chinthana@vortexsoftinnovations.com',
      username: 'chinthana_vortex',
      passwordHash: vendorHash,
      role: 'vendor',
      vendorId: vendor1.id,
      isActive: true,
    },
  });

  // 3. Seed Requirements
  const req1 = await prisma.requirement.create({
    data: {
      id: 'req1',
      title: 'Senior React / Next.js Developer',
      description: 'Looking for a Senior Frontend Engineer with deep expertise in React 18/19, Next.js App Router, TypeScript, and state management.',
      jobType: 'remote',
      location: 'Remote (India)',
      minExperience: 5,
      targetClosureDate: '2026-04-15',
      budget: '₹22 - 28 LPA',
      mandatorySkills: JSON.stringify(['React', 'Next.js', 'TypeScript']),
      primarySkills: JSON.stringify(['Tailwind CSS', 'Redux / Zustand', 'REST APIs']),
      secondarySkills: JSON.stringify(['GraphQL', 'Docker', 'Jest / Vitest']),
      status: 'open',
      createdById: hrUser.id,
      postedDate: '2026-03-01',
    },
  });

  const req2 = await prisma.requirement.create({
    data: {
      id: 'req2',
      title: 'Full Stack Node.js / Python Engineer',
      description: 'Experienced full stack developer to build scalable microservices using Node.js/Express, Python/FastAPI, and PostgreSQL.',
      jobType: 'hybrid',
      location: 'Bangalore, India',
      minExperience: 4,
      targetClosureDate: '2026-04-20',
      budget: '₹18 - 25 LPA',
      mandatorySkills: JSON.stringify(['Node.js', 'PostgreSQL', 'TypeScript']),
      primarySkills: JSON.stringify(['FastAPI', 'Redis', 'Docker']),
      secondarySkills: JSON.stringify(['AWS', 'Kubernetes', 'CI/CD']),
      status: 'open',
      createdById: hrUser.id,
      postedDate: '2026-03-05',
    },
  });

  const req3 = await prisma.requirement.create({
    data: {
      id: 'req3',
      title: 'Senior DevOps / Cloud Architect',
      description: 'Lead cloud architecture, Terraform IaC, multi-region Kubernetes deployments, and automated CI/CD pipelines.',
      jobType: 'remote',
      location: 'Remote (Global)',
      minExperience: 7,
      targetClosureDate: '2026-04-30',
      budget: '₹30 - 40 LPA',
      mandatorySkills: JSON.stringify(['AWS / GCP', 'Kubernetes', 'Terraform']),
      primarySkills: JSON.stringify(['Docker', 'GitHub Actions', 'Prometheus / Grafana']),
      secondarySkills: JSON.stringify(['Python', 'Helm', 'ArgoCD']),
      status: 'open',
      createdById: adminUser.id,
      postedDate: '2026-03-10',
    },
  });

  const req4 = await prisma.requirement.create({
    data: {
      id: 'req4',
      title: 'UI/UX Product Designer',
      description: 'Product designer with strong Figma design system skills, user research, wireframing, and interactive prototyping experience.',
      jobType: 'onsite',
      location: 'Mumbai, India',
      minExperience: 3,
      targetClosureDate: '2026-04-10',
      budget: '₹14 - 18 LPA',
      mandatorySkills: JSON.stringify(['Figma', 'Design Systems', 'Prototyping']),
      primarySkills: JSON.stringify(['User Research', 'Wireframing', 'Interaction Design']),
      secondarySkills: JSON.stringify(['HTML/CSS basics', 'Motion Design']),
      status: 'on_hold',
      createdById: hrUser.id,
      postedDate: '2026-02-25',
    },
  });

  // 4. Seed Submissions
  await prisma.submission.create({
    data: {
      id: 'sub1',
      requirementId: req1.id,
      vendorId: vendor1.id,
      candidateName: 'Amit Verma',
      candidateEmail: 'amit.verma@example.com',
      candidatePhone: '+91 98765 43211',
      totalExperience: 6.5,
      relevantExperience: 5.0,
      jdComfortable: true,
      cvFilename: 'Amit_Verma_Resume_NextJS.pdf',
      cvUrl: '/uploads/Amit_Verma_Resume_NextJS.pdf',
      status: 'screening_scheduled',
      screeningDate: '2026-03-20',
      screeningTimeSlot: '11:00 AM - 11:45 AM',
      meetingLink: 'https://meet.google.com/xyz-abc-def',
      scheduledAt: '2026-03-15T10:00:00Z',
    },
  });

  await prisma.submission.create({
    data: {
      id: 'sub2',
      requirementId: req1.id,
      vendorId: vendor1.id,
      candidateName: 'Pooja Reddy',
      candidateEmail: 'pooja.reddy@example.com',
      candidatePhone: '+91 97111 22334',
      totalExperience: 5.0,
      relevantExperience: 4.5,
      jdComfortable: true,
      cvFilename: 'Pooja_Reddy_Frontend.pdf',
      cvUrl: '/uploads/Pooja_Reddy_Frontend.pdf',
      status: 'interview_scheduled',
      screeningDate: '2026-03-18',
      screeningTimeSlot: '02:30 PM - 03:30 PM',
      meetingLink: 'https://meet.google.com/pooja-interview',
      scheduledAt: '2026-03-12T14:00:00Z',
    },
  });

  await prisma.submission.create({
    data: {
      id: 'sub3',
      requirementId: req2.id,
      vendorId: vendor2.id,
      candidateName: 'Karthik Nair',
      candidateEmail: 'karthik.n@example.com',
      candidatePhone: '+91 96222 33445',
      totalExperience: 4.5,
      relevantExperience: 4.0,
      jdComfortable: true,
      cvFilename: 'Karthik_Nair_Fullstack.pdf',
      cvUrl: '/uploads/Karthik_Nair_Fullstack.pdf',
      status: 'submitted',
    },
  });

  await prisma.submission.create({
    data: {
      id: 'sub4',
      requirementId: req3.id,
      vendorId: vendor1.id,
      candidateName: 'Vikram Malhotra',
      candidateEmail: 'vikram.m@example.com',
      candidatePhone: '+91 95333 44556',
      totalExperience: 8.0,
      relevantExperience: 7.0,
      jdComfortable: true,
      cvFilename: 'Vikram_Malhotra_DevOps.pdf',
      cvUrl: '/uploads/Vikram_Malhotra_DevOps.pdf',
      status: 'approved',
    },
  });

  // 5. Seed Vendor Documents
  await prisma.vendorDocument.create({
    data: {
      id: 'doc1',
      vendorId: vendor1.id,
      name: 'Master Service Agreement (MSA) 2026',
      type: 'contract',
      fileUrl: '/documents/MSA_VortexSoft_2026.pdf',
      uploadedById: adminUser.id,
      responseUrl: '/documents/MSA_VortexSoft_Signed.pdf',
      status: 'approved',
    },
  });

  await prisma.vendorDocument.create({
    data: {
      id: 'doc2',
      vendorId: vendor1.id,
      name: 'Non-Disclosure Agreement (NDA)',
      type: 'nda',
      fileUrl: '/documents/NDA_Standard_MindCrew.pdf',
      uploadedById: hrUser.id,
      status: 'pending_response',
    },
  });

  await prisma.vendorDocument.create({
    data: {
      id: 'doc3',
      vendorId: vendor2.id,
      name: 'GST & Compliance Certificate',
      type: 'compliance',
      fileUrl: '/documents/Apex_Compliance_Doc.pdf',
      uploadedById: hrUser.id,
      status: 'approved',
    },
  });

  // 6. Seed Screening Slots
  const dates = ['2026-03-20', '2026-03-21', '2026-03-22', '2026-03-23'];
  const times = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

  for (const d of dates) {
    for (const t of times) {
      await prisma.screeningSlot.create({
        data: {
          date: d,
          time: t,
          isAvailable: !(d === '2026-03-20' && t === '11:30 AM'),
          submissionId: d === '2026-03-20' && t === '11:30 AM' ? 'sub1' : null,
        },
      });
    }
  }

  // 7. Seed Notifications
  await prisma.notification.create({
    data: {
      userId: vendorUser.id,
      type: 'new_requirement',
      title: 'New Requirement Posted',
      message: 'MindCrew posted: Senior React / Next.js Developer (5+ yrs). Submissions open!',
      isRead: false,
      relatedEntityType: 'requirement',
      relatedEntityId: req1.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: vendorUser.id,
      type: 'screening_scheduled',
      title: 'Screening Scheduled',
      message: 'Candidate Amit Verma scheduled for screening on 2026-03-20 at 11:00 AM.',
      isRead: false,
      relatedEntityType: 'submission',
      relatedEntityId: 'sub1',
    },
  });

  await prisma.notification.create({
    data: {
      userId: hrUser.id,
      type: 'submission_update',
      title: 'New Candidate Submitted',
      message: 'Vortex Soft Innovations submitted candidate Pooja Reddy for Senior React / Next.js Developer.',
      isRead: true,
      relatedEntityType: 'submission',
      relatedEntityId: 'sub2',
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
