import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h3 className={styles.brand}>Caffe Jr.</h3>
          <p className={styles.text}>
            Premium coffee experiences for events, offices, and special moments.
          </p>
        </div>

        <div className={styles.links}>
          <a href="#help">Services</a>
          <a href="#process">Process</a>
          <a href="#testimonials">Reviews</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Caffe Jr. All rights reserved.</p>
      </div>
    </footer>
  );
}

// TODO: Replace placeholder company text and copyright year if needed.