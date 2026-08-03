import { motion } from "framer-motion";
import "./Contact.css";
import { useState } from "react";
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { API_BASE_URL } from "../../config/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForm({ name: "", email: "", phone: "", message: "" });
        setStatus({ type: "success", message: data.message });
      } else {
        setStatus({ type: "error", message: data.message || "Unable to send your message." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Unable to send your message right now." });
    }
  };

  const email = "rizwankambooh6@gmail.com";
  const whatsappNumber = "923477976702";
  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  return (
    <section className="contact-section" id="contact">
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="contact-info">
          <h2>Let’s Work Together</h2>

          <p>
            I’m always open to thoughtful collaborations, freelance opportunities,
            and full-time roles where I can contribute to impactful digital products.
          </p>

          <div className="contact-details">
            <a href={`mailto:${email}`} className="contact-item">
              <FaEnvelope className="icon" />
              <span>{email}</span>
            </a>

            <div className="contact-item" onClick={openWhatsApp}>
              <FaWhatsapp className="icon" />
              <span>Chat on WhatsApp</span>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt className="icon" />
              <span>Lahore, Pakistan</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send Message</h3>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          {status.message ? <p className={`contact-status ${status.type}`}>{status.message}</p> : null}

          <button type="submit" className="btn-primary" disabled={status.type === "loading"}>
            {status.type === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
