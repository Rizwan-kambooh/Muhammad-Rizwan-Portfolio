import { useEffect, useState } from "react";
import { browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";
import menuIcon from "../assets/menu.svg";
import "./AdminLogin.css";

const ADMIN_EMAIL = "rizwankambooh6@gmail.com";
const blankProject = { title: "", description: "", tech: "", images: "", live: "", github: "", order: "0" };
const blankAbout = { heading: "Building Reliable Digital Experiences", summary: "", highlights: "", overview: "" };
const blankSkills = { categories: "Frontend: React.js, JavaScript, HTML, CSS\nBackend: Node.js, Express.js, REST APIs\nMobile: React Native, Firebase\nTools & Others: Git, GitHub, VS Code" };

function formatDate(timestamp) {
  return timestamp?.toDate ? timestamp.toDate().toLocaleString() : "Just now";
}

function AdminLogin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(() => localStorage.getItem("portfolio-admin-email") || ADMIN_EMAIL);
  const [rememberEmail, setRememberEmail] = useState(() => localStorage.getItem("portfolio-remember-admin") === "true");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser?.email === ADMIN_EMAIL ? currentUser : null);
    if (currentUser && currentUser.email !== ADMIN_EMAIL) {
      signOut(auth);
      setError("This account is not allowed to access the admin dashboard.");
    }
    setLoading(false);
  }), []);

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      await setPersistence(auth, rememberEmail ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (rememberEmail) {
        localStorage.setItem("portfolio-admin-email", email.trim());
        localStorage.setItem("portfolio-remember-admin", "true");
      } else {
        localStorage.removeItem("portfolio-admin-email");
        localStorage.removeItem("portfolio-remember-admin");
      }
      if (credential.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError("This account is not allowed to access the admin dashboard.");
      }
    } catch (loginError) {
      setError("Unable to sign in. Check your Firebase Authentication email and password.");
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error("Use the admin email to reset your password.");
      }
      await sendPasswordResetEmail(auth, email.trim());
      setStatus("Password reset link sent. Check your inbox to continue.");
    } catch (resetError) {
      setError("Unable to send reset email. Please verify your admin email and try again.");
    }
  };

  if (loading) return <main className="admin-shell"><p>Checking secure access…</p></main>;
  if (user) return <AdminDashboard user={user} />;

  return <main className="admin-shell">
    <form className="admin-login-card" onSubmit={forgotMode ? resetPassword : login}>
      <span className="admin-tag">Private area</span>
      <h1>Admin login</h1>
      <p>Sign in with your Firebase Authentication admin account.</p>

      <label>Email<input id="admin-email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>

      <label className="remember-login">
        <input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} />
        <span>Remember email on this device</span>
      </label>

      {!forgotMode ? <label className="password-label">
        Password
        <div className="password-field">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="toggle-password"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
          >
            <img src={showPassword ? eyeOffIcon : eyeIcon} alt="" />
          </button>
        </div>
      </label> : <p className="admin-info">Enter the admin email above and send a reset link.</p>}

      <button
        type="button"
        className="link-button password-help"
        onClick={() => {
          setForgotMode((current) => !current);
          setError("");
          setStatus("");
        }}
      >
        {forgotMode ? "Back to sign in" : "Forgot password?"}
      </button>

      {error && <p className="admin-error">{error}</p>}
      {status && <p className="admin-success">{status}</p>}

      <div className="login-actions">
        <button type="submit" className="primary-button">{forgotMode ? "Send reset link" : "Sign in"}</button>
      </div>

      <a className="back-link" href="/">Back to portfolio</a>
    </form>
  </main>;
}

