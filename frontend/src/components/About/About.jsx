import "./About.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
const About = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    return onSnapshot(doc(db, "siteContent", "about"), (snapshot) => {
      if (snapshot.exists()) setContent(snapshot.data());
    });
  }, []);

  const highlights = content?.highlights?.split("\n").map((item) => item.trim()).filter(Boolean);
  const overview = content?.overview?.split("\n").map((item) => item.trim()).filter(Boolean);

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
            {content?.heading || <>Building <span>Reliable Digital Experiences</span> with Purpose & Precision</>}
          </h2>

          {content?.summary ? <p>{content.summary}</p> : <><p>
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
          </p></>}

          <div className="about-highlights">
            {(highlights?.length ? highlights : ["Frontend & Full-Stack Development", "React Native Mobile Applications", "API Integration & Database-Driven Solutions", "Performance-Focused, User-Centered Design"]).map((item) => <div key={item}>{item}</div>)}
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
            {(overview?.length ? overview : ["Education: BS Computer Science", "University: University of South Asia, Lahore", "Experience: React Native Intern at Premlinx", "Core Skills: React, Node.js, Firebase, SQL", "Availability: Open to freelance & full-time roles"]).map((item) => {
              const [label, ...value] = item.split(":");
              return <p key={item}><b>{label}:</b>{value.join(":")}</p>;
            })}
          </div>
        </motion.div>

      </div>

    </section>
  );
};

export default About;
