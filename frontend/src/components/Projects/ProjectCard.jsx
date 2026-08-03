import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProjectCard = ({ project, index }) => {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const images = project.images?.filter(Boolean) || [];
  const hasImages = images.length > 0;
  const isVideo = (url) => /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(url);
  const renderMedia = (url, className) => isVideo(url)
    ? <video className={className} src={url} controls playsInline />
    : <img className={className} src={url} alt={project.title} />;

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // ✅ ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* CARD */}
      <motion.div
        className="project-card"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        <div className="project-image">
          {hasImages ? renderMedia(images[0]) : <div className="project-image-placeholder">Project preview</div>}

          <div className="overlay">
            <h3>{project.title}</h3>
            <p>Click to view details</p>
          </div>
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="modal"
            onClick={() => setOpen(false)}   // ✅ click outside close
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()} // ❌ prevent close when clicking inside
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >

              {/* CLOSE BUTTON */}
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
              >
                ×
              </button>

              {/* IMAGE */}
              <div className="modal-image">
                {hasImages ? renderMedia(images[current]) : <div className="project-image-placeholder">Project preview</div>}

                {images.length > 1 && <>
                  <button className="slider-btn left" onClick={prevSlide}>‹</button>
                  <button className="slider-btn right" onClick={nextSlide}>›</button>
                </>}
              </div>

              {/* INFO */}
              <div className="modal-info">
                <h2>{project.title}</h2>
                <p>{project.description}</p>

                <div className="project-tech">
                  {project.tech.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>

                <div className="project-links">
                  {project.live && project.live !== "#" && <a href={project.live} target="_blank" rel="noreferrer">Live</a>}
                  {project.github && project.github !== "#" && <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
