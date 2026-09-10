import Link from 'next/link';
import styles from './footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footerContainer}>
      {/* Logo Section */}
      <Link href="#" className={styles.logo}>
        <div className={styles.logoMark}>
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2L13 5.5V10.5L8 14L3 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="8" cy="8" r="2" fill="white"/>
          </svg>
        </div>
        <span className={styles.logoName}>Aurum</span>
      </Link>

      {/* Copyright */}
      <span className={styles.footerCopy}>© 2026 Aurum Inc. All rights reserved.</span>

      {/* Navigation Links */}
      <ul className={styles.footerLinks}>
        <li><Link href="#">Privacy</Link></li>
        <li><Link href="#">Terms</Link></li>
        <li><Link href="#">Status</Link></li>
        <li><Link href="#">GitHub</Link></li>
      </ul>
    </footer>
  );
}