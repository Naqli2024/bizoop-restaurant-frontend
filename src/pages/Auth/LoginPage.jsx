
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { login } from "../../redux/Auth/AuthSlice";
import "../../assets/styles/landing/login.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.authAdmin);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(login(form)).unwrap();

      // Actual API response structure
      const user = response.data.user;
      

      // API returns role as a string: ADMIN
      const role = user?.role?.toUpperCase();

      const routes = {
        ADMIN: "/admin/command",
        CASHIER: "/cashier/sales-iq",
        CAPTAIN: "/captain/floor",
        KITCHEN: "/kot-display/display",
        BACKOFFICE: "/back-office/overview",
      };

      if (!user || !role) {
        toast.error("User details not found");
        return;
      }

      if (!routes[role]) {
        toast.error(`Invalid user role: ${role}`);
        return;
      }

      // Login successful
      toast.success(response.message || "Login successful");

      // Navigate according to role
      navigate(routes[role], { replace: true });

    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Login failed"
      );
    }
  };

  return (
    <main className="bz-login-page" id="loginPage">
      <div className="bz-login-decoration bz-login-decoration-one" />
      <div className="bz-login-decoration bz-login-decoration-two" />

      <section className="bz-login-card">
        <div className="bz-login-logo">
          <span className="bz-brand-mark">🍽</span>
        </div>

        <span className="bz-section-kicker">WELCOME BACK</span>

        <h1>Login to BIZOOP</h1>

        <p className="bz-login-subtitle">
          Sign in to manage your restaurant workspace
        </p>

        <form id="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="bz-username">Username</label>

          <input
            id="bz-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="bz-password">Password</label>

          <div className="bz-password-wrap">
            <input
              id="bz-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="bz-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <button
            className="bz-primary-btn bz-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="bz-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="bz-login-secure">
          <ShieldCheck size={16} />
          Secure restaurant workspace
        </div>
      </section>
    </main>
  );
}
