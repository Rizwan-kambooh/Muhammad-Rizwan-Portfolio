import "./About.css";
import { motion } from "framer-motion";
const About = () => {
  return (
    <section id="about" className="about">

      <div className="about-container">

        {/* LEFT SIDE */}
        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="section-tag">About Me</span>

          <h2>
            Building <span>Reliable Digital Experiences</span> with Purpose & Precision
          </h2>

          <p>
            I am <span>Muhammad Rizwan</span>, a Computer Science graduate focused on
            creating modern web and mobile applications using the <b>MERN stack</b> and
            <b> React Native</b>.
          </p>

          <p>
            My experience includes hands-on development work during my <b>React Native internship at Premlinx</b>,
            where I strengthened my ability to build practical solutions and contribute effectively in a professional environment.
          </p>

          <p>
            I enjoy turning ideas into polished products through clean UI systems, API integration,
            and scalable full-stack development with technologies like <b>React, Node.js, Firebase, and SQL</b>.
          </p>

          <div className="about-highlights">
            <div>Frontend & Full-Stack Development</div>
            <div>React Native Mobile Applications</div>
            <div>API Integration & Database-Driven Solutions</div>
            <div>Performance-Focused, User-Centered Design</div>
          </div>

          {/* STATS */}
          <div className="about-stats">
            <div>
              <h3>3+</h3>
              <p>Projects Built</p>
            </div>
            <div>
              <h3>3 Months</h3>
              <p>Professional Experience</p>
            </div>
            <div>
              <h3>MERN</h3>
              <p>Core Stack</p>
            </div>
          </div>

        </motion.div>

        {/* RIGHT SIDE CARD */}
        <motion.div
          className="about-right"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="about-card">
            <h3>Quick Overview</h3>
            <p><b>Education:</b> BS Computer Science</p>
            <p><b>University:</b> University of South Asia, Lahore</p>
            <p><b>Experience:</b> React Native Intern at Premlinx</p>
            <p><b>Core Skills:</b> React, Node.js, Firebase, SQL</p>
            <p><b>Availability:</b> Open to freelance & full-time roles</p>
          </div>
        </motion.div>

      </div>

    </section>
  );
};

export default About;