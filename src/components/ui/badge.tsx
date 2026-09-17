'use client';
import { cn } from '@/lib/utils';
import { SubmissionStatus, RequirementStatus, DocumentStatus, JobType } from '@/types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'default' | 'teal';

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/20',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  teal: 'bg-teal-500/15 text-teal-400 border border-teal-500/20',
  default: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('badge', variantStyles[variant], className)}>
      {children}
    </span>
  );
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  const map: Record<SubmissionStatus, { label: string; variant: BadgeVariant }> = {
    submitted: { label: 'Submitted', variant: 'info' },
    screening_scheduled: { label: 'Screening Scheduled', variant: 'warning' },
    screening_done: { label: 'Screening Done', variant: 'teal' },
    interview_scheduled: { label: 'Interview Scheduled', variant: 'purple' },
    offer_offered: { label: 'Offer Extended', variant: 'success' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function RequirementStatusBadge({ status }: { status: RequirementStatus }) {
  const map: Record<RequirementStatus, { label: string; variant: BadgeVariant }> = {
    open: { label: 'Open', variant: 'success' },
    on_hold: { label: 'On Hold', variant: 'warning' },
    closed: { label: 'Closed', variant: 'default' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function JobTypeBadge({ type }: { type: JobType }) {
  const map: Record<JobType, { label: string; variant: BadgeVariant }> = {
    remote: { label: '🌐 Remote', variant: 'info' },
    onsite: { label: '🏢 Onsite', variant: 'purple' },
    hybrid: { label: '🔄 Hybrid', variant: 'teal' },
  };
  const { label, variant } = map[type];
  return <Badge variant={variant}>{label}</Badge>;
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const map: Record<DocumentStatus, { label: string; variant: BadgeVariant }> = {
    pending_response: { label: 'Pending Response', variant: 'warning' },
    responded: { label: 'Responded', variant: 'info' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
