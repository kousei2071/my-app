import Header from '../components/Header';
import { AboutDetailView } from '../components/about/page';
import ScrollToHash from './ScrollToHash';

export default function AboutPage() {
  return (
    <div>
      <ScrollToHash />
      <Header />
      <AboutDetailView />
    </div>
  );
}
