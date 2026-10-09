import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // ADMIN CREDENTIALS
  // =====================================================

  const ADMIN_EMAIL = "admin@maritimeai.com";
  const ADMIN_PASSWORD = "Admin@123";

  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // =====================================================
  // LOGIN INPUT
  // =====================================================

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // REGISTER INPUT
  // =====================================================

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    const email = loginData.email.trim().toLowerCase();
    const password = loginData.password;

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!email || !password) {
      showMessage("Please enter your email and password.");
      return;
    }

    // =================================================
    // ADMIN LOGIN
    // =================================================

    if (
      email === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const adminUser = {
        name: "Administrator",
        email: ADMIN_EMAIL,
        isAdmin: true,
      };

      localStorage.setItem(
        "maritimeLoggedIn",
        "true"
      );

      localStorage.setItem(
        "maritimeCurrentUser",
        JSON.stringify(adminUser)
      );

      showMessage(
        "Admin login successful!",
        "success"
      );

      setTimeout(() => {
        onLogin(adminUser);
      }, 500);

      return;
    }

    // =================================================
    // USER LOGIN
    // =================================================

    const savedUsers = JSON.parse(
      localStorage.getItem("maritimeUsers") || "[]"
    );

    const existingUser = savedUsers.find(
      (user) =>
        user.email.toLowerCase() === email &&
        user.password === password
    );

    if (!existingUser) {
      showMessage(
        "Incorrect email or password. Please try again."
      );
      return;
    }

    // Current logged-in user
    const currentUser = {
      ...existingUser,
      isAdmin: false,
    };

    localStorage.setItem(
      "maritimeLoggedIn",
      "true"
    );

    localStorage.setItem(
      "maritimeCurrentUser",
      JSON.stringify(currentUser)
    );

    showMessage(
      "Login successful!",
      "success"
    );

    setTimeout(() => {
      onLogin(currentUser);
    }, 500);
  };

  // =====================================================
  // REGISTER USER
  // =====================================================

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");

    const {
      name,
      email,
      mobile,
      location,
      password,
      confirmPassword,
    } = registerData;

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (
      !name ||
      !email ||
      !mobile ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      showMessage("Please fill in all fields.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // ---------------------------------------------
    // PASSWORD LENGTH
    // ---------------------------------------------

    if (password.length < 6) {
      showMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // ---------------------------------------------
    // PASSWORD MATCH
    // ---------------------------------------------

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    // ---------------------------------------------
    // ADMIN EMAIL PROTECTION
    // ---------------------------------------------

    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      showMessage(
        "This email is reserved for the administrator."
      );
      return;
    }

    // =================================================
    // GET EXISTING USERS
    // =================================================

    const savedUsers = JSON.parse(
      localStorage.getItem("maritimeUsers") || "[]"
    );

    // ---------------------------------------------
    // CHECK EXISTING USER
    // ---------------------------------------------

    const existingUser = savedUsers.find(
      (user) =>
        user.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      showMessage(
        "An account with this email already exists."
      );
      return;
    }

    // =================================================
    // CREATE NEW USER
    // =================================================

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      location: location.trim(),
      password: password,
    };

    // Add user to users array
    const updatedUsers = [
      ...savedUsers,
      newUser,
    ];

    localStorage.setItem(
      "maritimeUsers",
      JSON.stringify(updatedUsers)
    );

    // =================================================
    // SUCCESS
    // =================================================

    showMessage(
      "Account created successfully. Please login.",
      "success"
    );

    setTimeout(() => {
      setMode("login");

      setLoginData({
        email: cleanEmail,
        password: "",
      });

      setRegisterData({
        name: "",
        email: "",
        mobile: "",
        location: "",
        password: "",
        confirmPassword: "",
      });

      setMessage("");
      setMessageType("");
    }, 1000);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="auth-page">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="auth-left">

        <div className="auth-brand">

          <div className="brand-small">
            MARITIME AI
          </div>

          <div className="brand-sub">
            ROUTE INTELLIGENCE
          </div>

        </div>

        <div className="auth-hero">

          <p>
            AI-POWERED MARITIME INTELLIGENCE
          </p>

          <h1>
            Smarter routes.
            <br />
            <em>Stronger business.</em>
          </h1>

          <span>
            Intelligent freight route analysis,
            pricing and recommendations for modern
            maritime brokerage.
          </span>

        </div>

        <div className="auth-bottom">

          <span>
            Route Intelligence Platform
          </span>

          <div className="online-status">

            <span></span>

            Route Agent Online

          </div>

        </div>

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="auth-right">

        <div className="auth-card">

          {/* Mobile Brand */}

          <div className="mobile-brand">

            <strong>
              MARITIME AI
            </strong>

            <small>
              ROUTE INTELLIGENCE
            </small>

          </div>

          {/* =================================================
              LOGIN
          ================================================= */}

          {mode === "login" ? (
            <>

              <div className="auth-header">

                <span className="auth-label">
                  WELCOME BACK
                </span>

                <h2>
                  Sign in
                </h2>

                <p>
                  Access your maritime route intelligence
                  platform.
                </p>

              </div>

              <form onSubmit={handleLogin}>

                {/* Email */}

                <div className="input-group">

                  <label>
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />

                </div>

                {/* Password */}

                <div className="input-group">

                  <div className="password-label">

                    <label>
                      Password
                    </label>

                    <button
                      type="button"
                      className="forgot-button"
                      onClick={() =>
                        showMessage(
                          "Password recovery will be added later."
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
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />

                </div>

                {/* Message */}

                {message && (
                  <div
                    className={`auth-message ${messageType}`}
                  >
                    {message}
                  </div>
                )}

                {/* Login Button */}

                <button
                  type="submit"
                  className="primary-auth-button"
                >
                  Sign in
                </button>

              </form>

              {/* Divider */}

              <div className="divider">
                <span>
                  OR
                </span>
              </div>

              {/* Create Account */}

              <div className="create-account">

                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setMessage("");
                    setMessageType("");
                  }}
                >
                  Create account
                </button>

              </div>

            </>
          ) : (

            /* =================================================
               REGISTER
            ================================================= */

            <>

              <div className="auth-header">

                <span className="auth-label">
                  GET STARTED
                </span>

                <h2>
                  Create account
                </h2>

                <p>
                  Create your account to access
                  Maritime AI.
                </p>

              </div>

              <form onSubmit={handleRegister}>

                {/* Name + Mobile */}

                <div className="form-row">

                  <div className="input-group">

                    <label>
                      Full name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                    />

                  </div>

                  <div className="input-group">

                    <label>
                      Mobile number
                    </label>

                    <input
                      type="tel"
                      name="mobile"
                      placeholder="+91 XXXXX XXXXX"
                      value={registerData.mobile}
                      onChange={handleRegisterChange}
                    />

                  </div>

                </div>

                {/* Email */}

                <div className="input-group">

                  <label>
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />

                </div>

                {/* Location */}

                <div className="input-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="City / Country"
                    value={registerData.location}
                    onChange={handleRegisterChange}
                  />

                </div>

                {/* Password + Confirm Password */}

                <div className="form-row">

                  <div className="input-group">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                    />

                  </div>

                  <div className="input-group">

                    <label>
                      Confirm password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat password"
                      value={
                        registerData.confirmPassword
                      }
                      onChange={handleRegisterChange}
                    />

                  </div>

                </div>

                {/* Message */}

                {message && (
                  <div
                    className={`auth-message ${messageType}`}
                  >
                    {message}
                  </div>
                )}

                {/* Register Button */}

                <button
                  type="submit"
                  className="primary-auth-button"
                >
                  Create account
                </button>

              </form>

              {/* Login Link */}

              <div className="create-account">

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                    setMessageType("");
                  }}
                >
                  Sign in
                </button>

              </div>

            </>
          )}

          {/* Footer */}

          <div className="auth-footer">

            By continuing, you agree to our Terms and
            Privacy Policy.

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;