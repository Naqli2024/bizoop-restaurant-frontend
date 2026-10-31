import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [brandTheme, setBrandTheme] = useState("restaurant");

  useEffect(() => {
    const savedTheme = Cookies.get("themeMode");
    const savedBrand = Cookies.get("brandTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedBrand) {
      setBrandTheme(savedBrand)
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    Cookies.set("themeMode", theme, { expires: 365 });
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-industry", brandTheme);
    Cookies.set("brandTheme", brandTheme, { expires: 365 });
  }, [brandTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, brandTheme, setBrandTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
