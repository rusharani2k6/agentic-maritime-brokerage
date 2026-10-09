import "./Topbar.css";

function Topbar({ user, activePage }) {

  const pageTitles = {
    dashboard: "Executive Dashboard",
    "new-quotation": "New Quotation",
    "route-intelligence": "Route Intelligence",
    quotations: "Quotation History",
  };

  const title =
    pageTitles[activePage] || "Executive Dashboard";


  return (
    <header className="topbar">

      <div className="topbar-left">

        <div className="topbar-page-title">
          <span>MARITIME AI</span>

          <h2>
            {title}
          </h2>
        </div>

      </div>


      <div className="topbar-right">

        <div className="system-status">

          <span className="system-status-dot"></span>

          <span>
            All systems operational
          </span>

        </div>


        <div className="topbar-divider"></div>


        <div className="topbar-user">

          <div className="topbar-avatar">
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="topbar-user-text">

            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              Broker
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;