import { Hamburger, HamburgerIcon, Menu, Moon, Sun } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../helpers/ThemeContext';
import "../../assets/styles/landing/siteheader.css"
import { useNavigate } from 'react-router-dom';

const SiteHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState("");

    const closeMenu = () => setMenuOpen(false);
     const navigate = useNavigate();

    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogin = () => {
        closeMenu();
        navigate("/login");
    };



    useEffect(() => {
        const ids = ["features", "roles", "modules"];
        const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
        if (!els.length || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
            },
            { rootMargin: "-40% 0px -50% 0px" }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <header className='site-topbar'>
            <a className="site-logo" href="#home">
                <span className="site-logo__icon">🍽</span>
                <span className="site-logo__text">
                    BIZOOP<span className="site-logo__dot">.</span>
                </span>
            </a>

            <button
                className="site-burger"
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
            >
                <Menu size={18} />
            </button>

            <nav
                className={`site-menu ${menuOpen ? "site-menu--open" : ""}`}
                id="mainNav"
            >
                <a className={`site-menu__link ${active === "features" ? "site-menu__link--active" : ""}`} href="#features" onClick={closeMenu}>
                    Features
                </a>
                <a className={`site-menu__link ${active === "roles" ? "site-menu__link--active" : ""}`} href="#roles" onClick={closeMenu}>
                    Restaurant roles
                </a>
                <a className={`site-menu__link ${active === "modules" ? "site-menu__link--active" : ""}`} href="#modules" onClick={closeMenu}>
                    BOS modules
                </a>

                <button
                    className="site-themebtn"
                    id="themeToggle"
                    type="button"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    title="Toggle theme"
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button className="site-loginbtn" type="button" onClick={handleLogin}>
                    Login
                </button>
            </nav>
        </header>
    )
}

export default SiteHeader
