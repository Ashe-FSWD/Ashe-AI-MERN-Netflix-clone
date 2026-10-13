import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, User, X, Menu, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/ToastContext";
import NetflixLogo from "../../assets/image/logo.png";
import styles from "./Header.module.css";

/**
 * Header Component
 * Implements Netflix-style sticky header with dynamic scroll gradient/blur,
 * expandable search bar, notification badge, and profile dropdown menu.
 */
function Header({ onSearch }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();

  // State for vertical scroll detection
  const [isScrolled, setIsScrolled] = useState(false);

  // State for expanding search bar
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for profile menu dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State for responsive mobile drawer
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const searchInputRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  /**
   * Scroll Effect:
   * Adds a passive window scroll listener to toggle solid dark header
   * when scrolling beyond 50px threshold.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   * Focus search input automatically when opened
   */
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  /**
   * Close profile dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search submit or input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch("");
    setIsSearchOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
    showToast("Signed out successfully", "info");
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "TV Shows", path: "/tv" },
    { label: "Movies", path: "/movies" },
    { label: "New & Popular", path: "/latest" },
    { label: "My List", path: "/my-list" },
    { label: "Browse by Language", path: "/languages" },
  ];

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      role="banner"
    >
      {/* Left Section: Mobile Menu + Logo + Navigation */}
      <div className={styles.leftSection}>
        {/* Mobile Hamburger Toggle */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Netflix Brand Logo */}
        <Link to="/" className={styles.logoLink} onClick={() => setIsMobileNavOpen(false)}>
          <img src={NetflixLogo} alt="Netflix" className={styles.logo} />
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <nav
          className={`${styles.navLinks} ${
            isMobileNavOpen ? styles.navLinksMobileOpen : ""
          }`}
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeNavItem : ""}`
              }
              onClick={() => setIsMobileNavOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right Section: Expandable Search + Notification Bell + Profile Menu / Sign In */}
      <div className={styles.rightSection}>
        {/* Search Container */}
        <div className={styles.searchContainer}>
          {!isSearchOpen ? (
            <button
              className={styles.searchIconBtn}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open Search Bar"
            >
              <Search size={20} />
            </button>
          ) : (
            <div className={`${styles.searchBox} ${styles.searchBoxOpen}`}>
              <Search size={18} color="#e5e5e5" />
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search titles"
              />
              <button
                className={styles.clearSearchBtn}
                onClick={handleClearSearch}
                aria-label="Clear Search"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell with Badge */}
        <button
          className={styles.notificationBtn}
          aria-label="Notifications"
          onClick={() => showToast("You have no new notifications", "info")}
        >
          <Bell size={20} />
          <span className={styles.notificationBadge} />
        </button>

        {/* Profile Menu or Sign In Button */}
        {isAuthenticated ? (
          <div
            ref={profileRef}
            className={styles.profileContainer}
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <button
              className={styles.profileTrigger}
              aria-expanded={isProfileOpen}
              aria-label="User Account Menu"
            >
              <div className={styles.avatarBox}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User className={styles.avatarIcon} />
                )}
              </div>
              <ChevronDown
                size={16}
                className={`${styles.caretIcon} ${
                  isProfileOpen ? styles.caretRotated : ""
                }`}
              />
            </button>

            {/* Dropdown popup matching Design 3 */}
            {isProfileOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  style={{
                    padding: "8px 18px",
                    fontSize: "0.8rem",
                    color: "#8c8c8c",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: "4px",
                  }}
                >
                  Signed in as <b style={{ color: "#ffffff" }}>{user.name}</b>
                </div>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/account");
                  }}
                >
                  Account
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast("Netflix Help Center (Educational Demo)", "info");
                  }}
                >
                  Help Center
                </button>
                <div className={styles.dropdownDivider} />
                <button
                  className={styles.dropdownItem}
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            style={{
              backgroundColor: "#e50914",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.85rem",
              padding: "6px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => openAuthModal("signin")}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
