import styles from './WorksSection.module.css';

const works = [
  {
    title: 'Portfolio Website',
    period: '2026',
    role: 'Design / Frontend',
    description: '自己紹介、制作姿勢、これまで作ったWebサイトをまとめるためのポートフォリオ。',
    url: 'your-portfolio.example',
    tags: ['Next.js', 'TypeScript', 'CSS Modules'],
  },
  {
    title: 'Cafe Landing Page',
    period: '2025',
    role: 'UI Design / Coding',
    description: '店舗の空気感が伝わるように、余白と写真の見せ方を意識したランディングページ。',
    url: 'cafe-site.example',
    tags: ['React', 'Responsive', 'Animation'],
  },
  {
    title: 'Product LP',
    period: '2025',
    role: 'Frontend',
    description: 'サービスの強みを短い導線で伝える、ファーストビュー重視のプロダクト紹介サイト。',
    url: 'product-lp.example',
    tags: ['Next.js', 'LP', 'SEO'],
  },
];

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
        <div className={styles.grid} aria-label="制作したWebサイト一覧">
          {works.map((work, index) => (
            <article className={styles.card} key={work.title}>
              <div className={styles.cardTop}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.period}>{work.period}</span>
              </div>
              <div className={styles.preview} aria-hidden="true">
                <span />
                <span />
                <span />
                <div className={styles.previewWindow}>
                  <div className={styles.previewTitle}>{work.title}</div>
                  <div className={styles.previewLine} />
                  <div className={styles.previewLineShort} />
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.role}>{work.role}</p>
                <h3 className={styles.cardTitle}>{work.title}</h3>
                <p className={styles.description}>{work.description}</p>
                <ul className={styles.tags} aria-label={`${work.title}の使用技術`}>
                  {work.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <p className={styles.url}>{work.url}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
