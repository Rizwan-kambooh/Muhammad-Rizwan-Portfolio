import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import profileImage from "../../assets/profile.jpeg";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isMenuOpen) {
      body.classList.add("menu-open");
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
      html.style.overflow = "hidden";

      return () => {
        body.classList.remove("menu-open");
        body.style.overflow = "";
        body.style.touchAction = "";
        html.style.overflow = "";
      };
    }

    body.classList.remove("menu-open");
    body.style.overflow = "";
    body.style.touchAction = "";
    html.style.overflow = "";
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navigationHeader = (
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            Muhammad Rizwan<span>.</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="/Muhammad_Rizwan_CV.pdf" download="Muhammad_Rizwan_CV.pdf" className="cv-nav-btn">
            Download CV
          </a>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <FiMenu />
          </button>
        </div>
      </header>
  );

  return (
    <>
      {createPortal(navigationHeader, document.body)}

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              className="drawer-backdrop"
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              id="mobile-navigation"
              className="mobile-drawer"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="drawer-header">
                <div className="drawer-profile">
                  <img src={profileImage} alt="Muhammad Rizwan" />
                  <span>Muhammad Rizwan</span>
                </div>
                <button className="drawer-close" type="button" onClick={closeMenu} aria-label="Close navigation menu">
                  <FiX />
                </button>
              </div>
              <nav>
                <a href="#home" onClick={closeMenu}>Home</a>
                <a href="#about" onClick={closeMenu}>About</a>
                <a href="#skills" onClick={closeMenu}>Skills</a>
                <a href="#projects" onClick={closeMenu}>Projects</a>
                <a href="#contact" onClick={closeMenu}>Contact</a>
                <a href="/Muhammad_Rizwan_CV.pdf" download="Muhammad_Rizwan_CV.pdf" className="drawer-cv" onClick={closeMenu}>
                  Download CV
                </a>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
