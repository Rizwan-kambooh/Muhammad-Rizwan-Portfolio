import "./Skills.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

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

      <div className="skills-container">

        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Skills</span>
          <h2>My Technical Expertise</h2>
          <p>
            A combination of modern technologies and tools I use to build
            scalable and high-performance applications.
          </p>
        </motion.div>

        <div className="skills-grid">

          {categories.map((category, index) => (
            <motion.div
              className="skill-card"
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3>{category.title}</h3>

              <div className="skill-list">
                {category.skills.map((skill, i) => (
                  <span key={i} className="skill-item">
                    {skill}
                  </span>
                ))}
              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Skills;
