import Link from 'next/link';
import styles from './Logo.module.css';

export function Logo() {
  return (
    <Link href="/" className={styles.logo}>
      <div className={styles.logoMark}>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 2L13 5.5V10.5L8 14L3 10.5V5.5L8 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="8" r="2" fill="white" />
        </svg>
      </div>
      <span className={styles.logoName}>Aurum</span>
    </Link>
  );
}