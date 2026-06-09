import Link from 'next/link';

import { Logo } from '../UI/Logo/Logo';
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
        <Link href="#" className={styles.btnGhost}>Sign in</Link>
        <Link href="#" className={styles.btnPrimary}>Start free</Link>
      </div>
    </nav>
  );
}