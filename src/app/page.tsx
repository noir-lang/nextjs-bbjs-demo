"use client";

import styles from "./page.module.css";
import { Recursion } from "./recursion";

export default function Home() {
  return (
    <main className={styles.main}>
      <Recursion />
    </main>
  );
}
