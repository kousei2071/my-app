import Link from 'next/link';
import { journeyMilestones } from './journeyMilestones';
import styles from './styles/AboutDetailView.module.css';

const PROFILE = {
  nameJa: '富田 幸聖',
  nameEn: 'Kousei Tomita',
  lead: 'Webアプリケーションを中心に開発しています。',
  body:
    '開発において、単に機能を実装するだけでなく、なぜその技術スタックを選んだのかという「選定理由」を大切にしています。また、ユーザーの利便性を考えて、UI/UXを最適化しています。',
  focus: [
    'フロントエンド（React / Next.js）',
    'バックエンド（Django など）',
    'チーム開発・設計のすり合わせ',
  ],
};

export default function AboutDetailView() {
  return (
    <div className={styles.page}>
      {/* プロフィールセクション - ホームの AboutSection スタイル */}
      <section id="profile" className={styles.profileSection} aria-labelledby="detail-about-title">
        <p className={styles.bgTitleLeft} aria-hidden="true">
          ABOUT
        </p>
        <p className={styles.bgTitleRight} aria-hidden="true">
          ABOUT
        </p>
        <div className={styles.profileContainer}>
          <div className={styles.profileMessage}>
            <h1 id="detail-about-title" className={styles.heading}>
              <span className={styles.title} lang="en">
                ABOUT
              </span>
            </h1>
            <div className={styles.nameBlock}>
              <p className={styles.nameJa} lang="ja">
                {PROFILE.nameJa}
              </p>
              <p className={styles.nameEn} lang="en">
                {PROFILE.nameEn}
              </p>
              <p className={styles.lead}>{PROFILE.lead}</p>
              <p className={styles.body}>{PROFILE.body}</p>
              <div className={styles.focusBlock}>
                <h2 className={styles.focusHeading}>得意・関心</h2>
                <ul className={styles.focusList}>
                  {PROFILE.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 経歴セクション - ホームの LifeJourneySection スタイル */}
      <section id="journey" className={styles.journeySection} aria-labelledby="detail-journey-title">
        <div className={styles.journeyInner}>
          <h2 id="detail-journey-title" className={styles.journeyHeading}>
            <span className={styles.journeyEyebrow} lang="en">
              Path
            </span>
            <span className={styles.journeyMain}>これまでの道</span>
          </h2>

          <ol className={styles.timeline}>
            {journeyMilestones.map((m, i) => (
              <li key={m.id} className={styles.event}>
                <article id={`journey-${m.id}`} className={styles.card}>
                  <span className={styles.index} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={styles.period}>{m.period}</p>
                  <h3 className={styles.cardTitle}>{m.title}</h3>
                  <p className={styles.cardBody}>{m.description}</p>
                  <p className={styles.cardDetail}>{m.detail}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* トップへ戻るリンク */}
      <div className={styles.backSection}>
        <Link href="/" className={styles.backLink}>
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
