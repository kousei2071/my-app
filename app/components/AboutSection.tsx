import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.section} aria-labelledby="about-title">
      <div className={styles.container}>
        <h2 id="about-title" className={styles.heading}>
          <span className={styles.title}>About</span>
        </h2>
        <p className={styles.description}>
          Web development focused on clear structure, accessibility, and smooth user experience.
        </p>
      </div>
    </section>
  );
}
