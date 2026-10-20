import { motion } from "framer-motion";
import "./Contact.css";
import { useState } from "react";
import { FiArrowUpRight, FiArrowRight, FiCopy, FiCheck, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

const email = "rizwankambooh6@gmail.com";
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const handleChange = e => setForm(current => ({ ...current, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    if (status.type === "loading") return;
    if (!form.name.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Please add your name and a message." });
      return;
    }
    setStatus({ type: "loading", message: "Sending your message..." });
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(),
        message: form.message.trim(), createdAt: serverTimestamp(),
      });
      setForm({ name: "", email: "", phone: "", message: "" });
      setStatus({ type: "success", message: "Thanks for reaching out. Your message has been sent!" });
    } catch {
      setStatus({ type: "error", message: "Your message couldn’t be sent. Please try again, or email me directly." });
    }
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
    } catch { setCopyError(true); }
  };
  return (
    <section className="contact-section" id="contact">
      <div className="page-width">
        <motion.div className="contact-heading" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-tag">04 / Your next idea starts here</span>
          <h2>Let’s make<br />something <em>matter.</em><span aria-hidden="true">↗</span></h2>
        </motion.div>
        <div className="contact-container">
          <div className="contact-info">
            <span className="availability"><i /> Open for freelance & full-time roles</span>
            <p>Have a project in mind, a role to share, or just a good question? I’d love to hear from you.</p>
            <div className="contact-email-label eyebrow">Drop a line</div>
            <div className="contact-email-row"><a href={"mailto:" + email}>{email}</a><button type="button" onClick={copyEmail} aria-label={copied ? "Email address copied" : "Copy email address"}>{copied ? <FiCheck /> : <FiCopy />}</button></div>
            <span className="copy-feedback" role="status">{copied ? "Email copied. Let’s connect!" : copyError ? "Please select the email address to copy it." : ""}</span>
            <div className="contact-details">
              <a href="https://wa.me/923477976702" target="_blank" rel="noreferrer"><FaWhatsapp /><span>Prefer a quick conversation?<strong>Let’s chat on WhatsApp</strong></span><FiArrowUpRight /></a>
              <div><FiMapPin /><span>Based in<strong>Lahore, Pakistan</strong></span><span className="contact-globe" aria-hidden="true">◎</span></div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} aria-label="Send a message">
            <div className="form-heading"><h3>Tell me what you’re thinking.</h3><span className="mono">LET’S CONNECT / ↗</span></div>
            <div className="form-row">
              <label htmlFor="contact-name">Your name <span>*</span><input id="contact-name" type="text" name="name" placeholder="What should I call you?" autoComplete="name" value={form.name} onChange={handleChange} required maxLength={120} /></label>
              <label htmlFor="contact-email">Email address <span>*</span><input id="contact-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={handleChange} required maxLength={254} /></label>
            </div>
            <label htmlFor="contact-phone">Phone <span className="optional">(optional)</span><input id="contact-phone" type="tel" name="phone" placeholder="+92 ..." autoComplete="tel" value={form.phone} onChange={handleChange} maxLength={40} /></label>
            <label htmlFor="contact-message">A little about your idea <span>*</span><textarea id="contact-message" name="message" placeholder="The idea, the challenge, or just a hello..." rows="3" value={form.message} onChange={handleChange} required maxLength={5000} /></label>
            {status.message && <p role={status.type === "error" ? "alert" : "status"} className={"contact-status " + status.type}>{status.message}{status.type === "error" && <a href={"mailto:" + email}>Email me <FiArrowUpRight /></a>}</p>}
            <button type="submit" className="btn-primary" disabled={status.type === "loading"}>{status.type === "loading" ? "Sending..." : "Send message"}<FiArrowRight /></button>
            <p className="form-note">Your next project could start with a simple hello.</p>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Contact;