function AdminDashboard({ user }) {
  const [tab, setTab] = useState("projects");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messagesError, setMessagesError] = useState("");
  const [form, setForm] = useState(blankProject);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [aboutForm, setAboutForm] = useState(blankAbout);
  const [skillsForm, setSkillsForm] = useState(blankSkills);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stopProjects = onSnapshot(query(collection(db, "projects"), orderBy("order", "asc")), (snapshot) => setProjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
    const stopMessages = onSnapshot(collection(db, "contactMessages"), (snapshot) => {
      const newestFirst = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort((first, second) => {
        const firstTime = first.createdAt?.toMillis?.() || 0;
        const secondTime = second.createdAt?.toMillis?.() || 0;
        return secondTime - firstTime;
      });
      setMessages(newestFirst);
      setMessagesError("");
    }, (error) => {
      setMessagesError(error.code === "permission-denied" ? "Firebase denied access to messages. Deploy the updated Firestore rules, then sign out and sign in again." : `Unable to load messages: ${error.message}`);
    });
    const stopAbout = onSnapshot(doc(db, "siteContent", "about"), (snapshot) => {
      if (snapshot.exists()) setAboutForm({ ...blankAbout, ...snapshot.data() });
    });
    const stopSkills = onSnapshot(doc(db, "siteContent", "skills"), (snapshot) => {
      if (snapshot.exists()) setSkillsForm({ ...blankSkills, ...snapshot.data() });
    });
    return () => { stopProjects(); stopMessages(); stopAbout(); stopSkills(); };
  }, []);

  const saveProject = async (event) => {
    event.preventDefault();
    setNotice("");
    setUploadingMedia(true);
    try {
      const uploadedMedia = await Promise.all(mediaFiles.map(async (file) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const fileRef = ref(storage, `projects/${Date.now()}-${safeName}`);
        await uploadBytes(fileRef, file, { contentType: file.type });
        return getDownloadURL(fileRef);
      }));
      const project = {
        title: form.title.trim(), description: form.description.trim(),
        tech: form.tech.split(",").map((item) => item.trim()).filter(Boolean),
        images: [...form.images.split("\n").map((item) => item.trim()).filter(Boolean), ...uploadedMedia],
        live: form.live.trim(), github: form.github.trim(), order: Number(form.order) || 0,
        updatedAt: serverTimestamp(),
      };
      if (editingId) await updateDoc(doc(db, "projects", editingId), project);
      else await addDoc(collection(db, "projects"), { ...project, createdAt: serverTimestamp() });
      setForm(blankProject); setMediaFiles([]); setEditingId(null); setNotice("Project saved successfully.");
    } catch (error) {
      setNotice(error.code === "storage/unauthorized" ? "Storage denied the upload. Deploy the Storage rules, then try again." : `Could not save project: ${error.message}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  const editProject = (project) => {
    setEditingId(project.id);
    setForm({ title: project.title || "", description: project.description || "", tech: (project.tech || []).join(", "), images: (project.images || []).join("\n"), live: project.live || "", github: project.github || "", order: String(project.order || 0) }); setMediaFiles([]);
    setTab("add-project"); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeTab = (nextTab) => { setTab(nextTab); setNotice(""); if (window.innerWidth < 760) setDrawerOpen(false); };
  const saveAbout = async (event) => { event.preventDefault(); await setDoc(doc(db, "siteContent", "about"), { ...aboutForm, updatedAt: serverTimestamp() }, { merge: true }); setNotice("About content saved."); };
  const saveSkills = async (event) => { event.preventDefault(); await setDoc(doc(db, "siteContent", "skills"), { ...skillsForm, updatedAt: serverTimestamp() }, { merge: true }); setNotice("Skills saved."); };

  const navigation = [
    ["projects", "All projects"], ["about", "About me"], ["skills", "Skills"], ["add-project", editingId ? "Edit project" : "Add project"], ["messages", `Messages (${messages.length})`],
  ];

  return <main className="admin-shell admin-workspace-shell">
    <div className={`admin-workspace ${drawerOpen ? "drawer-open" : "drawer-closed"}`}>
      <aside className="dashboard-drawer" aria-label="Admin navigation">
        <div className="drawer-brand"><span className="admin-tag">Portfolio</span><button type="button" className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">×</button></div>
        <nav>{navigation.map(([key, label]) => <button type="button" key={key} className={tab === key ? "active" : ""} onClick={() => changeTab(key)}>{label}</button>)}</nav>
        <div className="drawer-footer"><a href="/">View portfolio ↗</a><button type="button" className="drawer-signout" onClick={() => signOut(auth)}>Sign out</button></div>
      </aside>
      <section className="dashboard-main">
        {!drawerOpen && <button type="button" className="drawer-toggle" onClick={() => setDrawerOpen(true)} aria-label="Open menu"><img src={menuIcon} alt="" /></button>}
        <header className="workspace-header"><div><span className="admin-tag">Signed in securely</span><h1>{navigation.find(([key]) => key === tab)?.[1]}</h1><p>{user.email}</p></div><div className="workspace-count">{tab === "projects" ? `${projects.length} saved` : "Portfolio workspace"}</div></header>
        {notice && <p className="admin-success workspace-notice">{notice}</p>}
        {tab === "projects" && <section className="admin-list projects-list"><div className="section-heading"><div><span className="admin-tag">Collection</span><h2>All projects</h2></div><button type="button" onClick={() => changeTab("add-project")}>Add project</button></div>{projects.length ? projects.map((project) => <article key={project.id} className="admin-project"><div><h3>{project.title}</h3><p>{project.description}</p><span className="project-tech">{(project.tech || []).join(" · ")}</span></div><div className="project-actions"><button type="button" className="admin-secondary" onClick={() => editProject(project)}>Edit</button><button type="button" className="admin-danger" onClick={() => deleteDoc(doc(db, "projects", project.id))}>Delete</button></div></article>) : <div className="empty-state"><h3>No saved projects</h3><p>Your portfolio’s existing local projects stay visible until you add the first Firebase project.</p><button type="button" onClick={() => changeTab("add-project")}>Add your first project</button></div>}</section>}
        {tab === "add-project" && <form className="project-form editor-panel" onSubmit={saveProject}><div className="section-heading"><div><span className="admin-tag">Project editor</span><h2>{editingId ? "Edit project" : "Add a project"}</h2></div></div><label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label><label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label><label>Technologies <small>Comma separated</small><input value={form.tech} onChange={(event) => setForm({ ...form, tech: event.target.value })} placeholder="React, Firebase" /></label><label>Upload photos or videos<input className="media-input" type="file" accept="image/*,video/*" multiple onChange={(event) => setMediaFiles(Array.from(event.target.files || []))} /><small>{mediaFiles.length ? `${mediaFiles.length} file${mediaFiles.length > 1 ? "s" : ""} ready to upload: ${mediaFiles.map((file) => file.name).join(", ")}` : "Select one or more image or video files from your device."}</small></label><label>Media URLs <small>Optional — one URL per line</small><textarea value={form.images} onChange={(event) => setForm({ ...form, images: event.target.value })} placeholder="https://example.com/project-image.jpg" /></label><div className="form-row"><label>Live URL<input type="url" value={form.live} onChange={(event) => setForm({ ...form, live: event.target.value })} /></label><label>GitHub URL<input type="url" value={form.github} onChange={(event) => setForm({ ...form, github: event.target.value })} /></label></div><label>Display order<input type="number" min="0" value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} /></label><div className="form-actions"><button type="submit" disabled={uploadingMedia}>{uploadingMedia ? "Uploading media…" : editingId ? "Update project" : "Save project"}</button>{editingId && <button type="button" className="admin-secondary" onClick={() => { setEditingId(null); setForm(blankProject); setMediaFiles([]); changeTab("projects"); }}>Cancel</button>}</div></form>}
        {tab === "about" && <form className="project-form editor-panel" onSubmit={saveAbout}><div className="section-heading"><div><span className="admin-tag">Site content</span><h2>About me</h2></div></div><label>Headline<input value={aboutForm.heading} onChange={(event) => setAboutForm({ ...aboutForm, heading: event.target.value })} required /></label><label>Introduction<textarea value={aboutForm.summary} onChange={(event) => setAboutForm({ ...aboutForm, summary: event.target.value })} placeholder="Write a concise introduction about yourself." required /></label><label>Highlights <small>One item per line</small><textarea value={aboutForm.highlights} onChange={(event) => setAboutForm({ ...aboutForm, highlights: event.target.value })} placeholder="Frontend development\nReact Native applications" /></label><label>Quick overview <small>One detail per line, e.g. Education: BS Computer Science</small><textarea value={aboutForm.overview} onChange={(event) => setAboutForm({ ...aboutForm, overview: event.target.value })} /></label><div className="form-actions"><button type="submit">Save about content</button></div></form>}
        {tab === "skills" && <form className="project-form editor-panel" onSubmit={saveSkills}><div className="section-heading"><div><span className="admin-tag">Site content</span><h2>Skills</h2></div></div><label>Skill categories <small>One per line: Category: Skill one, Skill two</small><textarea className="skills-editor" value={skillsForm.categories} onChange={(event) => setSkillsForm({ ...skillsForm, categories: event.target.value })} required /></label><div className="form-actions"><button type="submit">Save skills</button></div></form>}
        {tab === "messages" && <section className="messages-panel"><div className="section-heading"><div><span className="admin-tag">Inbox</span><h2>Contact messages</h2></div></div>{messagesError ? <div className="admin-error inbox-error">{messagesError}</div> : messages.length ? messages.map((message) => <article key={message.id} className="message-card"><header><strong>{message.name}</strong><span>{formatDate(message.createdAt)}</span></header><a href={`mailto:${message.email}`}>{message.email}</a><p>{message.phone}</p><p>{message.message}</p></article>) : <div className="empty-state"><h3>Your inbox is clear</h3><p>New contact form submissions will appear here.</p></div>}</section>}
      </section>
    </div>
  </main>;
}

export default AdminLogin;
