import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiSun, FiMoon, FiArrowUpRight } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import useDialogFocus from "../../hooks/useDialogFocus";
import BrandMark from "../BrandMark";
import "./Navbar.css";

const links = [["Work", "projects"], ["About", "about"], ["Expertise", "skills"], ["Contact", "contact"]];
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const { theme, toggleTheme } = useTheme();
  const drawerRef = useRef(null);
  const closeMenu = () => setIsMenuOpen(false);
  useDialogFocus(isMenuOpen, drawerRef, closeMenu);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-20% 0px -55% 0px" });
    document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return createPortal(
    <>
      <header className="navbar">
        <nav className="nav-container page-width" aria-label="Main navigation">
          <a className="navbar-brand" href="#home" aria-label="Muhammad Rizwan home"><BrandMark /><span className="brand-name">MUHAMMAD RIZWAN<span>DEVELOPER & CREATIVE THINKER</span></span></a>
          <div className="nav-links">{links.map(([label, id]) => <a key={id} href={"#" + id} aria-current={active === id ? "location" : undefined}>{label}<span className="nav-active-dot" /></a>)}</div>
          <div className="nav-actions">
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>{theme === "light" ? <FiMoon /> : <FiSun />}</button>
            <a className="cv-nav-btn" href="#contact">Let’s talk <FiArrowUpRight /></a>
            <button className="menu-toggle" type="button" onClick={() => setIsMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={isMenuOpen} aria-controls="mobile-navigation"><FiMenu /></button>
          </div>
        </nav>
      </header>
      <AnimatePresence>{isMenuOpen && <>
        <motion.div className="drawer-backdrop" onClick={closeMenu} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside ref={drawerRef} tabIndex={-1} id="mobile-navigation" className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: .25 }}>
          <div className="drawer-header"><span className="eyebrow">Explore the portfolio</span><button type="button" onClick={closeMenu} aria-label="Close navigation menu"><FiX /></button></div>
          <nav>{links.map(([label, id], i) => <a key={id} href={"#" + id} onClick={closeMenu}><span>0{i + 1}</span>{label}<FiArrowUpRight /></a>)}</nav>
          <a className="text-link" href="/Muhammad_Rizwan_CV.pdf" download onClick={closeMenu}>Download résumé <FiArrowUpRight /></a>
          <p className="drawer-note">Lahore, Pakistan<br />Open to freelance & full-time opportunities.</p>
        </motion.aside>
      </>}</AnimatePresence>
    </>, document.body
  );
};
export default Navbar;
