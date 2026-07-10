// Inline stroke icons (24×24 viewBox) matching the design prototype.

function Base({
  children,
  size = 18,
  stroke = "currentColor",
  strokeWidth = 2,
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
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Base>
);

export const IconProjects = ({ size = 18 }: { size?: number }) => (
  <Base size={size}>
    <path d="M3 7h18M3 12h18M3 17h18" />
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
    <path d="M6 20V10M12 20V4M18 20v-6" />
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
    <path d="M4 20V10M12 20V4M20 20v-6" />
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
  <Base size={size} stroke="#35D399">
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
        background: "linear-gradient(150deg,#35D399,#16A97E)",
        fontSize: size * 0.47,
      }}
    >
      A
    </div>
  );
}
