import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <main className={styles.container}>
      <h1 className={styles.errorCode}>Lost Your Way?</h1>
      <h2 className={styles.title}>Sorry, we can't find that page.</h2>
      <p className={styles.message}>
        You'll find lots to explore on the home page.
      </p>
      <Link to="/" className={styles.homeBtn}>
        Netflix Home
      </Link>
    </main>
  );
}

export default NotFound;
