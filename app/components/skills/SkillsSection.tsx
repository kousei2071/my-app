import Image from 'next/image';
import styles from './SkillsSection.module.css';

const skillGroups = [
  {
    title: 'Frontend',
    description: 'Webページの構造、見た目、動きを組み立てるための基本技術です。',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Framework',
    description: 'コンポーネント単位でUIを分け、ページ全体を管理しやすくします。',
    items: ['React', 'Next.js'],
  },
  {
    title: 'Styling',
    description: '画面幅に合わせたレイアウトや、スクロールに合わせた演出を作ります。',
    items: ['CSS Modules', 'Responsive Design', 'Animation'],
  },
  {
    title: 'Tools',
    description: '開発、デザイン確認、変更管理に使っているツールです。',
    items: ['Git', 'GitHub', 'VS Code', 'Figma'],
  },
];

const siteStack = [
  {
    name: 'Next.js',
    description: 'ページとセクションをコンポーネント単位で分けて構成しています。',
  },
  {
    name: 'TypeScript',
    description: 'データ構造やpropsに型をつけて、変更しやすいコードにしています。',
  },
  {
    name: 'CSS',
    description: 'セクションごとにスタイルを閉じ込め、見た目の衝突を防いでいます。',
  },
  {
    name: 'React',
    description: 'AboutやHeaderの見え方を、スクロール位置に合わせて変化させています。',
  },
  {
    name: 'Tailwind CSS',
    description: '見出し、aria-label、装飾要素のaria-hiddenを意識して実装しています。',
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <p className={styles.backgroundText} aria-hidden="true">
        SKILLS
      </p>
      <div className={styles.inner}>
        <div className={styles.headingBlock}>
          <h2 id="skills-title" className={styles.title}>
            Skills &amp; Stack
          </h2>
          <p className={styles.lead}>
            使える技術だけでなく、このサイトをどう設計・実装したかもまとめています。
          </p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.skillsCard}>
            <p className={styles.cardLabel}>Core Skills</p>
            <div className={styles.skillList}>
              {skillGroups.map((group) => (
                <article key={group.title} className={styles.skillGroup}>
                  <div>
                    <h3 className={styles.groupTitle}>{group.title}</h3>
                    <p className={styles.groupDescription}>{group.description}</p>
                  </div>
                  <ul className={styles.tags} aria-label={`${group.title}のスキル`}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.stackColumn}>
            <div className={styles.stackCard}>
              <p className={styles.cardLabel}>This Site Stack</p>
              <ol className={styles.stackList}>
                {siteStack.map((stack, index) => (
                  <li key={stack.name} className={styles.stackItem}>
                    <span className={styles.stackNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className={styles.stackTitle}>{stack.name}</h3>
                      <p className={styles.stackDescription}>{stack.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <a
              href="https://github.com/"
              className={styles.stackButton}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHubで詳しく見る"
            >
              <Image
                src="/icons/search.png"
                alt=""
                width={22}
                height={22}
                className={styles.stackButtonIcon}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
