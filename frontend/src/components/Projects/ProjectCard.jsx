import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const isVideo = (url) => /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(url);

const ProjectCard = ({ project, index }) => {
  const [activeMedia, setActiveMedia] = useState(0);
  const [open, setOpen] = useState(false);
  const [mediaOrientations, setMediaOrientations] = useState({});
  const media = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
  const technologies = (Array.isArray(project.tech) ? project.tech : [project.tech])
    .filter(Boolean)
    .flatMap((technology) => String(technology).split(/[,|•\n]+/))
    .map((technology) => technology.trim())
    .filter(Boolean);
  const hasMedia = media.length > 0;
  const closeModal = () => setOpen(false);
  const showProject = () => {
    setActiveMedia(0);
    setOpen(true);
  };
  const selectPrevious = () => setActiveMedia((current) => (current + media.length - 1) % media.length);
  const selectNext = () => setActiveMedia((current) => (current + 1) % media.length);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
      if (media.length > 1 && event.key === "ArrowLeft") setActiveMedia((current) => (current + media.length - 1) % media.length);
      if (media.length > 1 && event.key === "ArrowRight") setActiveMedia((current) => (current + 1) % media.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, media.length]);

  const rememberOrientation = (url) => (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    const orientation = naturalHeight > naturalWidth ? "portrait" : "landscape";
    setMediaOrientations((current) => current[url] === orientation ? current : { ...current, [url]: orientation });
  };

  const renderMedia = (url, className, controls = false) => isVideo(url)
    ? <video className={className} src={url} controls={controls} muted={!controls} playsInline preload="metadata" onLoadedMetadata={rememberOrientation(url)} />
    : <img className={className} src={url} alt={`${project.title} preview`} onLoad={rememberOrientation(url)} />;

  return (
    <>
      <motion.button
        type="button"
        className="project-card"
        onClick={showProject}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        <span className="project-image">
          {hasMedia ? renderMedia(media[0], "project-card-media") : <span className="project-image-placeholder">Project preview</span>}
          <span className="overlay"><strong>{project.title}</strong><small>View project</small></span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div className="project-modal" role="presentation" onMouseDown={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section
              className="project-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-title-${index}`}
              onMouseDown={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <button type="button" className="project-close" onClick={closeModal} aria-label="Close project details">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>

              <div className="project-gallery">
                <div className={`project-stage ${mediaOrientations[media[activeMedia]] === "portrait" ? "is-portrait" : ""}`}>
                  {hasMedia ? renderMedia(media[activeMedia], "project-stage-media", true) : <div className="project-image-placeholder">No project media yet</div>}
                  {media.length > 1 && <><button type="button" className="gallery-control previous" onClick={selectPrevious} aria-label="Show previous media">‹</button><button type="button" className="gallery-control next" onClick={selectNext} aria-label="Show next media">›</button></>}
                  {hasMedia && <span className="media-count">{activeMedia + 1} / {media.length}</span>}
                </div>

                {media.length > 1 && <div className="project-thumbnails" aria-label="Project media gallery">
                  {media.map((url, mediaIndex) => <button type="button" key={`${url}-${mediaIndex}`} className={`project-thumbnail ${activeMedia === mediaIndex ? "is-active" : ""}`} onClick={() => setActiveMedia(mediaIndex)} aria-label={`Show media ${mediaIndex + 1}`} aria-pressed={activeMedia === mediaIndex}>
                    {renderMedia(url, "thumbnail-media")}
                    {isVideo(url) && <span className="video-badge">Video</span>}
                  </button>)}
                </div>}
              </div>

              <div className="project-details">
                <span className="project-eyebrow">Project details</span>
                <h2 id={`project-title-${index}`}>{project.title}</h2>
                {project.description && <p>{project.description}</p>}
                {technologies.length > 0 && <div className="project-technologies"><h3>Built with</h3><div className="project-detail-tech">{technologies.map((technology, technologyIndex) => <span className="project-detail-pill" key={`${technology}-${technologyIndex}`}>{technology}</span>)}</div></div>}
                {(project.live && project.live !== "#") || (project.github && project.github !== "#") ? <div className="project-links">{project.live && project.live !== "#" && <a href={project.live} target="_blank" rel="noreferrer">Visit live site <span aria-hidden="true">↗</span></a>}{project.github && project.github !== "#" && <a className="secondary-link" href={project.github} target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a>}</div> : null}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
