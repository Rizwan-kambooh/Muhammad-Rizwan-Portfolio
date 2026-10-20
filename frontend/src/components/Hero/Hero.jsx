import { motion } from "framer-motion";
import { FiArrowDown, FiArrowUpRight, FiCode, FiDownload } from "react-icons/fi";
import profileImage from "../../assets/profile.jpeg";
import "./Hero.css";

const Hero = () => (
  <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="page-width">
      <motion.div className="hero-topline" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="availability"><i /> Available for opportunities</span>
        <span className="mono hero-location">BASED IN LAHORE, PAKISTAN ↗</span>
      </motion.div>
      <motion.div className="hero-grid" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
        <div className="hero-content">
          <p className="eyebrow">Hey, I’m Muhammad Rizwan</p>
          <h1 id="hero-title">Turning ideas<br />into <span className="hero-serif">digital</span><br /><span>experiences.</span><span className="hero-period">✳</span></h1>
          <div className="hero-intro">
            <span className="hero-intro-line" aria-hidden="true" />
            <p>A full-stack & React Native developer with an eye for detail. I build thoughtful web and mobile products, from the first interaction to the last line of code.</p>
          </div>
          <div className="hero-buttons">
            <a className="btn-primary" href="#projects">Explore my work <FiArrowUpRight /></a>
            <a className="text-link" href="/Muhammad_Rizwan_CV.pdf" target="_blank" rel="noreferrer">My résumé <FiDownload /></a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="portrait-frame">
            <img className="hero-portrait" src={profileImage} alt="Muhammad Rizwan, full-stack and React Native developer" width="1254" height="1254" decoding="async" fetchPriority="high" />
            <span className="portrait-grid" aria-hidden="true" />
            <div className="portrait-caption"><span>THE DEVELOPER BEHIND THE CODE</span><FiArrowUpRight /></div>
          </div>
          <div className="hero-code-badge"><FiCode /><span>Design-minded.<br /><strong>Development-driven.</strong></span></div>
          <div className="hero-orbit" aria-hidden="true">✳</div>
          <span className="portrait-coordinate mono">31.5204° N · 74.3587° E</span>
        </div>
      </motion.div>
      <div className="hero-bottom"><a href="#projects"><FiArrowDown /> Scroll to discover</a><p>GOOD DESIGN. CLEAN CODE. REAL SOLUTIONS.</p><span className="mono">PORTFOLIO / 01</span></div>
    </div>
    <div className="capability-ticker" aria-label="Full-stack development, React Native, user interface engineering, and API integration">
      <div className="ticker-track" aria-hidden="true">{[0, 1].map(n => <div className="ticker-group" key={n}><span>FULL-STACK DEVELOPMENT</span><b>✳</b><span>REACT NATIVE</span><b>✳</b><span>UI ENGINEERING</span><b>✳</b><span>API INTEGRATION</span><b>✳</b></div>)}</div>
    </div>
  </section>
);
export default Hero;

