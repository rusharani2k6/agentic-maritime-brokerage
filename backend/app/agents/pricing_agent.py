from pathlib import Path
import pandas as pd


class PricingAgent:

    def __init__(self, csv_path: str | None = None):

        # pricing.csv location:
        # backend/data/pricing.csv
        default_path = (
            Path(__file__).resolve().parents[2]
            / "data"
            / "pricing.csv"
        )

        self.csv_path = Path(csv_path) if csv_path else default_path

    # =========================================================
    # LOAD PRICING DATA
    # =========================================================

    def _load_pricing(self) -> pd.DataFrame:
        """Load and validate pricing.csv."""

        if not self.csv_path.exists():
            raise FileNotFoundError(
                f"Pricing dataset not found: {self.csv_path}"
            )

        df = pd.read_csv(self.csv_path)

        required_columns = {
            "pricing_id",
            "route_id",
            "fuel_surcharge_usd",
            "port_charge_usd",
            "demand_factor",
            "risk_surcharge_usd",
            "target_margin_percent",
        }

        missing_columns = required_columns - set(df.columns)

        if missing_columns:
            raise ValueError(
                "Pricing dataset is missing columns: "
                + ", ".join(sorted(missing_columns))
            )

        return df

    # =========================================================
    # CALCULATE PRICING
    # =========================================================

    def calculate_pricing(
        self,
        route: dict,
        containers: int
    ) -> dict:
        """
        Calculate freight operating cost.

        Pricing Agent responsibilities:
        1. Identify selected route.
        2. Read pricing.csv.
        3. Read ocean freight from Route Agent.
        4. Add fuel, port and risk charges.
        5. Apply demand factor.
        6. Calculate total freight cost.
        7. Pass target margin to Margin Agent.
        """

        # -----------------------------------------------------
        # VALIDATE CONTAINERS
        # -----------------------------------------------------

        try:
            containers = int(containers)
        except (TypeError, ValueError):
            return {
                "success": False,
                "message": "Number of containers must be a valid integer."
            }

        if containers <= 0:
            return {
                "success": False,
                "message": "Number of containers must be greater than 0."
            }

        # -----------------------------------------------------
        # VALIDATE ROUTE
        # -----------------------------------------------------

        if not isinstance(route, dict):
            return {
                "success": False,
                "message": "Invalid route data received from Route Agent."
            }

        route_id = str(
            route.get("route_id", "")
        ).strip()

        if not route_id:
            return {
                "success": False,
                "message": "Route ID is missing from route data."
            }

        # -----------------------------------------------------
        # LOAD DATASET
        # -----------------------------------------------------

        try:
            df = self._load_pricing()
        except (FileNotFoundError, ValueError) as error:
            return {
                "success": False,
                "message": str(error)
            }

        # -----------------------------------------------------
        # FIND ROUTE PRICING
        # -----------------------------------------------------

        pricing_data = df[
            df["route_id"]
            .astype(str)
            .str.strip()
            .str.lower()
            == route_id.lower()
        ]

        if pricing_data.empty:
            return {
                "success": False,
                "message": f"No pricing data found for route {route_id}."
            }

        pricing = pricing_data.iloc[0]

        # -----------------------------------------------------
        # OCEAN FREIGHT
        # -----------------------------------------------------
        # Ocean freight is obtained from Route Agent.

        try:
            ocean_freight = float(
                route.get("ocean_freight_usd", 0)
            )

            fuel_surcharge = float(
                pricing["fuel_surcharge_usd"]
            )

            port_charge = float(
                pricing["port_charge_usd"]
            )

            risk_surcharge = float(
                pricing["risk_surcharge_usd"]
            )

            demand_factor = float(
                pricing["demand_factor"]
            )

            target_margin_percent = float(
                pricing["target_margin_percent"]
            )

        except (TypeError, ValueError):
            return {
                "success": False,
                "message": "Invalid numeric value found in route or pricing data."
            }

        # -----------------------------------------------------
        # BASE COST PER CONTAINER
        # -----------------------------------------------------

        base_cost_per_container = (
            ocean_freight
            + fuel_surcharge
            + port_charge
            + risk_surcharge
        )

        # -----------------------------------------------------
        # DEMAND ADJUSTMENT
        # -----------------------------------------------------

        adjusted_cost_per_container = (
            base_cost_per_container
            * demand_factor
        )

        # -----------------------------------------------------
        # TOTAL ESTIMATED COST
        # -----------------------------------------------------

        estimated_total_cost = (
            adjusted_cost_per_container
            * containers
        )

        # -----------------------------------------------------
        # TOTAL COMPONENT COSTS
        # -----------------------------------------------------

        total_ocean_freight = ocean_freight * containers
        total_fuel_surcharge = fuel_surcharge * containers
        total_port_charge = port_charge * containers
        total_risk_surcharge = risk_surcharge * containers

        # -----------------------------------------------------
        # RESULT
        # -----------------------------------------------------

        return {
            "success": True,

            "route_id": route_id,

            "containers": containers,

            # -------------------------------------------------
            # PER CONTAINER
            # -------------------------------------------------

            "ocean_freight_per_container_usd": round(
                ocean_freight, 2
            ),

            "fuel_surcharge_per_container_usd": round(
                fuel_surcharge, 2
            ),

            "port_charge_per_container_usd": round(
                port_charge, 2
            ),

            "risk_surcharge_per_container_usd": round(
                risk_surcharge, 2
            ),

            "base_cost_per_container_usd": round(
                base_cost_per_container, 2
            ),

            "adjusted_cost_per_container_usd": round(
                adjusted_cost_per_container, 2
            ),

            # -------------------------------------------------
            # TOTAL COSTS
            # -------------------------------------------------

            "ocean_freight_usd": round(
                total_ocean_freight, 2
            ),

            "fuel_surcharge_usd": round(
                total_fuel_surcharge, 2
            ),

            "port_charge_usd": round(
                total_port_charge, 2
            ),

            "risk_surcharge_usd": round(
                total_risk_surcharge, 2
            ),

            "estimated_total_usd": round(
                estimated_total_cost, 2
            ),

            # -------------------------------------------------
            # PRICING FACTORS
            # -------------------------------------------------

            "demand_factor": round(
                demand_factor, 2
            ),

            "target_margin_percent": round(
                target_margin_percent, 2
            ),

            "message": (
                "Freight pricing calculated successfully."
            ),
        }