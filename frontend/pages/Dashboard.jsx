import "./Dashboard.css";

function Dashboard({ user, setActivePage }) {
  const stats = [
    {
      label: "ACTIVE AGENTS",
      value: "3",
      detail: "All systems operational",
      icon: "✦",
    },
    {
      label: "TOTAL QUOTATIONS",
      value: "24",
      detail: "+8 this month",
      icon: "▤",
    },
    {
      label: "ROUTES ANALYZED",
      value: "47",
      detail: "+12 this month",
      icon: "⌁",
    },
    {
      label: "AVERAGE MARGIN",
      value: "18.6%",
      detail: "Target: 15%",
      icon: "%",
    },
  ];

  const recentQuotes = [
    {
      id: "QT-2026-024",
      route: "Chennai → Rotterdam",
      cargo: "Electronics",
      containers: 4,
      margin: "21.4%",
      status: "Approved",
    },
    {
      id: "QT-2026-023",
      route: "Mumbai → Hamburg",
      cargo: "Machinery",
      containers: 2,
      margin: "17.8%",
      status: "Pending",
    },
    {
      id: "QT-2026-022",
      route: "Vizag → Singapore",
      cargo: "Textiles",
      containers: 6,
      margin: "19.2%",
      status: "Approved",
    },
    {
      id: "QT-2026-021",
      route: "Chennai → Dubai",
      cargo: "Automotive",
      containers: 3,
      margin: "14.7%",
      status: "Pending",
    },
  ];

  const handleNewQuotation = () => {
    if (setActivePage) {
      setActivePage("new-quotation");
    }
  };

  const handleViewQuotations = () => {
    if (setActivePage) {
      setActivePage("quotations");
    }
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <section className="dashboard-welcome">

        <div className="welcome-text">

          <span className="dashboard-eyebrow">
            EXECUTIVE OVERVIEW
          </span>

          <h1>
            Good afternoon,{" "}
            <em>
              {user?.name?.split(" ")[0] || "there"}.
            </em>
          </h1>

          <p>
            Monitor your freight intelligence,
            quotations and agent activity from one place.
          </p>

        </div>

        <button
          className="new-quote-button"
          onClick={handleNewQuotation}
        >
          <span>＋</span>
          New quotation
        </button>

      </section>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="dashboard-stat-grid">

        {stats.map((stat) => (
          <div
            className="dashboard-stat-card"
            key={stat.label}
          >

            <div className="stat-card-top">

              <span className="stat-label">
                {stat.label}
              </span>

              <span className="stat-icon">
                {stat.icon}
              </span>

            </div>

            <strong className="stat-value">
              {stat.value}
            </strong>

            <span className="stat-detail">
              {stat.detail}
            </span>

          </div>
        ))}

      </section>


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <section className="dashboard-main-grid">

        {/* ===================================================
            RECENT QUOTATIONS
        =================================================== */}

        <div className="dashboard-panel quotations-panel">

          <div className="panel-header">

            <div>
              <span>
                ACTIVITY
              </span>

              <h2>
                Recent quotations
              </h2>
            </div>

            <button
              className="view-all-button"
              onClick={handleViewQuotations}
            >
              View all →
            </button>

          </div>


          <div className="quotation-table-wrapper">

            <table className="quotation-table">

              <thead>
                <tr>
                  <th>QUOTE ID</th>
                  <th>ROUTE</th>
                  <th>CARGO</th>
                  <th>CONT.</th>
                  <th>MARGIN</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {recentQuotes.map((quote) => (
                  <tr key={quote.id}>

                    <td>
                      <strong className="quote-id">
                        {quote.id}
                      </strong>
                    </td>

                    <td>
                      {quote.route}
                    </td>

                    <td>
                      {quote.cargo}
                    </td>

                    <td>
                      {quote.containers}
                    </td>

                    <td>
                      <strong className="margin-value">
                        {quote.margin}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`quote-status ${quote.status.toLowerCase()}`}
                      >
                        {quote.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* ===================================================
            DEMAND FACTOR
        =================================================== */}

        <div className="dashboard-panel demand-panel">

          <div className="panel-header">

            <div>
              <span>
                MARKET INTELLIGENCE
              </span>

              <h2>
                Demand factor
              </h2>
            </div>

          </div>


          <div className="demand-score">

            <div className="demand-score-number">
              1.08
            </div>

            <span>
              Current factor
            </span>

          </div>


          <div className="demand-meter">

            <div
              className="demand-meter-fill"
              style={{ width: "68%" }}
            ></div>

          </div>


          <div className="demand-labels">

            <span>
              Low demand
            </span>

            <span>
              High demand
            </span>

          </div>


          <div className="demand-description">

            <span className="demand-indicator"></span>

            <p>
              Market demand is currently
              <strong> elevated</strong> on selected
              trade lanes.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          AGENT HEALTH
      ===================================================== */}

      <section className="agent-health-section">

        <div className="section-heading">

          <div>

            <span>
              INTELLIGENCE LAYER
            </span>

            <h2>
              Agent swarm health
            </h2>

          </div>

          <span className="all-online">
            ● All agents online
          </span>

        </div>


        <div className="agent-health-grid">

          {/* ROUTE AGENT */}

          <div className="agent-health-card">

            <div className="agent-card-icon">
              ⌁
            </div>

            <div className="agent-card-info">

              <span className="agent-card-label">
                ROUTE AGENT
              </span>

              <h3>
                Route Intelligence
              </h3>

              <p>
                Analyzes routes, distance,
                transit time and transshipment.
              </p>

              <div className="agent-status">
                <span></span>
                Processing normally
              </div>

            </div>

            <strong className="agent-online">
              ONLINE
            </strong>

          </div>


          {/* PRICING AGENT */}

          <div className="agent-health-card">

            <div className="agent-card-icon">
              $
            </div>

            <div className="agent-card-info">

              <span className="agent-card-label">
                PRICING AGENT
              </span>

              <h3>
                Freight Pricing
              </h3>

              <p>
                Calculates ocean freight,
                port charges and fuel surcharge.
              </p>

              <div className="agent-status">
                <span></span>
                Processing normally
              </div>

            </div>

            <strong className="agent-online">
              ONLINE
            </strong>

          </div>


          {/* MARGIN AGENT */}

          <div className="agent-health-card">

            <div className="agent-card-icon">
              %
            </div>

            <div className="agent-card-info">

              <span className="agent-card-label">
                MARGIN AGENT
              </span>

              <h3>
                Margin Intelligence
              </h3>

              <p>
                Evaluates selling price,
                expected profit and target margin.
              </p>

              <div className="agent-status">
                <span></span>
                Processing normally
              </div>

            </div>

            <strong className="agent-online">
              ONLINE
            </strong>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;