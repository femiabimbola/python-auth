import styles from './DashboardPreview.module.css';

const SIDEBAR_ITEMS = [
  { label: 'Overview', active: true },
  { label: 'Users' },
  { label: 'Sessions' },
  { label: 'Providers' },
  { label: 'Webhooks' },
  { label: 'Logs' },
];

const STATS = [
  { value: '12,840', label: 'Active users', badge: '↑ 8.4%' },
  { value: '99.98%', label: 'Uptime', badge: 'Excellent' },
  { value: '34 ms', label: 'Avg. auth time', badge: '↓ 12ms' },
];

const BAR_HEIGHTS = [40, 55, 48, 62, 70, 52, 88, 75, 60, 92, 80, 68, 100, 84];

function getBarVariant(h: number) {
  if (h >= 85) return styles.barHi;
  if (h >= 60) return styles.barMd;
  return '';
}

export function DashboardPreview() {
  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewCard}>
        {/* Browser chrome */}
        <div className={styles.previewBar}>
          <span className={`${styles.previewDot} ${styles.dot1}`} />
          <span className={`${styles.previewDot} ${styles.dot2}`} />
          <span className={`${styles.previewDot} ${styles.dot3}`} />
          <div className={styles.previewUrl}>app.aurum.io/dashboard</div>
        </div>

        <div className={styles.previewBody}>
          {/* Sidebar */}
          <div className={styles.previewSidebar}>
            <div className={styles.sidebarLabel}>Workspace</div>
            {SIDEBAR_ITEMS.map(({ label, active }) => (
              <div
                key={label}
                className={`${styles.pNavItem} ${active ? styles.active : ''}`}
              >
                <span className={`${styles.pIcon} ${active ? styles.activeIcon : ''}`} />
                {label}
              </div>
            ))}
            <div style={{ marginTop: 'auto' }}>
              <div className={styles.pNavItem}>
                <span className={styles.pIcon} />
                Settings
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className={styles.previewMain}>
            <div className={styles.pHeader}>Overview — June 2026</div>
            <div className={styles.pStats}>
              {STATS.map(({ value, label, badge }) => (
                <div key={label} className={styles.pStat}>
                  <div className={styles.pStatVal}>{value}</div>
                  <div className={styles.pStatLbl}>{label}</div>
                  <span className={styles.pBadge}>{badge}</span>
                </div>
              ))}
            </div>
            <div className={styles.pChartArea}>
              <div className={styles.pChartLbl}>Sign-ins — last 14 days</div>
              <div className={styles.pBars}>
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className={`${styles.pBar} ${getBarVariant(h)}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}