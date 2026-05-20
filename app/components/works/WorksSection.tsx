import WorksGrid from './WorksGrid';
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
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>My Web Archive</p>
          <p className={styles.lead}>
            これまで作ってきたWebサイトを、役割・使用技術・URLと一緒に残していくカード一覧です。
          </p>
        </div>
        <WorksGrid />
      </div>
    </section>
  );
}
