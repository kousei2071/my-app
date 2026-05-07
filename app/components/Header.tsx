import React from 'react'
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header
      className="fixed z-50 bg-transparent shadow-none top-[50px] left-[100px] w-[calc(100%-200px)]"
    >
        <nav className={`w-full px-0 py-4 ${styles.nav}`}>
            <h1 className={`text-3xl font-bold ${styles.title}`}>Kousei Tomita</h1>
            <ul className={styles.links}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/works">Works</Link></li>
            </ul>
        </nav>
    </header>
  );
};

export default Header;
