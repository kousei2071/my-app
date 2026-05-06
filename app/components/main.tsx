'use client'

import styles from './main.module.css';

export default function Main() {
    return (
        <section className={styles.section}>
        <div className={styles.content}>
          <h1>Portfolio</h1>
          <div className={styles.divider} />
          <p>Simple & Minimal Design</p>
        </div>
        <div className={styles.scrollIndicatorWrapper}>
          <div className={styles.scrollIndicator}>
            <div className={styles.line} />
            <div className={styles.dot} />
          </div>
        </div>
        <img src="/myline.png" alt="myline" className={styles.backgroundImage} />
      </section>
    );
}
