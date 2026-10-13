import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const USER_KEY = "netflix_demo_user";
const DEMO_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
const DEMO_PLANS = ["Basic", "Standard HD", "Premium (4K + HDR)"];

// This is intentionally a frontend-only demo session, NOT secure authentication.
// Real accounts require a backend or a hosted authentication provider.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.warn("Could not persist demo session:", error);
    }
  }, [user]);

  const login = (email, password) => {
    if (!email?.trim() || !password) throw new Error("Enter your email and password to continue.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error("Enter a valid email address.");
    if (password.length < 6) throw new Error("For this demo, password must be at least 6 characters.");
    const name = email.trim().split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const demoUser = { id: `demo_${Date.now()}`, name, email: email.trim(), avatar: DEMO_AVATAR, plan: "Standard HD", memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }), isDemo: true };
    setUser(demoUser);
    setIsAuthModalOpen(false);
    return demoUser;
  };

  const signup = (name, email, password) => {
    if (!name?.trim() || !email?.trim() || !password) throw new Error("Please complete all registration fields.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error("Enter a valid email address.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    const demoUser = { id: `demo_${Date.now()}`, name: name.trim(), email: email.trim(), avatar: DEMO_AVATAR, plan: "Standard HD", memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }), isDemo: true };
    setUser(demoUser);
    setIsAuthModalOpen(false);
    return demoUser;
  };

  const updatePlan = () => {
    if (!user) return null;
    const current = DEMO_PLANS.indexOf(user.plan);
    const nextPlan = DEMO_PLANS[(current + 1) % DEMO_PLANS.length];
    setUser((currentUser) => currentUser ? { ...currentUser, plan: nextPlan } : currentUser);
    return nextPlan;
  };

  const logout = () => setUser(null);
  const openAuthModal = (mode = "signin") => { setAuthMode(mode); setIsAuthModalOpen(true); };
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const loginWithOAuth = () => { throw new Error("Google/GitHub OAuth is not configured in this frontend-only demo."); };

  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, signup, loginWithOAuth, updatePlan, logout, isAuthModalOpen, authMode, openAuthModal, closeAuthModal, setAuthMode }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
