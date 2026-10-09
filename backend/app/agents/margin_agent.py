class MarginAgent:

    def calculate_margin(
        self,
        estimated_cost: float = None,
        target_margin_percent: float = 15.0,
        cost_per_container: float = None,
        containers: int = 1,
        **kwargs,
    ) -> dict:

        # =========================================================
        # GET ESTIMATED COST
        # =========================================================

        if estimated_cost is None:
            estimated_cost = kwargs.get("total_cost")

        if estimated_cost is None:
            estimated_cost = kwargs.get("cost")

        if estimated_cost is None:
            return {
                "success": False,
                "message": "Estimated cost is required."
            }

        # =========================================================
        # VALIDATE INPUT
        # =========================================================

        try:
            estimated_cost = float(estimated_cost)
            target_margin_percent = float(
                target_margin_percent
            )
            containers = int(containers)

        except (TypeError, ValueError):
            return {
                "success": False,
                "message": (
                    "Invalid cost, margin or container value."
                )
            }

        # =========================================================
        # VALIDATION
        # =========================================================

        if estimated_cost < 0:
            return {
                "success": False,
                "message": "Estimated cost cannot be negative."
            }

        if target_margin_percent < 0:
            return {
                "success": False,
                "message": "Target margin cannot be negative."
            }

        if target_margin_percent >= 100:
            return {
                "success": False,
                "message": (
                    "Target margin must be less than 100%."
                )
            }

        if containers <= 0:
            return {
                "success": False,
                "message": (
                    "Number of containers must be greater than 0."
                )
            }

        # =========================================================
        # MARGIN CALCULATION
        # =========================================================

        margin_decimal = (
            target_margin_percent / 100
        )

        # Selling Price Formula:
        #
        # Selling Price = Cost / (1 - Margin)
        #
        # Example:
        # Cost = 14900
        # Margin = 15%
        #
        # 14900 / (1 - 0.15)
        # = 17529.41

        recommended_selling_price = (
            estimated_cost
            / (1 - margin_decimal)
        )

        # =========================================================
        # EXPECTED PROFIT
        # =========================================================

        expected_profit = (
            recommended_selling_price
            - estimated_cost
        )

        # =========================================================
        # ACHIEVED MARGIN
        # =========================================================

        if recommended_selling_price > 0:

            achieved_margin = (
                expected_profit
                / recommended_selling_price
            ) * 100

        else:
            achieved_margin = 0

        # =========================================================
        # PER CONTAINER VALUES
        # =========================================================

        calculated_cost_per_container = (
            estimated_cost / containers
        )

        profit_per_container = (
            expected_profit / containers
        )

        selling_price_per_container = (
            recommended_selling_price
            / containers
        )

        # =========================================================
        # FINAL RESULT
        # =========================================================

        return {

            "success": True,

            "estimated_cost_usd": round(
                estimated_cost,
                2
            ),

            "recommended_selling_price_usd": round(
                recommended_selling_price,
                2
            ),

            "expected_profit_usd": round(
                expected_profit,
                2
            ),

            "target_margin_percent": round(
                target_margin_percent,
                2
            ),

            "achieved_margin_percent": round(
                achieved_margin,
                2
            ),

            "containers": containers,

            "cost_per_container_usd": round(
                calculated_cost_per_container,
                2
            ),

            "profit_per_container_usd": round(
                profit_per_container,
                2
            ),

            "selling_price_per_container_usd": round(
                selling_price_per_container,
                2
            ),

            "message": (
                "Recommended selling price calculated successfully."
            ),
        }