// Inline stroke icons (24×24 viewBox) matching the design prototype.

function Base({
  children,
  size = 18,
  stroke = "currentColor",
  strokeWidth = 1.8,
  fill = "none",
}: {
  children: React.ReactNode;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const IconToday = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const IconJourney = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </Base>
);

export const IconProjects = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </Base>
);

export const IconCourses = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13Z" />
    <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13Z" />
  </Base>
);

export const IconLeaderboard = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </Base>
);

export const IconProfile = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Base>
);

export const IconAbout = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 18.5c1-2.5 3-3.5 5.5-3.5s4.5 1 5.5 3.5" />
  </Base>
);

export const IconSettings = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </Base>
);

export const IconCreator = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <path d="M2 6l4 5 6-8 6 8 4-5v12H2z" />
    <path d="M2 20h20" />
  </Base>
);

export const IconCertificate = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <circle cx="12" cy="8" r="7" />
    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
  </Base>
);

export const IconCheck = ({
  size = 15,
  stroke = "#062018",
  strokeWidth = 3,
}: {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}) => (
  <Base size={size} stroke={stroke} strokeWidth={strokeWidth}>
    <path d="M20 6L9 17l-5-5" />
  </Base>
);

export const IconBack = ({ size = 15 }: { size?: number }) => (
  <Base size={size}>
    <path d="M15 18l-6-6 6-6" />
  </Base>
);

export const IconPlay = ({
  size = 20,
  fill = "#ECE6DA",
}: {
  size?: number;
  fill?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const IconShare = ({ size = 15 }: { size?: number }) => (
  <Base size={size}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </Base>
);

export const IconHeart = ({ size = 14 }: { size?: number }) => (
  <Base size={size} stroke="#F5B54B">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9z" />
  </Base>
);

export const IconInfo = ({ size = 14 }: { size?: number }) => (
  <Base size={size} stroke="#6C7581">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Base>
);

export const IconClockBack = ({ size = 20 }: { size?: number }) => (
  <Base size={size} stroke="#22D3EE">
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 7v5l3 2" />
  </Base>
);

export const IconGitHub = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .3.3.7 1 .7 2v3c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2z" />
  </svg>
);

/** The emerald-gradient "A" logo square. */
export function Logo({ size = 32, radius = 9 }: { size?: number; radius?: number }) {
  return (
    <div
      className="flex items-center justify-center font-mono font-extrabold text-[#062018]"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "linear-gradient(150deg,#22D3EE,#0E7490)",
        fontSize: size * 0.47,
      }}
    >
      A
    </div>
  );
}
