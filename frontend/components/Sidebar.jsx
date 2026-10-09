import "./Sidebar.css";

function Sidebar({ activePage, setActivePage, onLogout, user }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "new-quotation",
      label: "New Quotation",
      icon: "＋",
    },
    {
      id: "route-intelligence",
      label: "Route Intelligence",
      icon: "⌁",
    },
    {
      id: "quotations",
      label: "Quotations",
      icon: "▤",
    },
  ];

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">

        <div className="sidebar-logo">
          M
        </div>

        <div className="sidebar-brand-text">
          <strong>MARITIME AI</strong>
          <span>ROUTE INTELLIGENCE</span>
        </div>

      </div>


      {/* Main Navigation */}
      <div className="sidebar-section">

        <span className="sidebar-section-title">
          WORKSPACE
        </span>

        <nav className="sidebar-nav">

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >

              <span className="sidebar-nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </button>
          ))}

        </nav>

      </div>


      {/* Agent Health */}
      <div className="sidebar-agent-box">

        <div className="sidebar-agent-header">

          <span className="sidebar-section-title">
            AGENT SWARM
          </span>

          <span className="agent-online-dot"></span>

        </div>


        <div className="sidebar-agent">

          <span className="mini-agent-dot"></span>

          <div>
            <strong>Route Agent</strong>
            <small>Online</small>
          </div>

        </div>


        <div className="sidebar-agent">

          <span className="mini-agent-dot"></span>

          <div>
            <strong>Pricing Agent</strong>
            <small>Online</small>
          </div>

        </div>


        <div className="sidebar-agent">

          <span className="mini-agent-dot"></span>

          <div>
            <strong>Margin Agent</strong>
            <small>Online</small>
          </div>

        </div>

      </div>


      {/* Bottom */}
      <div className="sidebar-bottom">

        <div className="sidebar-user">

          <div className="sidebar-user-avatar">
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="sidebar-user-info">

            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.email || "user@example.com"}
            </span>

          </div>

        </div>


        <button
          className="sidebar-logout"
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;