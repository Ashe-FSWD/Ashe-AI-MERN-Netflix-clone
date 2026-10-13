import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import styles from "./Footer.module.css";

/**
 * Footer Component
 * Netflix-style footer with brand social links, 4-column link layout,
 * service code toggle, and copyright notice matching Design 6.
 */
function Footer() {
  const [showServiceCode, setShowServiceCode] = useState(false);

  const footerLinks = [
    [
      { label: "Audio Description", href: "#" },
      { label: "Investor Relations", href: "#" },
      { label: "Legal Notices", href: "#" },
    ],
    [
      { label: "Help Centre", href: "#" },
      { label: "Jobs", href: "#" },
      { label: "Cookie Preferences", href: "#" },
    ],
    [
      { label: "Gift Cards", href: "#" },
      { label: "Terms of Use", href: "#" },
      { label: "Corporate Information", href: "#" },
    ],
    [
      { label: "Media Centre", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Social Media Channels */}
      <div className={styles.socialRow}>
        <a
          href="https://facebook.com/netflix"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
          aria-label="Netflix Facebook"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://instagram.com/netflix"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
          aria-label="Netflix Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://twitter.com/netflix"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
          aria-label="Netflix Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href="https://youtube.com/netflix"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialIcon}
          aria-label="Netflix YouTube"
        >
          <FaYoutube />
        </a>
      </div>

      {/* 4-Column Navigation Link Grid */}
      <div className={styles.linkGrid}>
        {footerLinks.map((column, colIndex) => (
          <div key={colIndex} className={styles.linkColumn}>
            {column.map((link, linkIndex) => (
              <a
                key={linkIndex}
                href={link.href}
                className={styles.footerLink}
                onClick={(e) => e.preventDefault()}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Service Code Button */}
      <div>
        <button
          className={styles.serviceCodeBtn}
          onClick={() => setShowServiceCode((prev) => !prev)}
        >
          {showServiceCode ? "084-291" : "Service Code"}
        </button>
      </div>

      {/* Copyright Notice */}
      <p className={styles.copyright}>© 1997-2026 Netflix, Inc.</p>
    </footer>
  );
}

export default Footer;
