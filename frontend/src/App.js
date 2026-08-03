import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

function App() {
  if (window.location.pathname === "/admin-login") {
    return <AdminLogin />;
  }

  return <Home />;
}

export default App;
