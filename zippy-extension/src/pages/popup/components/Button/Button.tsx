import React, { HTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

export interface SocialButtonProps extends HTMLAttributes<HTMLButtonElement> {
  color: string;
}
const Button = ({ children, color, ...rest }: SocialButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.socialButton} ${color}`}
      style={{ backgroundColor: `${color}` }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
