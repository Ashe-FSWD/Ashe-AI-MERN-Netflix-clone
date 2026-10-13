import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import { useToast } from "../../components/Toast/ToastContext";
import styles from "./Account.module.css";

function Account() {
  const { user, logout, openAuthModal, updatePlan } = useAuth();
  const { watchlist } = useWatchlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className={styles.container}>
        <h1 className={styles.heading}>Account</h1>
        <div className={styles.card}>
          <p>You are not currently signed in.</p>
          <button
            className={styles.signOutBtn}
            onClick={() => openAuthModal("signin")}
          >
            Sign In to Netflix
          </button>
        </div>
      </main>
    );
  }

  const handleSignOut = () => {
    logout();
    showToast("Signed out of your account", "info");
    navigate("/");
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Account</h1>
      <p style={{ color: "#f0c36d", marginBottom: "18px" }}>Demo account only. Changes are stored in this browser and are not connected to a real Netflix membership.</p>

      {/* Profile Card */}
      <div className={styles.card}>
        <div className={styles.profileRow}>
          <img
            src={user.avatar}
            alt={user.name}
            className={styles.avatar}
          />
          <div className={styles.profileInfo}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className={styles.sectionDivider} />

        {/* Membership Details: plan changes are local demo state only. */}
        <div className={styles.detailGrid}>
          <span className={styles.detailLabel}>Membership</span>
          <span className={styles.detailValue}>{user.plan}</span>
          <button type="button" className={styles.actionLink} onClick={() => { const plan = updatePlan(); if (plan) showToast(`Demo plan changed to ${plan}.`, "info"); }}>
            Change demo plan
          </button>
        </div>

        <div className={styles.sectionDivider} />

        {/* Member Since */}
        <div className={styles.detailGrid}>
          <span className={styles.detailLabel}>Member Since</span>
          <span className={styles.detailValue}>{user.memberSince}</span>
          <span />
        </div>

        <div className={styles.sectionDivider} />

        {/* Saved Watchlist Stats */}
        <div className={styles.detailGrid}>
          <span className={styles.detailLabel}>My List</span>
          <span className={styles.detailValue}>
            {watchlist.length} titles saved in your watchlist
          </span>
          <span className={styles.actionLink} onClick={() => navigate("/my-list")}>
            View List
          </span>
        </div>

        <div className={styles.sectionDivider} />

        {/* Sign out button */}
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out of Netflix
        </button>
      </div>
    </main>
  );
}

export default Account;
