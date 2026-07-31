import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="hero-title">
          Muhammad <span>Rizwan</span>
        </h1>

        <p className="hero-subtitle">
          Full-Stack Developer • React Native • UI-Focused Problem Solver
        </p>

        <h2 className="hero-typing">
          <Typewriter
            words={[
              "MERN Stack Developer",
              "React Native Developer",
              "Frontend & Full-Stack Builder",
            ]}
            loop={true}
            cursor
          />
        </h2>

        <p className="hero-desc">
          I build polished web and mobile experiences that are modern, scalable,
          and designed with real users in mind.
        </p>

        <p className="hero-availability">
          Open to freelance projects and full-time opportunities.
        </p>

        <div className="hero-buttons">
          <a className="btn-primary" href="#projects">
            View Projects
          </a>
          <a className="btn-outline" href="/Muhammad_Rizwan_CV.pdf" target="_blank" rel="noreferrer">
            View Resume
          </a>
          <a className="btn-outline" href="#contact">
            Contact Me
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

