"use client";

import styles from "./page.module.css";
// import { Multithreading } from "./multithreading";
import { Recursion } from "./recursion";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Multithreading /> */}
      <Recursion />
    </main>
  );
}
