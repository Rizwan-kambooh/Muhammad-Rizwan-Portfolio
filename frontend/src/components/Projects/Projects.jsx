import "./Projects.css";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

// IMPORT IMAGES
import p11 from "../../assets/projects/project11.jpeg";
import p12 from "../../assets/projects/project12.jpeg";
import p13 from "../../assets/projects/project13.jpeg";

import p21 from "../../assets/projects/project21.jpeg";
import p22 from "../../assets/projects/project22.jpeg";
import p23 from "../../assets/projects/project23.jpeg";

const projectsData = [
  {
    title: "Oram360 App",
    images: [p11, p12, p13],
    description: "A mobile application focused on modern UI, smooth usability, and practical functionality for everyday users.",
    tech: ["React Native", "API", "Redux"],
    live: "#",
    github: "#",
  },
  {
    title: "Nyano App",
    images: [p21, p22, p23],
    description: "A scalable mobile product designed around authentication, dynamic features, and a clean user experience.",
    tech: ["React Native", "Firebase"],
    live: "#",
    github: "#",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="projects">

      <div className="projects-container">

        {/* HEADER */}
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="section-tag">Selected Work</span>
          <h2>Projects That Reflect Practical Development</h2>
          <p>I focus on building polished products that combine strong design, useful features, and reliable performance.</p>
        </motion.div>

        {/* GRID */}
        <div className="projects-grid">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

      </div>

    </section>
  );
};

export default Projects;