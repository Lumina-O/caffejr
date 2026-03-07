import styles from "./Process.module.css";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import InfoCard from "@/components/ui/InfoCard/InfoCard";

export default function Process() {
  return (
    <section id="process" className={styles.process}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Process"
          title="Sådan foregår det"
          description="A simple and elegant process from first contact to the final cup."
          align="center"
        />

        <div className={styles.grid}>
          <InfoCard
            number="1"
            title="Tell us about your event"
            text="Share your date, location, guest count, and the type of coffee experience you want."
          />
          <InfoCard
            number="2"
            title="We plan the setup"
            text="We tailor the coffee station, service format, and flow to match your event."
          />
          <InfoCard
            number="3"
            title="We serve on the day"
            text="We arrive, prepare, serve, and create a polished experience for your guests."
          />
        </div>
      </div>
    </section>
  );
}

// TODO: Add a timeline or connector line between cards if you want a more premium visual flow.