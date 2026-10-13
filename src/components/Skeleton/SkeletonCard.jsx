import React from "react";
import styles from "./Skeleton.module.css";

export function SkeletonCard() {
  return <div className={styles.skeletonCard} />;
}

export function SkeletonRow() {
  return (
    <div className={styles.skeletonRow}>
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonGrid}>
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;
