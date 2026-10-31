
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

import { ThemeContext } from "../../helpers/ThemeContext";
import { SidebarConfig } from "../../helpers/SidebarConfig";

import "../../assets/styles/header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const currentDate = new Date();

  const currentRole = location.pathname.split("/")[1];

  const activeRole =
    SidebarConfig.find(
      (role) => role.path.split("/").filter(Boolean)[0] === currentRole
    ) || SidebarConfig[0];

  // Navigate to the selected role's base path
  const handleRoleNavigation = (role) => {
    navigate(role.path);
  };

  return (
    <header className="topbar">
      {/* Brand and location */}
      <div
        className="brand"
        onClick={() => navigate(activeRole.path)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(activeRole.path);
          }
        }}
      >
        <div className="brand-logo-wrap">
          <div className="brand-name">
            BIZ<span>OOP</span>
          </div>
        </div>

        <div className="top-sep" />

        <div className="ind-pill">🍽 Restaurant POS</div>

        <div className="loc-pill">
          <span className="live-dot" />
          Spice Route · Anna Nagar
        </div>

        <span className="top-date">
          {currentDate.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
          {" · "}
          {currentDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>

      {/* Role navigation */}
      <nav className="vsw" aria-label="Role navigation">
        {SidebarConfig.map((role) => {
          const RoleIcon = role.icon;
          const isActive = activeRole.path === role.path;

          return (
            <button
              key={role.keyNumber}
              type="button"
              className={`vsw-btn ${isActive ? "active" : ""}`}
              onClick={() => handleRoleNavigation(role)}
              aria-current={isActive ? "page" : undefined}
            >
              {RoleIcon && <RoleIcon size={15} />}

              <span>{role.name}</span>

              <small>{role.keyNumber}</small>
            </button>
          );
        })}
      </nav>

      {/* Theme and user profile */}
      <div className="topbar-right">
        <button id="ac-btn" className="action-btn" data-i="1">
          🔴 ACTION CENTRE
          <span className="tag t-err">8</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          className="user-chip"
          onClick={() => navigate(`${activeRole.path}/profile`)}
          title="Open profile"
        >
          <div className="user-av">RK</div>

          <div className="user-info">
            <div className="uname">Ravi K.</div>
            <div className="urole">{activeRole.name}</div>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;