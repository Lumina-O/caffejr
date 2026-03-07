import styles from "./Help.module.css";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import InfoCard from "@/components/ui/InfoCard/InfoCard";

export default function Help() {
  return (
    <section id="help" className={styles.help}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Services"
          title="Hvad kan vi hjælpe med?"
          description="We create warm coffee experiences for businesses, private events, and special gatherings."
          align="center"
        />

        <div className={styles.grid}>
          <InfoCard
            title="Corporate events"
            text="Coffee catering for meetings, conferences, launches, and company celebrations."
          />
          <InfoCard
            title="Private celebrations"
            text="Elegant coffee service for birthdays, weddings, family events, and intimate gatherings."
          />
          <InfoCard
            title="Pop-up experiences"
            text="Flexible coffee concepts for retail events, activations, showrooms, and outdoor setups."
          />
        </div>
      </div>
    </section>
  );
}

// TODO: Replace English placeholder body copy with final customer-approved Danish text if required.