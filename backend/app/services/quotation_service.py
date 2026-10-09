from app.agents.route_agent import RouteAgent
from app.agents.pricing_agent import PricingAgent
from app.agents.margin_agent import MarginAgent


class QuotationService:

    def __init__(self):

        self.route_agent = RouteAgent()
        self.pricing_agent = PricingAgent()
        self.margin_agent = MarginAgent()

    # =========================================================
    # GENERATE QUOTATION
    # =========================================================

    def generate_quotation(
        self,
        origin: str,
        destination: str,
        cargo_type: str,
        containers: int,
    ) -> dict:

        # =====================================================
        # VALIDATE CONTAINERS
        # =====================================================

        try:
            containers = int(containers)

        except (TypeError, ValueError):

            return {
                "success": False,
                "message": (
                    "Number of containers must be a valid integer."
                )
            }

        if containers <= 0:

            return {
                "success": False,
                "message": (
                    "Number of containers must be greater than 0."
                )
            }

        # =====================================================
        # STEP 1: ROUTE AGENT
        # =====================================================

        try:

            route_result = self.route_agent.analyze_route(
                origin=origin,
                destination=destination,
                cargo_type=cargo_type,
                containers=containers,
            )

        except Exception as error:

            return {
                "success": False,
                "message": (
                    f"Route analysis failed: {str(error)}"
                )
            }

        # =====================================================
        # CHECK ROUTE RESULT
        # =====================================================

        if not route_result:

            return {
                "success": False,
                "message": "Route Agent returned no result."
            }

        if not route_result.get("success", True):

            return {
                "success": False,
                "message": route_result.get(
                    "message",
                    "Unable to analyze the route."
                )
            }

        # =====================================================
        # GET RECOMMENDED ROUTE
        # =====================================================

        recommended_route = route_result.get(
            "recommended_route"
        )

        if not recommended_route:

            return {
                "success": False,
                "message": (
                    "Route Agent did not return a recommended route."
                )
            }

        # =====================================================
        # STEP 2: PRICING AGENT
        # =====================================================

        try:

            pricing_result = (
                self.pricing_agent.calculate_pricing(
                    route=recommended_route,
                    containers=containers,
                )
            )

        except Exception as error:

            return {
                "success": False,
                "message": (
                    f"Pricing calculation failed: {str(error)}"
                ),
                "recommended_route": recommended_route,
            }

        # =====================================================
        # CHECK PRICING RESULT
        # =====================================================

        if not pricing_result:

            return {
                "success": False,
                "message": (
                    "Pricing Agent returned no result."
                ),
                "recommended_route": recommended_route,
            }

        if not pricing_result.get("success", False):

            return {
                "success": False,

                "message": pricing_result.get(
                    "message",
                    "Unable to calculate pricing."
                ),

                "shipment": {
                    "origin": origin.title(),
                    "destination": destination.title(),
                    "cargo_type": cargo_type,
                    "containers": containers,
                },

                "recommended_route": recommended_route,

                "pricing": pricing_result,

                "alternate_routes": route_result.get(
                    "alternate_routes",
                    []
                ),
            }

        # =====================================================
        # GET ESTIMATED COST
        # =====================================================

        estimated_cost = pricing_result.get(
            "estimated_total_usd"
        )

        if estimated_cost is None:

            return {
                "success": False,
                "message": (
                    "Pricing Agent did not return estimated total cost."
                ),
                "pricing": pricing_result,
            }

        # =====================================================
        # GET TARGET MARGIN
        # =====================================================

        target_margin = pricing_result.get(
            "target_margin_percent",
            15.0
        )

        # =====================================================
        # STEP 3: MARGIN AGENT
        # =====================================================

        try:

            margin_result = (
                self.margin_agent.calculate_margin(
                    estimated_cost=estimated_cost,
                    target_margin_percent=target_margin,
                    containers=containers,
                )
            )

        except Exception as error:

            return {
                "success": False,
                "message": (
                    f"Margin calculation failed: {str(error)}"
                ),
                "pricing": pricing_result,
            }

        # =====================================================
        # CHECK MARGIN RESULT
        # =====================================================

        if not margin_result:

            return {
                "success": False,
                "message": (
                    "Margin Agent returned no result."
                ),
                "pricing": pricing_result,
            }

        if not margin_result.get("success", False):

            return {
                "success": False,

                "message": margin_result.get(
                    "message",
                    "Unable to calculate margin."
                ),

                "shipment": {
                    "origin": origin.title(),
                    "destination": destination.title(),
                    "cargo_type": cargo_type,
                    "containers": containers,
                },

                "recommended_route": recommended_route,

                "pricing": pricing_result,

                "margin_analysis": margin_result,

                "alternate_routes": route_result.get(
                    "alternate_routes",
                    []
                ),
            }

        # =====================================================
        # STEP 4: FINAL QUOTATION
        # =====================================================

        quotation = {

            "success": True,

            "message": (
                "Quotation generated successfully."
            ),

            # -------------------------------------------------
            # SHIPMENT
            # -------------------------------------------------

            "shipment": {

                "origin": origin.title(),

                "destination": destination.title(),

                "cargo_type": cargo_type,

                "containers": containers,
            },

            # -------------------------------------------------
            # ROUTE
            # -------------------------------------------------

            "recommended_route": recommended_route,

            "route_analysis": route_result,

            # -------------------------------------------------
            # PRICING
            # -------------------------------------------------

            "pricing": pricing_result,

            # -------------------------------------------------
            # MARGIN
            # -------------------------------------------------

            "margin_analysis": margin_result,

            # -------------------------------------------------
            # ALTERNATIVE ROUTES
            # -------------------------------------------------

            "alternate_routes": route_result.get(
                "alternate_routes",
                []
            ),
        }

        return quotation