'use client';
import { useState } from 'react';
import { Calendar, Video, X, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';
import { SubmissionStatusBadge } from '@/components/ui/badge';
import { mockSubmissions } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/utils';
import { MetricCard } from '@/components/ui/metric-card';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function InterviewsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Sep 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const screenings = mockSubmissions.filter(s => s.status === 'screening_scheduled' || s.status === 'interview_scheduled');
  const scheduled = screenings.length;
  const todayScreenings = screenings.filter(s => s.screeningDate === '2026-09-20').length;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calCells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const hasMeeting = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return screenings.some(s => s.screeningDate === dateStr);
  };

  const getMeetingsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return screenings.filter(s => s.screeningDate === dateStr);
  };

  const selectedMeetings = selectedDay ? getMeetingsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Interview & Screening Schedule</h2>
        <p className="text-slate-400 text-sm">Track all scheduled screenings and interviews</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total Scheduled" value={scheduled} icon={Calendar} iconColor="text-blue-400" />
        <MetricCard title="Today's Screenings" value={todayScreenings} icon={Clock} iconColor="text-amber-400" />
        <MetricCard title="Interviews" value={mockSubmissions.filter(s => s.status === 'interview_scheduled').length} icon={Video} iconColor="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{MONTHS[month]} {year}</h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calCells.map((day, i) => (
              <button
                key={i}
                disabled={!day}
                onClick={() => day && setSelectedDay(day)}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all relative',
                  !day ? 'invisible' : 'cursor-pointer',
                  day && hasMeeting(day) ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
                  selectedDay === day ? 'ring-2 ring-blue-500 bg-blue-500/20' : '',
                  day === new Date().getDate() && month === new Date().getMonth() ? 'text-white font-bold' : ''
                )}
              >
                {day}
                {day && hasMeeting(day) && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-0.5" />}
              </button>
            ))}
          </div>

          {selectedDay && selectedMeetings.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.07]">
              <h4 className="font-semibold text-white mb-3">Meetings on {selectedDay} {MONTHS[month]}</h4>
              <div className="space-y-2">
                {selectedMeetings.map(s => (
                  <div key={s.id} className="glass rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{s.candidateName}</p>
                      <p className="text-xs text-slate-400">{s.requirementTitle} • {s.screeningTimeSlot}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SubmissionStatusBadge status={s.status} />
                      {s.meetingLink && <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-ghost py-1 px-2 text-xs"><Video size={12} /> Join</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming list */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.07]">
            <h3 className="font-semibold text-white">Upcoming Screenings</h3>
          </div>
          <div className="p-4 space-y-3">
            {screenings.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No screenings scheduled</p>
            ) : screenings.map(s => (
              <div key={s.id} className="glass rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold text-white">{s.candidateName}</p>
                  <SubmissionStatusBadge status={s.status} />
                </div>
                <p className="text-xs text-slate-400">{s.requirementTitle}</p>
                {s.screeningDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={11} /> {formatDate(s.screeningDate)} at {s.screeningTimeSlot}
                  </div>
                )}
                {s.meetingLink && (
                  <a href={s.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 text-xs hover:text-blue-300 transition-colors">
                    <Video size={12} /> Join Google Meet
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All scheduled table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white">All Scheduled Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Candidate</th><th>Requirement</th><th>Vendor</th><th>Date</th><th>Time Slot</th><th>Status</th><th>Meeting</th></tr>
            </thead>
            <tbody>
              {screenings.map(s => (
                <tr key={s.id}>
                  <td className="font-medium text-white">{s.candidateName}</td>
                  <td className="text-slate-300 text-sm">{s.requirementTitle}</td>
                  <td className="text-slate-400 text-sm">{s.vendorName}</td>
                  <td className="text-slate-300 text-sm">{s.screeningDate ? formatDate(s.screeningDate) : '—'}</td>
                  <td className="text-slate-300">{s.screeningTimeSlot || '—'}</td>
                  <td><SubmissionStatusBadge status={s.status} /></td>
                  <td>{s.meetingLink ? <a href={s.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 text-xs"><Video size={12} /> Join</a> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
