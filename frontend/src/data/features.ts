export interface Feature {
  title: string;
  description: string;
  svgPath: string;
}

export const FEATURES: Feature[] = [
  {
    title: 'Passwordless by default',
    description:
      'Magic links, passkeys, and biometric auth — designed for the way people actually want to sign in today.',
    svgPath: `
      <rect x="4" y="9" width="12" height="9" rx="2" stroke="#7C5CFC" stroke-width="1.5"/>
      <path d="M7 9V6a3 3 0 016 0v3" stroke="#7C5CFC" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="10" cy="13.5" r="1.5" fill="#7C5CFC"/>
    `,
  },
  {
    title: 'Real-time session control',
    description:
      'Revoke access, enforce MFA, and set adaptive session policies — all reflected immediately, everywhere.',
    svgPath: `
      <circle cx="10" cy="10" r="7" stroke="#7C5CFC" stroke-width="1.5"/>
      <path d="M10 6v4l2.5 2.5" stroke="#7C5CFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
  {
    title: '50+ social providers',
    description:
      'Google, GitHub, Apple, LinkedIn, and more. One unified API, consistent tokens, predictable behaviour.',
    svgPath: `
      <path d="M10 3L17 7v6l-7 4-7-4V7l7-4z" stroke="#7C5CFC" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M10 3v10M17 7l-7 4M3 7l7 4" stroke="#7C5CFC" stroke-width="1.2" opacity="0.4"/>
    `,
  },
  {
    title: 'Audit logs, built in',
    description:
      'Every login attempt, MFA event, and permission change is recorded, searchable, and exportable from day one.',
    svgPath: `
      <path d="M3 6h14M3 10h9M3 14h5" stroke="#7C5CFC" stroke-width="1.5" stroke-linecap="round"/>
    `,
  },
  {
    title: 'Roles & permissions',
    description:
      'Fine-grained RBAC that scales from startup to enterprise — without the overhead of building it yourself.',
    svgPath: `
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#7C5CFC" stroke-width="1.5"/>
      <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="#7C5CFC" stroke-width="1.5"/>
      <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="#7C5CFC" stroke-width="1.5"/>
      <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="#7C5CFC" stroke-width="1.5"/>
    `,
  },
  {
    title: 'Fraud & anomaly detection',
    description:
      'Impossible travel, credential stuffing, and bot detection — silently protecting your users around the clock.',
    svgPath: `
      <path d="M10 17s-7-4-7-9a7 7 0 1114 0c0 5-7 9-7 9z" stroke="#7C5CFC" stroke-width="1.5"/>
      <path d="M10 10V7M10 12v.5" stroke="#7C5CFC" stroke-width="1.5" stroke-linecap="round"/>
    `,
  },
];