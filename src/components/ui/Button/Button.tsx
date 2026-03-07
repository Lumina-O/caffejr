import styles from "./Button.module.css";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  text,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {text}
    </button>
  );
}

// TODO: Add button variants like primary, secondary, and outline if the design expands.