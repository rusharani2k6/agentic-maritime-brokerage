from pathlib import Path
import pandas as pd


class RouteAgent:
    """
    Milestone 1 & 2 Route Intelligence Agent.

    Responsibilities:
    - Read route information from routes.csv
    - Filter routes based on origin and destination
    - Calculate route scores
    - Provide score breakdown
    - Select the recommended route
    - Return alternate routes
    - Provide freight information required by PricingAgent
    """

    def __init__(self, csv_path: str | None = None):
        default_path = Path(__file__).resolve().parents[2] / "data" / "routes.csv"
        self.csv_path = Path(csv_path) if csv_path else default_path

    def _load_routes(self) -> pd.DataFrame:
        """Load and validate the route dataset."""

        if not self.csv_path.exists():
            raise FileNotFoundError(
                f"Route dataset not found: {self.csv_path}"
            )

        df = pd.read_csv(self.csv_path)

        required_columns = {
            "route_id",
            "origin",
            "destination",
            "via",
            "route_name",
            "transit_time_days",
            "distance_km",
            "carrier",
            "risk_score",
            "congestion_score",
            "ocean_freight_usd",
            "port_charges_usd",
            "fuel_surcharge_usd",
        }

        missing = required_columns - set(df.columns)

        if missing:
            raise ValueError(
                f"Dataset is missing columns: {', '.join(sorted(missing))}"
            )

        return df

    @staticmethod
    def _score(df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate route score.

        Lower transit time, distance, risk and congestion
        produce a better score.
        """

        def inverse_normalize(series):
            low = series.min()
            high = series.max()

            if high == low:
                return pd.Series(
                    [100.0] * len(series),
                    index=series.index
                )

            return 100 - (
                (series - low) / (high - low) * 100
            )

        df = df.copy()

        # Transit score
        df["transit_score"] = inverse_normalize(
            df["transit_time_days"]
        )

        # Distance score
        df["distance_score"] = inverse_normalize(
            df["distance_km"]
        )

        # Risk score
        df["risk_score_component"] = (
            100 - df["risk_score"].clip(0, 100)
        )

        # Congestion score
        df["congestion_score_component"] = (
            100 - df["congestion_score"].clip(0, 100)
        )

        # Final route score
        df["route_score"] = (
            df["transit_score"] * 0.35
            + df["distance_score"] * 0.20
            + df["risk_score_component"] * 0.25
            + df["congestion_score_component"] * 0.20
        ).round(1)

        return df.sort_values(
            "route_score",
            ascending=False
        )

    def analyze_route(
        self,
        origin: str,
        destination: str,
        cargo_type: str,
        containers: int,
    ):
        """
        Analyze available routes and select the best route.
        """

        # Load dataset
        df = self._load_routes()

        # Clean input
        origin = origin.strip().lower()
        destination = destination.strip().lower()
        cargo_type = cargo_type.strip()

        # Find matching routes
        matches = df[
            (df["origin"].astype(str).str.strip().str.lower() == origin)
            &
            (
                df["destination"]
                .astype(str)
                .str.strip()
                .str.lower()
                == destination
            )
        ].copy()

        # No routes found
        if matches.empty:
            return {
                "success": False,
                "message": (
                    f"No available routes found from "
                    f"{origin.title()} to "
                    f"{destination.title()}."
                ),
                "routes": [],
                "recommended_route": None,
            }

        # Calculate scores
        scored = self._score(matches)

        routes = []

        for _, row in scored.iterrows():

            route = {
                # Basic route information
                "route_id": str(row["route_id"]),
                "origin": str(row["origin"]),
                "destination": str(row["destination"]),
                "via": str(row["via"]),
                "route_name": str(row["route_name"]),
                "carrier": str(row["carrier"]),

                # Route performance
                "transit_time_days": int(row["transit_time_days"]),
                "distance_km": int(row["distance_km"]),
                "risk_score": int(row["risk_score"]),
                "congestion_score": int(row["congestion_score"]),

                # Freight information
                "ocean_freight_usd": float(
                    row["ocean_freight_usd"]
                ),
                "port_charges_usd": float(
                    row["port_charges_usd"]
                ),
                "fuel_surcharge_usd": float(
                    row["fuel_surcharge_usd"]
                ),

                # Overall route score
                "route_score": float(
                    row["route_score"]
                ),

                # Score breakdown
                "score_breakdown": {
                    "transit_score": round(
                        float(row["transit_score"]), 2
                    ),
                    "distance_score": round(
                        float(row["distance_score"]), 2
                    ),
                    "risk_score": round(
                        float(row["risk_score_component"]), 2
                    ),
                    "congestion_score": round(
                        float(row["congestion_score_component"]), 2
                    ),
                },
            }

            routes.append(route)

        # First route after sorting is the recommended route
        recommended_route = routes[0]

        # Remaining routes are alternate routes
        alternate_routes = routes[1:]

        return {
            "success": True,

            "message": (
                f"Found {len(routes)} available routes."
            ),

            "shipment": {
                "origin": origin.title(),
                "destination": destination.title(),
                "cargo_type": cargo_type,
                "containers": containers,
            },

            "recommended_route": recommended_route,

            "alternate_routes": alternate_routes,

            "routes": routes,
        }