// import { motion } from "framer-motion";
// import "./Contact.css";
// import { useState } from "react";

// const Contact = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // For now just log (you can connect backend later)
//     console.log(form);

//     alert("Message sent successfully 🚀");

//     setForm({ name: "", email: "", message: "" });
//   };

//   return (
//     <section className="contact-section" id="contact">

//       <motion.div
//         className="contact-container"
//         initial={{ opacity: 0, y: 60 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >

//         {/* LEFT SIDE INFO */}
//         <div className="contact-info">
//           <h2>Let’s Work Together</h2>
//           <p>
//             Have a project in mind or want to collaborate?  
//             Feel free to reach out — I usually respond within 24 hours.
//           </p>

//           <div className="contact-details">
//             <p><span>Email:</span> rizwankambooh6@gmail.com</p>
//             <p><span>WhatsApp:</span> +92 300 1234567</p>
//             <p><span>Location:</span> Lahore, Pakistan</p>
//           </div>
//         </div>

//         {/* RIGHT SIDE FORM */}
//         <form className="contact-form" onSubmit={handleSubmit}>

//           <h3>Send Message</h3>

//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />

//           <textarea
//             name="message"
//             placeholder="Your Message..."
//             rows="5"
//             value={form.message}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit">Send Message</button>

//         </form>

//       </motion.div>

//     </section>
//   );
// };

// export default Contact;







import { motion } from "framer-motion";
import "./Contact.css";
import { useState } from "react";
import {
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);
    alert("Message sent successfully 🚀");

    setForm({ name: "", email: "", message: "" });
  };

  // EMAIL + WHATSAPP LINKS
  const email = "rizwankambooh6@gmail.com";
  const whatsappNumber = "923477976702"; // without + sign
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

        {/* LEFT SIDE */}
        <div className="contact-info">
          <h2>Let’s Work Together</h2>

          <p>
            I’m always open to thoughtful collaborations, freelance opportunities,
            and full-time roles where I can contribute to impactful digital products.
          </p>

          {/* CONTACT DETAILS */}
          <div className="contact-details">

            {/* EMAIL */}
            <a href={`mailto:${email}`} className="contact-item">
              <FaEnvelope className="icon" />
              <span>{email}</span>
            </a>

            {/* WHATSAPP */}
            <div className="contact-item" onClick={openWhatsApp}>
              <FaWhatsapp className="icon" />
              <span>Chat on WhatsApp</span>
            </div>

            {/* LOCATION */}
            <div className="contact-item">
              <FaMapMarkerAlt className="icon" />
              <span>Lahore, Pakistan</span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE FORM */}
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

          <textarea
            name="message"
            placeholder="Your Message..."
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          {/* THEME BUTTON */}
          <button type="submit" className="btn-primary">
            Send Message
          </button>

        </form>

      </motion.div>

    </section>
  );
};

export default Contact;