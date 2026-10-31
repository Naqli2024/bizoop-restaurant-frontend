
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

import { CashierSidebarData } from "../../helpers/CashierSidebarData";
import { CaptainSidebarData } from "../../helpers/CaptainSidebarData";
import { KotSidebarData } from "../../helpers/KotSidebarData";
import { BackOfficeSidebarData } from "../../helpers/BackOfficeSidebarData";

import "../../assets/styles/sidebar.css";
import { AdminSidebarData } from "../../helpers/AdminSidebarData";

const RestaurantMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const currentRole = location.pathname.split("/")[1] || "cashier";
  const basePath = `/${currentRole}`;
  const sidebarConfig = {
    cashier: CashierSidebarData,
    captain: CaptainSidebarData,
    "kot-display": KotSidebarData,
    "admin":AdminSidebarData,
    "back-office": BackOfficeSidebarData,
  };

  const allSidebarGroups = Array.isArray(sidebarConfig[currentRole])
    ? sidebarConfig[currentRole]
    : [];

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path) => {
    const cleanPath = String(path || "").replace(/^\/+/, "");

    if (cleanPath) {
      navigate(`${basePath}/${cleanPath}`);
      setIsMobileOpen(false);
    }
  };

  return (
    <div
      className={`body-wrap ${
        isMobileOpen ? "mobile-sidebar-open" : ""
      }`}
    >
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setIsMobileOpen((previous) => !previous)}
        aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      {isMobileOpen && (
        <button
          type="button"
          className="sidebar-mobile-backdrop"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        id="sb"
        className={`sidebar-main ${
          isCollapsed ? "collapsed" : ""
        } ${isMobileOpen ? "mobile-open" : ""}`}
      >
        <nav className="sidebar-nav" aria-label="Role navigation">
          {allSidebarGroups.map((group, index) => (
            <div className="sidebar-group" key={group.group || index}>
                {(Array.isArray(group.items) ? group.items : []).map((item) => {
                const cleanPath = String(item.path || "").replace(/^\/+/, "");
                const itemPath = `${basePath}/${cleanPath}`;
                const isActive =
                  location.pathname === itemPath ||
                  location.pathname.startsWith(`${itemPath}/`);
                return (
                  <button
                    key={item.path || item.label}
                    type="button"
                    className={`sidebar-link sidebar-item ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => handleNavigation(item.path)}
                    title={isCollapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="sidebar-icon sidebar-link-icon">
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="sidebar-link-label sidebar-label">
                        {item.label}
                      </span>
                    )}

                    {isActive && !isCollapsed && (
                      <span className="sidebar-active-dot" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <button
          type="button"
          className="sidebar-desktop-collapse"
          onClick={() => setIsCollapsed((previous) => !previous)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </aside>
      <main id="main" className="sidebar-main-bar">
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantMain;
