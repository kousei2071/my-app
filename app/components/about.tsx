import React from 'react'
import styles from './about.module.css';

export default function About() {
    return (
        <section className={styles.section}>
        <div className={styles.container}>
            <h2 className={styles.heading}>
                <span className={styles.title}>About</span>
            </h2>
        </div>
        </section>
    );
}
