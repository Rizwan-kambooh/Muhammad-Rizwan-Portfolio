import "./About.css";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCheck, FiTerminal } from "react-icons/fi";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

const About = () => {
  const [content, setContent] = useState(null);
  useEffect(() => onSnapshot(doc(db, "siteContent", "about"), snapshot => {
    if (snapshot.exists()) setContent(snapshot.data());
  }, () => setContent(null)), []);
  const highlights = content?.highlights?.split("\n").map(item => item.trim()).filter(Boolean);
  const overview = content?.overview?.split("\n").map(item => item.trim()).filter(Boolean);
  return (
    <section id="about" className="about">
      <div className="page-width">
        <motion.div className="about-container" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }}>
          <div className="about-heading">
            <span className="section-tag">02 / A little about me</span>
            <h2 className="section-title">{content?.heading || <>A curious mind.<br />A builder <em>at heart.</em></>}</h2>
            <div className="about-signature">Rizwan<span>✳</span></div>
            <p className="about-location mono">DEVELOPING FROM LAHORE.<br />BUILDING FOR EVERYWHERE.</p>
          </div>
          <div className="about-copy">
            {content?.summary ? <p className="about-lead">{content.summary}</p> : <>
              <p className="about-lead">I enjoy the space where <span>thoughtful design</span> meets practical engineering.</p>
              <p>I’m Muhammad Rizwan, a Computer Science graduate building web and mobile applications with the MERN stack and React Native. I care about how a product feels just as much as how it works.</p>
              <p>From clean interfaces and API integrations to database-driven applications, I like taking an idea all the way to a usable product. Every project is another opportunity to ask better questions and build something better.</p>
            </>}
            <div className="about-highlights">{(highlights?.length ? highlights : ["Frontend & full-stack development", "React Native mobile applications", "API integration & database solutions", "Performance-focused, user-centered design"]).map(item => <div key={item}><FiCheck /><span>{item}</span></div>)}</div>
            <a className="text-link" href="/Muhammad_Rizwan_CV.pdf" target="_blank" rel="noreferrer">Get the full story — my résumé <FiArrowUpRight /></a>
          </div>
        </motion.div>
        <div className="experience-grid">
          <div className="experience-label"><FiTerminal /><span className="eyebrow">The journey so far</span><h3>Learning.<br />Building.<br /><em>Growing.</em></h3></div>
          {overview?.length ? <div className="custom-overview">{overview.map(item => { const [label, ...value] = item.split(":"); return <div key={item}><span className="eyebrow">{label}</span><p>{value.length ? value.join(":") : item}</p></div>; })}</div> :
          <div className="experience-list">
            <div className="experience-row"><span className="experience-dot" /><div><span className="eyebrow">Professional experience</span><h4>Associate Software Engineer</h4><p>Zentix Stack · Canal View, Lahore</p></div><span className="experience-status">Current role</span></div>
            <div className="experience-row"><span className="experience-dot" /><div><span className="eyebrow">4-month internship</span><h4>React Native Developer</h4><p>Premlinx · Mobile application development</p></div><FiArrowUpRight /></div>
            <div className="experience-row"><span className="experience-dot" /><div><span className="eyebrow">Education</span><h4>BS Computer Science</h4><p>University of South Asia, Lahore</p></div><FiArrowUpRight /></div>
          </div>}
        </div>
      </div>
    </section>
  );
};
export default About;
