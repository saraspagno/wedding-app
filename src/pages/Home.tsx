import React from 'react';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            {/* Add your hero image here */}
          </div>
          <div className={styles.heroContent}>
            <h2 className={styles.names}>Sara & Gavriel</h2>
            <p className={styles.date}>May 15, 2025</p>
          </div>
        </section>
        <section className={styles.weddingDetails}>
          <h3>Wedding Details</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <h4>Ceremony</h4>
              <p>4:00 PM</p>
              <p>St. Mary's Church</p>
              <p>123 Wedding Street</p>
            </div>
            <div className={styles.detailItem}>
              <h4>Reception</h4>
              <p>6:00 PM</p>
              <p>Grand Hotel</p>
              <p>456 Celebration Ave</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 