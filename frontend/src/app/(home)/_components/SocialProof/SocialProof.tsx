import { TESTIMONIALS } from '@/data/testimonials';
import styles from './SocialProof.module.css';

export function SocialProof() {
  return (
    <section className={styles.social}>
      <div className={styles.socialInner}>
        <div className={styles.sectionLabel}>From the community</div>
        <div className={styles.sectionTitle}>Built by developers, trusted by teams</div>
        <div className={styles.quotes}>
          {TESTIMONIALS.map(({ quote, name, role, initials, gradient }) => (
            <div key={name} className={styles.quoteCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quoteText}>"{quote}"</p>
              <div className={styles.quoteAuthor}>
                <div
                  className={styles.authorAvatar}
                  style={{ background: gradient }}
                >
                  {initials}
                </div>
                <div>
                  <div className={styles.authorName}>{name}</div>
                  <div className={styles.authorRole}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}