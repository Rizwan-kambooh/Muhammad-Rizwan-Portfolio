import { lazy, Suspense } from "react";
import Home from "./pages/Home";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));

function App() {
  if (window.location.pathname === "/admin-login") {
    return <Suspense fallback={<main className="route-loading" role="status">Loading secure sign-in…</main>}><AdminLogin /></Suspense>;
  }

  return <Home />;
}

export default App;
