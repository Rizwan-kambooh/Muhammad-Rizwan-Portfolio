import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

const STORAGE_KEY = "portfolio-theme";

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", savedTheme);
      return savedTheme;
    }
  } catch {
    // localStorage unavailable — fall through to the light default.
  }
  document.documentElement.setAttribute("data-theme", "light");
  return "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors (e.g. private mode) — theme still applies.
    }
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "dark" ? "#0f0f0f" : "#f6faf9");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
