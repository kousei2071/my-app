import styles from './WorksSection.module.css';

export default function WorksSection() {
  return (
    <section id="works" className={styles.section} aria-labelledby="works-title">
      <h2 id="works-title" className={styles.leftTitle}>
        WORKS
      </h2>
      <p className={styles.rightTitle} aria-hidden="true">
        WORKS
      </p>
      <div className={styles.inner}>
        <p className={styles.placeholder}>ここに制作したWebサイトのカードを作っていく</p>
      </div>
    </section>
  );
}
