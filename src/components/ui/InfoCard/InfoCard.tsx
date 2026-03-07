import styles from "./InfoCard.module.css";

type InfoCardProps = {
  title: string;
  text: string;
  number?: string;
};

export default function InfoCard({ title, text, number }: InfoCardProps) {
  return (
    <article className={styles.card}>
      {number && <span className={styles.number}>{number}</span>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </article>
  );
}

// TODO: Add icon support for services and process cards if needed later.