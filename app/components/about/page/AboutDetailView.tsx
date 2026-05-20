import Bridge from './bridge/Bridge';
import CareerSection from './career/CareerSection';
import ProfileSection from './profile/ProfileSection';
import styles from './styles/page.module.css';

export default function AboutDetailView() {
  return (
    <div className={styles.page}>
      {/* 第1章: About（プロフィール） */}
      <ProfileSection />
      <Bridge />
      {/* 第2章: 経歴 + 理念・資格 */}
      <CareerSection />
    </div>
  );
}
