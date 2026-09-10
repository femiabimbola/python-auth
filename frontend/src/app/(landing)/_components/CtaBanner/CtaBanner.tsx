'use client';

import { useState } from 'react';
import styles from './CtaBanner.module.css';

export function CtaBanner() {
  const [email, setEmail] = useState('');

  function handleSubmit() {
    if (!email) return;
    // TODO: wire up to your signup API
    console.log('Signup email:', email);
  }

  return (
    <div className={styles.ctaBanner}>
      <div className={styles.ctaInner}>
        <h2>
          Start in minutes.
          <br />
          Scale without limits.
        </h2>
        <p>Free up to 10,000 monthly active users. No credit card required.</p>
        <div className={styles.ctaForm}>
          <input
            className={styles.ctaInput}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className={styles.btnWhite} onClick={handleSubmit}>
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}