import styles from "./Contact.module.css";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import Button from "@/components/ui/Button/Button";

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.left}>
          <SectionTitle
            eyebrow="Contact"
            title="Let us create your next coffee experience"
            description="Reach out with your event details and we will help you plan a setup that fits your guests and atmosphere."
          />

          <div className={styles.info}>
            <p>
              <strong>Phone:</strong> +45 12 34 56 78
            </p>
            <p>
              <strong>Email:</strong> hello@caffejr.dk
            </p>
            <p>
              <strong>Address:</strong> Copenhagen, Denmark
            </p>
          </div>

          <div className={styles.actions}>
            <Button text="Get in touch" />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.mapPlaceholder}>Map / image / contact card</div>
        </div>
      </div>
    </section>
  );
}

// TODO: Replace placeholder contact info and add a real contact form or map embed if the client wants it.