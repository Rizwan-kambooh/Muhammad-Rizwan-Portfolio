import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Skills from "../components/Skills/Skills";
import Projects from "../components/Projects/Projects";
import Contact from "../components/Contact/Contact";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";

const Home = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <motion.div className="reading-progress" style={{ scaleX: progress }} />
      <Navbar />
      <main id="main-content">
        <Hero /><Projects /><About /><Skills /><Contact />
      </main>
      <footer className="site-footer page-width">
        <a className="footer-brand" href="#home">Rizwan<span>®</span></a>
        <p>Thoughtfully built. Always evolving.</p>
        <a href="#home">Back to top <span aria-hidden="true">↑</span></a>
        <small>© {new Date().getFullYear()} Muhammad Rizwan</small>
      </footer>
    </MotionConfig>
  );
};
export default Home;
