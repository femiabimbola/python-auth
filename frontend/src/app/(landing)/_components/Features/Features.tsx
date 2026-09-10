import { FEATURES } from '@/data/features';
import styles from './Features.module.css';



export function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.sectionLabel}>What we offer</div>
      <div className={styles.sectionTitle}>Everything you need. Nothing you don't.</div>
      <div className={styles.featGrid}>
        {FEATURES.map(({ title, description, svgPath }) => (
          <div key={title} className={styles.featCard}>
            <div className={styles.featIcon}>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={{ __html: svgPath }}
              />
            </div>
            <div className={styles.featTitle}>{title}</div>
            <div className={styles.featDesc}>{description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}