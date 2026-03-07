import styles from "./Testimonials.module.css";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";
import InfoCard from "@/components/ui/InfoCard/InfoCard";

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Testimonials"
          title="What our customers say"
          description="A few kind words from people who have experienced our coffee service."
          align="center"
        />

        <div className={styles.grid}>
          <InfoCard
            title="Beautiful setup"
            text='"The coffee station looked amazing and the service felt truly premium from start to finish."'
          />
          <InfoCard
            title="Smooth experience"
            text='"Everything was easy, professional, and our guests loved the coffee quality."'
          />
          <InfoCard
            title="Would book again"
            text='"Perfect for our event. Warm team, elegant presentation, and delicious coffee."'
          />
        </div>
      </div>
    </section>
  );
}

// TODO: Replace placeholder reviews with real customer testimonials and names.