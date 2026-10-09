import { useState } from "react";
import "./Quotations.css";

function Quotations({ onNavigate }) {
  const [quotations, setQuotations] =
    useState(() =>
      JSON.parse(
        localStorage.getItem(
          "maritimeQuotations"
        ) || "[]"
      )
    );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredQuotations =
    quotations
      .filter((quotation) => {
        const searchText =
          `${quotation.reference || ""} ${
            quotation.origin || ""
          } ${
            quotation.destination || ""
          } ${
            quotation.commodity || ""
          }`.toLowerCase();

        return searchText.includes(
          search.toLowerCase()
        );
      })
      .filter((quotation) => {
        if (filter === "All") return true;

        return (
          (quotation.status || "Pending") ===
          filter
        );
      })
      .reverse();

  const clearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear quotation history?"
    );

    if (!confirmed) return;

    localStorage.removeItem(
      "maritimeQuotations"
    );

    setQuotations([]);
  };

  return (
    <div className="quotations-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="quotations-header">

        <div>

          <div className="quotations-badge">
            QUOTATION HISTORY
          </div>

          <h2>
            Your{" "}
            <em>
              quotations.
            </em>
          </h2>

          <p>
            Review and manage your previously
            generated maritime quotations.
          </p>

        </div>

        <button
          className="new-quotation-button"
          onClick={() =>
            onNavigate("new-quotation")
          }
        >
          ＋ New quotation
        </button>

      </section>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <section className="quotations-toolbar">

        <div className="quotation-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search quotations..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="All">
            All statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Failed">
            Failed
          </option>
        </select>

        {quotations.length > 0 && (
          <button
            className="clear-history-button"
            onClick={clearHistory}
          >
            Clear history
          </button>
        )}

      </section>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <section className="quotations-card">

        {filteredQuotations.length === 0 ? (

          <div className="quotations-empty">

            <div className="quotations-empty-icon">
              ◫
            </div>

            <h3>
              No quotations found
            </h3>

            <p>
              {quotations.length === 0
                ? "You haven't created any quotations yet."
                : "No quotations match your search."}
            </p>

            {quotations.length === 0 && (
              <button
                onClick={() =>
                  onNavigate("new-quotation")
                }
              >
                Create quotation
              </button>
            )}

          </div>

        ) : (

          <div className="quotations-table-wrapper">

            <table className="quotations-table">

              <thead>

                <tr>
                  <th>Reference</th>
                  <th>Route</th>
                  <th>Commodity</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredQuotations.map(
                  (quotation, index) => {

                    const createdDate =
                      quotation.createdAt
                        ? new Date(
                            quotation.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—";

                    return (
                      <tr
                        key={
                          quotation.id ||
                          index
                        }
                      >

                        <td>
                          <strong>
                            {quotation.reference ||
                              "Quotation"}
                          </strong>
                        </td>

                        <td>
                          <div className="route-cell">

                            <span>
                              {quotation.origin ||
                                "—"}
                            </span>

                            <small>
                              ↓
                            </small>

                            <span>
                              {quotation.destination ||
                                "—"}
                            </span>

                          </div>
                        </td>

                        <td>
                          {quotation.commodity ||
                            "—"}
                        </td>

                        <td>
                          {quotation.quantity ||
                            "—"}
                        </td>

                        <td>
                          {createdDate}
                        </td>

                        <td>

                          <span
                            className={`quotation-status ${
                              (
                                quotation.status ||
                                "Pending"
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >
                            {quotation.status ||
                              "Pending"}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default Quotations;