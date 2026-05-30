import Link from 'next/link';
import styles from './styles/AboutSection.module.css';

type AboutSectionProps = {
  nameJa: string;
  nameEn: string;
};

export default function AboutSection({ nameJa, nameEn }: AboutSectionProps) {
  return (
    <section
      id="about"
      className={styles.sectionPair}
      aria-labelledby="about-title about-profile-name"
    >
      <div className={styles.containerPair}>
        <div className={`${styles.message} ${styles.messagePair}`}>
          <h2 id="about-title" className={styles.heading}>
            <span
              className={`${styles.title} ${styles.titleReveal} aboutTitleReveal`}
              lang="en"
            >
              ABOUT
            </span>
          </h2>
          <div className={styles.nameBlock}>
            <p id="about-profile-name" className={styles.nameJa} lang="ja">
              {nameJa}
            </p>
            <p className={styles.nameEn} lang="en">
              {nameEn}
            </p>
            <p className={styles.lead}>
              Webアプリケーションを中心に開発しています。
            </p>
            <p className={styles.body}>
              開発において、単に機能を実装するだけでなく、なぜその技術スタックを選んだのかという『選定理由』を大切にしています。また、ユーザーの利便性を考えて、UI/UXを最適化しています。
            </p>
            <Link
              href="/about"
              prefetch={false}
              className={styles.moreRead}
              aria-label="About 詳細ページへ"
            >
              More Read
              <span className={styles.moreReadArrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
