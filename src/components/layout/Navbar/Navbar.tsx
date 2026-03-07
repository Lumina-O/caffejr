import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>Caffe Jr.</div>

      <nav className={styles.nav}>
        <a href="#help">Services</a>
        <a href="#process">Process</a>
        <a href="#testimonials">Reviews</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

// TODO: Add mobile navigation menu if the client wants a hamburger menu later.