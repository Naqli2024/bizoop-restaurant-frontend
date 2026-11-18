import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";

import { ThemeContext } from "../../helpers/ThemeContext";
import { SidebarConfig } from "../../helpers/SidebarConfig";
import { getLoggedInUser } from "../../redux/Auth/AuthSlice";

import "../../assets/styles/header.css";

// Constants live outside the component so they aren't recreated on every render
const ROUTES = {
  ADMIN: "/admin/command",
  CASHIER: "/cashier/sales-iq",
  CAPTAIN: "/captain/floor",
  KITCHEN: "/kot-display/display",
  BACKOFFICE: "/back-office/overview",
};

const ROLE_CODES = {
  admin: "ADMIN",
  cashier: "CASHIER",
  captain: "CAPTAIN",
  "kot-display": "KITCHEN",
  "back-office": "BACKOFFICE",
};

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, restaurant } = useSelector((state) => state.authAdmin);
 

  // Live clock (the old code showed seconds but never updated)
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    dispatch(getLoggedInUser());
   }, [dispatch]);

  const loggedInRole = user?.role?.code?.toUpperCase();
  const currentRole = location.pathname.split("/")[1];

  const handleRoleNavigation = () => {
    const targetRoute = ROUTES[loggedInRole];
    if (targetRoute) navigate(targetRoute);
  };

  return (
    <header className="topbar">
      {/* Brand and location */}
      <div
        className="brand"
        onClick={handleRoleNavigation}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRoleNavigation();
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
          {restaurant?.restaurantName || "—"}
        </div>

        <span className="top-date">
          {now.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
          {" · "}
          {now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
     
      {/* Role navigation */}
      <nav className="vsw" aria-label="Role navigation">
        {SidebarConfig
          .filter((role) => {
            const rolePath = role.path.split("/").filter(Boolean)[0];
            const roleCode = ROLE_CODES[rolePath];

            return roleCode === loggedInRole;
          })
          .map((role) => {
            const RoleIcon = role.icon;
            const rolePath = role.path.split("/").filter(Boolean)[0];
            const roleCode = ROLE_CODES[rolePath];

            const isActive = currentRole === rolePath;

            return (
              <button
                key={role.id}
                type="button"
                className={`vsw-btn ${isActive ? "active" : ""}`}
                onClick={() => navigate(ROUTES[roleCode])}
                aria-current={isActive ? "page" : undefined}
              >
                {RoleIcon && <RoleIcon size={15} />}
                <span>{role.name}</span>
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
          onClick={handleRoleNavigation}
          title="Open role home"
        >
          <div className="user-av">
            {user?.username?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="user-info">
            <div className="uname">{user?.role?.code}</div>
            <div className="urole">{user?.role?.name}</div>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;