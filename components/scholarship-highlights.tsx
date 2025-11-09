import { IconCalendar, IconGlobe, IconSparkles } from './icons';
import { format, formatDistanceStrict } from 'date-fns';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipHighlightsProps {
  scholarships: ScholarshipPreview[];
}

function getUpcomingDeadline(scholarships: ScholarshipPreview[]) {
  const upcoming = scholarships
    .filter((entry) => Boolean(entry.deadlineDate) && !entry.isExpired)
    .sort((a, b) => {
      const timeA = a.deadlineDate ? new Date(a.deadlineDate).getTime() : Number.POSITIVE_INFINITY;
      const timeB = b.deadlineDate ? new Date(b.deadlineDate).getTime() : Number.POSITIVE_INFINITY;
      return timeA - timeB;
    })[0];

  if (!upcoming || !upcoming.deadlineDate) {
    return null;
  }

  const date = new Date(upcoming.deadlineDate);
  return {
    label: format(date, 'EEEE, MMMM do'),
    in: formatDistanceStrict(Date.now(), date, { addSuffix: true }),
    name: upcoming.name
  };
}

export function ScholarshipHighlights({ scholarships }: ScholarshipHighlightsProps) {
  const totalActive = scholarships.filter((entry) => !entry.isExpired).length;
  const uniqueCountries = new Set(
    scholarships.flatMap((entry) => (entry.countries.length ? entry.countries : ['Global']))
  ).size;
  const upcoming = getUpcomingDeadline(scholarships);

  const metrics = [
    {
      title: 'Active Scholarships',
      value: totalActive.toLocaleString(),
      description: 'Open awards meticulously curated and ready for applications.',
      icon: IconSparkles,
      accent: 'from-luxe-gold/50 via-luxe-gold/20 to-transparent'
    },
    {
      title: 'Global Destinations',
      value: uniqueCountries.toLocaleString(),
      description: 'Countries represented across this season\'s catalogue.',
      icon: IconGlobe,
      accent: 'from-luxe-emerald/40 via-luxe-gold/10 to-transparent'
    },
    {
      title: upcoming ? 'Next Deadline' : 'Rolling Opportunities',
      value: upcoming ? upcoming.label : 'Flexible timelines',
      description: upcoming
        ? `${upcoming.name} closes ${upcoming.in}.`
        : 'Many scholarships review applications throughout the year.',
      icon: IconCalendar,
      accent: 'from-luxe-azure/40 via-luxe-gold/15 to-transparent'
    }
  ];

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {metrics.map(({ title, value, description, icon: Icon, accent }) => (
        <article
          key={title}
          className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(20,25,35,0.55)] transition hover:-translate-y-1 hover:shadow-[0_32px_90px_-42px_rgba(212,175,55,0.55)] dark:border-white/10 dark:bg-white/10"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} aria-hidden />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-3 text-luxe-gold dark:text-luxe-gold/90">
              <span className="rounded-full border border-luxe-gold/30 bg-white/80 p-3 dark:border-luxe-gold/20 dark:bg-black/40">
                <Icon className="h-6 w-6" />
              </span>
              <p className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/80">{title}</p>
            </div>
            <p className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">{value}</p>
            <p className="max-w-sm text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/80">{description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
