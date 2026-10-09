import { useState } from "react";
import "./NewQuotation.css";

function NewQuotation({ user, onNavigate }) {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    commodity: "",
    cargoType: "",
    quantity: "",
    weight: "",
    vesselType: "",
    requiredDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.commodity.trim() ||
      !form.quantity.trim() ||
      !form.weight.trim()
    ) {
      setMessage(
        "Please fill in all required fields."
      );

      setMessageType("error");

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      /*
       * Backend integration
       *
       * If your routeAPI.js already contains
       * the generateQuotation function, use it here.
       */

      let result = null;

      try {
        const apiModule = await import("../src/routeAPI");

        if (
          typeof apiModule.generateQuotation ===
          "function"
        ) {
          result =
            await apiModule.generateQuotation(form);
        }
      } catch {
        /*
         * API module is optional for this UI step.
         */
      }

      const reference =
        "Q-" +
        Date.now()
          .toString()
          .slice(-6);

      const quotation = {
        id: Date.now(),

        reference,

        userEmail: user?.email || "",

        origin: form.origin.trim(),

        destination:
          form.destination.trim(),

        commodity:
          form.commodity.trim(),

        cargoType:
          form.cargoType.trim(),

        quantity:
          form.quantity.trim(),

        weight:
          form.weight.trim(),

        vesselType:
          form.vesselType.trim(),

        requiredDate:
          form.requiredDate,

        notes:
          form.notes.trim(),

        status: result
          ? "Completed"
          : "Pending",

        createdAt:
          new Date().toISOString(),

        apiResult: result,
      };

      const existing =
        JSON.parse(
          localStorage.getItem(
            "maritimeQuotations"
          ) || "[]"
        );

      localStorage.setItem(
        "maritimeQuotations",
        JSON.stringify([
          ...existing,
          quotation,
        ])
      );

      setMessage(
        `Quotation ${reference} created successfully.`
      );

      setMessageType("success");

      setForm({
        origin: "",
        destination: "",
        commodity: "",
        cargoType: "",
        quantity: "",
        weight: "",
        vesselType: "",
        requiredDate: "",
        notes: "",
      });

    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to create quotation. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-quotation-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="quotation-page-header">

        <div>

          <div className="quotation-badge">
            NEW QUOTATION
          </div>

          <h2>
            Create a{" "}
            <em>
              quotation.
            </em>
          </h2>

          <p>
            Enter the shipment requirements below
            to generate maritime route intelligence.
          </p>

        </div>

        <button
          className="back-dashboard-button"
          onClick={() =>
            onNavigate("dashboard")
          }
        >
          ← Dashboard
        </button>

      </section>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        className="quotation-form"
        onSubmit={handleSubmit}
      >

        {/* ROUTE */}

        <div className="quotation-form-section">

          <div className="form-section-heading">
            <span>01</span>

            <div>
              <h3>
                Route information
              </h3>

              <p>
                Define the shipment origin and destination.
              </p>
            </div>
          </div>

          <div className="quotation-two-columns">

            <div className="quotation-field">

              <label>
                Origin <b>*</b>
              </label>

              <input
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="e.g. Mumbai, India"
              />

            </div>

            <div className="quotation-field">

              <label>
                Destination <b>*</b>
              </label>

              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Rotterdam, Netherlands"
              />

            </div>

          </div>

        </div>

        {/* CARGO */}

        <div className="quotation-form-section">

          <div className="form-section-heading">
            <span>02</span>

            <div>
              <h3>
                Cargo details
              </h3>

              <p>
                Provide information about the cargo.
              </p>
            </div>
          </div>

          <div className="quotation-grid">

            <div className="quotation-field">

              <label>
                Commodity <b>*</b>
              </label>

              <input
                name="commodity"
                value={form.commodity}
                onChange={handleChange}
                placeholder="e.g. Steel"
              />

            </div>

            <div className="quotation-field">

              <label>
                Cargo type
              </label>

              <select
                name="cargoType"
                value={form.cargoType}
                onChange={handleChange}
              >
                <option value="">
                  Select cargo type
                </option>

                <option value="Dry Bulk">
                  Dry Bulk
                </option>

                <option value="Container">
                  Container
                </option>

                <option value="Liquid Bulk">
                  Liquid Bulk
                </option>

                <option value="Break Bulk">
                  Break Bulk
                </option>

                <option value="General Cargo">
                  General Cargo
                </option>
              </select>

            </div>

            <div className="quotation-field">

              <label>
                Quantity <b>*</b>
              </label>

              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 500"
              />

            </div>

            <div className="quotation-field">

              <label>
                Weight <b>*</b>
              </label>

              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 20 MT"
              />

            </div>

          </div>

        </div>

        {/* VESSEL */}

        <div className="quotation-form-section">

          <div className="form-section-heading">
            <span>03</span>

            <div>
              <h3>
                Voyage requirements
              </h3>

              <p>
                Add vessel and delivery requirements.
              </p>
            </div>
          </div>

          <div className="quotation-grid">

            <div className="quotation-field">

              <label>
                Vessel type
              </label>

              <select
                name="vesselType"
                value={form.vesselType}
                onChange={handleChange}
              >
                <option value="">
                  Select vessel type
                </option>

                <option value="Bulk Carrier">
                  Bulk Carrier
                </option>

                <option value="Container Ship">
                  Container Ship
                </option>

                <option value="Tanker">
                  Tanker
                </option>

                <option value="General Cargo Ship">
                  General Cargo Ship
                </option>

                <option value="Ro-Ro">
                  Ro-Ro
                </option>
              </select>

            </div>

            <div className="quotation-field">

              <label>
                Required date
              </label>

              <input
                type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="quotation-field quotation-notes">

            <label>
              Additional notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any additional shipment requirements..."
              rows="5"
            />

          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`quotation-message ${messageType}`}
          >
            {message}
          </div>
        )}

        {/* ACTIONS */}

        <div className="quotation-actions">

          <button
            type="button"
            className="quotation-cancel"
            onClick={() =>
              onNavigate("dashboard")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="quotation-submit"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Generate quotation →"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default NewQuotation;