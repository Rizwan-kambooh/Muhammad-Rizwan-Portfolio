import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  return (
    <motion.header
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
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
        <a 
          href="/Muhammad_Rizwan_CV.pdf" 
          download="Muhammad_Rizwan_CV.pdf"
          className="cv-nav-btn"
        >
          Download CV
        </a>
      </div>
    </motion.header>
  );
};

export default Navbar;