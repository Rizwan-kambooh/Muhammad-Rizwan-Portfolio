import "./Skills.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { FiCode, FiDatabase, FiSmartphone, FiTool } from "react-icons/fi";

const icons = [FiCode, FiDatabase, FiSmartphone, FiTool];
const descriptions = ["Interfaces that feel intuitive, responsive, and considered.", "The logic, APIs, and data behind a reliable product.", "Thoughtful mobile experiences for iOS and Android.", "A practical toolkit for building and collaborating."];

const skillsData = [
  {
    title: "Frontend",
    skills: ["React.js", "JavaScript", "HTML", "CSS", "Material UI"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "MySQL"],
  },
  {
    title: "Mobile",
    skills: ["React Native", "CLI", "Firebase", "Supabase"],
  },
  {
    title: "Tools & Others",
    skills: ["Git", "GitHub", "VS Code", "Android Studio", "Xcode", "Postman"],
  },
];

const Skills = () => {
  const [categories, setCategories] = useState(skillsData);

  useEffect(() => {
    return onSnapshot(doc(db, "siteContent", "skills"), (snapshot) => {
    const savedCategories = snapshot.data()?.categories;
    if (!savedCategories) return;

    const parsed = savedCategories.split("\n").map((line) => {
      const [title, ...skills] = line.split(":");
      return { title: title?.trim(), skills: skills.join(":").split(",").map((skill) => skill.trim()).filter(Boolean) };
    }).filter((category) => category.title && category.skills.length);

      if (parsed.length) setCategories(parsed);
    }, () => setCategories(skillsData));
  }, []);

  return (
    <section id="skills" className="skills">

      <div className="skills-container page-width">

        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div><span className="section-tag">03 / The toolkit</span><h2 className="section-title">Built with the<br /><em>right ingredients.</em></h2></div>
          <p>Good products take more than a single framework. Here’s what I bring to the table, from the interface to the infrastructure.</p>
        </motion.div>

        <div className="skills-grid">

          {categories.map((category, index) => {
            const Icon = icons[index % icons.length];
            return (
            <motion.div
              className="skill-card"
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * .1, .3) }}
              viewport={{ once: true, amount: .2 }}
            >
              <div className="skill-card-top"><span className="skill-icon"><Icon /></span><span className="mono">0{index + 1}</span></div>
              <h3>{category.title}</h3>
              <p>{descriptions[index % descriptions.length]}</p>

              <div className="skill-list">
                {category.skills.map((skill, i) => (
                  <span key={i} className="skill-item">
                    {skill}
                  </span>
                ))}
              </div>

            </motion.div>
          );})}

        </div>
        <div className="skills-note"><p>Always learning. Always refining.<br />The stack evolves. The attention to detail stays.</p><span aria-hidden="true">✳</span></div>

      </div>

    </section>
  );
};

export default Skills;
