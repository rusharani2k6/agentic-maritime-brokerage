```jsx
import { useState } from "react";
import "./App.css";

import Dashboard from "../pages/Dashboard.jsx";
import NewQuotation from "../pages/NewQuotation.jsx";
import Quotations from "../pages/Quotations.jsx";

const ADMIN_ACCOUNT = {
  name: "Maritime Administrator",
  email: "admin@maritimeai.com",
  password: "admin123",
  mobile: "",
  location: "Maritime AI",
  role: "admin",
};

/* SIDEBAR */
function Sidebar({ activePage, setActivePage, onLogout, user }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "new-quotation", label: "New Quotation" },
    { id: "route-intelligence", label: "Route Intelligence" },
    { id: "quotations", label: "Quotations" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <strong>MARITIME AI</strong>
        <span>ROUTE INTELLIGENCE</span>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <strong>{user?.name || "User"}</strong>
          <span>{user?.email || ""}</span>
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

/* TOPBAR */
function Topbar({ user, activePage }) {
  const titles = {
    dashboard: "Dashboard",
    "new-quotation": "New Quotation",
    "route-intelligence": "Route Intelligence",
    quotations: "Quotations",
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <span>{titles[activePage] || "Maritime AI"}</span>
      </div>

      <div className="topbar-user">
        <span className="topbar-status">Route Agent Online</span>
        <span>{user?.name || "User"}</span>
      </div>
    </header>
  );
}

/* LOGIN AND REGISTRATION */
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleLoginChange = (e) => {
    setLoginForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
    setMessage("");
  };

  const handleRegisterChange = (e) => {
    setRegisterForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
    setMessage("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password.trim();

    if (!email || !password) {
      showMessage("Please enter your email and password.");
      return;
    }

    if (
      email === ADMIN_ACCOUNT.email &&
      password === ADMIN_ACCOUNT.password
    ) {
      localStorage.setItem(
        "maritimeUser",
        JSON.stringify(ADMIN_ACCOUNT)
      );
      localStorage.setItem("maritimeLoggedIn", "true");
      onLogin(ADMIN_ACCOUNT);
      return;
    }

    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem("maritimeUsers") || "[]"
      );
    } catch {
      users = [];
    }

    // Support accounts saved by the earlier version.
    try {
      const oldUser = JSON.parse(
        localStorage.getItem("maritimeUser") || "null"
      );

      if (
        oldUser &&
        oldUser.role !== "admin" &&
        !users.some(
          (u) =>
            u.email?.toLowerCase() ===
            oldUser.email?.toLowerCase()
        )
      ) {
        users.push(oldUser);
      }
    } catch {
      // Ignore invalid saved data.
    }

    const user = users.find(
      (u) =>
        u.email?.trim().toLowerCase() === email &&
        u.password === password
    );

    if (!user) {
      showMessage("Incorrect email or password. Please try again.");
      return;
    }

    const loggedInUser = { ...user, role: "user" };

    localStorage.setItem(
      "maritimeUser",
      JSON.stringify(loggedInUser)
    );
    localStorage.setItem("maritimeLoggedIn", "true");

    onLogin(loggedInUser);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      mobile,
      location,
      password,
      confirmPassword,
    } = registerForm;

    if (
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !location.trim() ||
      !password ||
      !confirmPassword
    ) {
      showMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    if (email.trim().toLowerCase() === ADMIN_ACCOUNT.email) {
      showMessage(
        "This email is reserved for administrator access."
      );
      return;
    }

    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem("maritimeUsers") || "[]"
      );
    } catch {
      users = [];
    }

    if (
      users.some(
        (u) =>
          u.email?.trim().toLowerCase() ===
          email.trim().toLowerCase()
      )
    ) {
      showMessage("An account with this email already exists.");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      location: location.trim(),
      password,
      role: "user",
    };

    users.push(newUser);

    localStorage.setItem("maritimeUsers", JSON.stringify(users));

    setLoginForm({
      email: newUser.email,
      password: "",
    });

    setRegisterForm({
      name: "",
      email: "",
      mobile: "",
      location: "",
      password: "",
      confirmPassword: "",
    });

    setMode("login");
    showMessage(
      "Account created successfully. Please sign in.",
      "success"
    );
  };

  return (
    <div className="auth-page">
      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="mobile-auth-brand">
            <strong>MARITIME AI</strong>
            <span>ROUTE INTELLIGENCE</span>
          </div>

          {mode === "login" ? (
            <>
              <div className="auth-heading">
                <p>WELCOME BACK</p>
                <h2>Sign in</h2>
                <span>
                  Access your maritime route intelligence platform.
                </span>
              </div>

              <form onSubmit={handleLogin}>
                <div className="auth-input-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    autoComplete="email"
                  />
                </div>

                <div className="auth-input-group">
                  <div className="password-header">
                    <label>Password</label>
                    <button
                      type="button"
                      onClick={() =>
                        showMessage(
                          "Password recovery will be available in a future version."
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    autoComplete="current-password"
                  />
                </div>

                {message && (
                  <div className={`auth-message ${messageType}`}>
                    {message}
                  </div>
                )}

                <button type="submit" className="auth-submit">
                  Sign in
                </button>
              </form>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <div className="auth-switch">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setMessage("");
                  }}
                >
                  Create account
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="auth-heading">
                <p>GET STARTED</p>
                <h2>Create account</h2>
                <span>
                  Create an account to access Maritime AI.
                </span>
              </div>

              <form onSubmit={handleRegister}>
                <div className="auth-two-columns">
                  <div className="auth-input-group">
                    <label>Full name</label>
                    <input
                      name="name"
                      placeholder="Your name"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                    />
                  </div>

                  <div className="auth-input-group">
                    <label>Mobile number</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="+91 XXXXX XXXXX"
                      value={registerForm.mobile}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="auth-input-group">
                  <label>Location</label>
                  <input
                    name="location"
                    placeholder="City / Country"
                    value={registerForm.location}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="auth-two-columns">
                  <div className="auth-input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                    />
                  </div>

                  <div className="auth-input-group">
                    <label>Confirm password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat password"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>

                {message && (
                  <div className={`auth-message ${messageType}`}>
                    {message}
                  </div>
                )}

                <button type="submit" className="auth-submit">
                  Create account
                </button>
              </form>

              <div className="auth-switch register-switch">
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  Sign in
                </button>
              </div>
            </>
          )}

          <p className="auth-terms">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ROUTE INTELLIGENCE - DEFINED HERE, NO EXTRA IMPORT */
function RouteIntelligence() {
  return (
    <div className="placeholder-page">
      <span className="placeholder-eyebrow">INTELLIGENCE</span>

      <h1>Route Intelligence</h1>

      <p>
        Analyze maritime routes, distance, transit time and
        transshipment options.
      </p>

      <div className="placeholder-card">
        <div>
          <span>ROUTE AGENT</span>
          <strong>Online</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong>Ready for analysis</strong>
        </div>
      </div>
    </div>
  );
}

/* USER APPLICATION */
function UserApplication({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            setActivePage={setActivePage}
          />
        );

      case "new-quotation":
        return (
          <NewQuotation
            user={user}
            setActivePage={setActivePage}
          />
        );

      case "route-intelligence":
        return <RouteIntelligence />;

      case "quotations":
        return (
          <Quotations
            user={user}
            setActivePage={setActivePage}
          />
        );

      default:
        return (
          <Dashboard
            user={user}
            setActivePage={setActivePage}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        user={user}
      />

      <div className="app-main">
        <Topbar user={user} activePage={activePage} />

        <main className="app-content">{renderPage()}</main>
      </div>
    </div>
  );
}

/* ADMIN DASHBOARD - DEFINED HERE, NO EXTRA IMPORT */
function AdminDashboard({ user, onLogout }) {
  return (
    <div className="admin-wrapper">
      <div className="admin-topbar">
        <div className="admin-brand">
          <strong>MARITIME AI</strong>
          <span>ADMIN CONSOLE</span>
        </div>

        <div className="admin-user">
          <div>
            <strong>{user?.name || "Administrator"}</strong>
            <span>Administrator</span>
          </div>

          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <main className="admin-content">
        <span className="admin-eyebrow">ADMINISTRATION</span>

        <h1>Welcome, {user?.name || "Administrator"}.</h1>

        <p>
          Monitor quotations, agents, revenue and platform activity.
        </p>

        <div className="admin-stats">
          <div>
            <span>TOTAL QUERIES</span>
            <strong>0</strong>
          </div>

          <div>
            <span>PROCESSED QUOTATIONS</span>
            <strong>0</strong>
          </div>

          <div>
            <span>ACTIVE AGENTS</span>
            <strong>3</strong>
          </div>

          <div>
            <span>SYSTEM STATUS</span>
            <strong>Online</strong>
          </div>
        </div>
      </main>
    </div>
  );
}

/* MAIN APP */
function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("maritimeLoggedIn") === "true"
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("maritimeUser") || "null"
      );
    } catch {
      return null;
    }
  });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("maritimeLoggedIn");
    localStorage.removeItem("maritimeUser");

    setUser(null);
    setLoggedIn(false);
  };

  if (!loggedIn || !user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <UserApplication
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;