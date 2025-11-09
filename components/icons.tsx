import type { SVGProps } from 'react';

const straightStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5
};

const roundStroke = {
  ...straightStroke,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

export function IconAdjustments(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...roundStroke} d="M4 7h16M4 17h16M10 7v10M14 7v10" />
      <circle cx={10} cy={12} r={1.75} fill="currentColor" />
      <circle cx={14} cy={12} r={1.75} fill="currentColor" />
    </svg>
  );
}

export function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...roundStroke} d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconMagnifier(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...straightStroke} cx={11} cy={11} r={6} />
      <line {...roundStroke} x1={16.5} y1={16.5} x2={20} y2={20} />
    </svg>
  );
}

export function IconXMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...roundStroke} d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconLink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        {...roundStroke}
        d="M10.5 6.75L8.75 5a3.5 3.5 0 00-4.95 4.95l2.5 2.5m5.2 5.2l1.75 1.75a3.5 3.5 0 004.95-4.95l-2.5-2.5m-5.2 5.2l7.07-7.07"
      />
    </svg>
  );
}

export function IconArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...roundStroke} d="M10 6l-6 6 6 6M4 12h16" />
    </svg>
  );
}

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...roundStroke} d="M14 6l6 6-6 6M4 12h16" />
    </svg>
  );
}

export function IconArrowUpCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...straightStroke} cx={12} cy={12} r={9} />
      <path {...roundStroke} d="M12 16V8m0 0l-4 4m4-4l4 4" />
    </svg>
  );
}

export function IconArrowDownCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...straightStroke} cx={12} cy={12} r={9} />
      <path {...roundStroke} d="M12 8v8m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

export function IconCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect {...straightStroke} x={4} y={5.5} width={16} height={14} rx={2} />
      <line {...roundStroke} x1={4} y1={10} x2={20} y2={10} />
      <line {...roundStroke} x1={8} y1={3} x2={8} y2={7} />
      <line {...roundStroke} x1={16} y1={3} x2={16} y2={7} />
    </svg>
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...straightStroke} cx={12} cy={12} r={9} />
      <path {...roundStroke} d="M3 12h18M12 3c3 3 3 15 0 18m0-18c-3 3-3 15 0 18" />
    </svg>
  );
}

export function IconSparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        {...roundStroke}
        d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm6 9l.9 2.7L21 15l-2.1.3L18 18l-.9-2.7L15 15l2.1-.3L18 12zm-12 0l.7 2.1L9 15l-2.3.3L6 18l-.7-2.7L3 15l2.3-.3L6 12z"
      />
    </svg>
  );
}

export function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        {...roundStroke}
        d="M12 2.5L4 5.5v5.5c0 5.5 3.5 10.5 8 12 4.5-1.5 8-6.5 8-12V5.5l-8-3z"
      />
      <path
        {...roundStroke}
        d="M9 11.5l2 2 4-4"
      />
    </svg>
  );
}

export function IconAward(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...straightStroke} cx={12} cy={10} r={6} />
      <path
        {...roundStroke}
        d="M8.21 13.89L7 21l5-3 5 3-1.21-7.11"
      />
      <circle cx={12} cy={10} r={2} fill="currentColor" />
    </svg>
  );
}
