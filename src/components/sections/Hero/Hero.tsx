import styles from "./Hero.module.css";
import Button from "@/components/ui/Button/Button";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.kicker}>Luxury coffee catering</p>
        <h1 className={styles.title}>Coffee experiences for your events</h1>
        <p className={styles.description}>
          We bring premium coffee, elegant presentation, and warm service to
          your customer events, company gatherings, and celebrations.
        </p>

        <div className={styles.actions}>
          <Button text="Book now" />
          <Button text="See services" />
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.imagePlaceholder}>Coffee Machine / Hero Image</div>
      </div>
    </section>
  );
}

// TODO: Replace placeholder with actual hero image and add service cards under the hero text.