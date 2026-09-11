import Link from 'next/link';

import { Logo } from '../Logo/Logo';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Features', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
];

export function Navbar() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul className={styles.navLinks}>
        {NAV_LINKS.map(({ label, href }) => (
          <li key={label}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
      <div className={styles.navActions}>
        <Link href="/applicant/auth/login" className={styles.btnGhost}>Sign in</Link>
        <Link href="/applicant/auth/register" className={styles.btnPrimary}>Register</Link>
      </div>
    </nav>
  );
}