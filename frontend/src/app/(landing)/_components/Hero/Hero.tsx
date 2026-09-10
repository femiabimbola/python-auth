import Link from 'next/link';
import styles from './Hero.module.css';

const TRUST_AVATARS = [
  { initials: 'AK', gradient: 'linear-gradient(135deg,#7C5CFC,#5B3EE8)' },
  { initials: 'MR', gradient: 'linear-gradient(135deg,#A8D5BA,#5BB68A)' },
  { initials: 'TL', gradient: 'linear-gradient(135deg,#F5A623,#E8812A)' },
  { initials: 'JO', gradient: 'linear-gradient(135deg,#FC5C7D,#E83E5C)' },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowDot} />
        Now in open beta
      </div>

      <h1>
        Identity, handled
        <br />
        with <em>quiet precision</em>
      </h1>

      <p className={styles.heroSub}>
        Aurum gives your application a complete authentication layer — seamless
        for your users, robust for your team, invisible at its best.
      </p>

      <div className={styles.heroCta}>
        <Link href="/register" className={styles.btnLarge}>Get started free</Link>
        <Link href="#" className={styles.btnOutline}>See how it works</Link>
      </div>

      <div className={styles.trust}>
        <div className={styles.trustAvatars}>
          {TRUST_AVATARS.map(({ initials, gradient }) => (
            <span key={initials} style={{ background: gradient }}>
              {initials}
            </span>
          ))}
        </div>
        Trusted by{' '}
        <strong style={{ color: 'var(--indigo)', fontWeight: 600 }}>
          &nbsp;4,200+&nbsp;
        </strong>{' '}
        developers worldwide
      </div>
    </section>
  );
}