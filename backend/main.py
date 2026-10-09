from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import RouteRequest, QuotationRequest
from app.agents.route_agent import RouteAgent
from app.services.quotation_service import QuotationService


app = FastAPI(
    title="Agentic Maritime Brokerage Platform",
    description="Milestone 2 - Route Intelligence and Freight Quotation",
    version="2.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


route_agent = RouteAgent()
quotation_service = QuotationService()


@app.get("/")
def home():
    return {
        "message": "Agentic Maritime Brokerage API is running",
        "milestone": "Milestone 2 - Route Intelligence and Freight Quotation",
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "route_agent": "online",
        "quotation_service": "online",
    }


@app.post("/api/routes/analyze")
def analyze_route(request: RouteRequest):
    try:
        result = route_agent.analyze_route(
            origin=request.origin,
            destination=request.destination,
            cargo_type=request.cargo_type,
            containers=request.containers,
        )

        if not result["success"]:
            raise HTTPException(
                status_code=404,
                detail=result["message"],
            )

        return result

    except HTTPException:
        raise

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error while analyzing routes.",
        )


@app.post("/api/quotation/generate")
def generate_quotation(request: QuotationRequest):
    try:
        result = quotation_service.generate_quotation(
            origin=request.origin,
            destination=request.destination,
            cargo_type=request.cargo_type,
            containers=request.containers,
        )

        if not result["success"]:
            raise HTTPException(
                status_code=404,
                detail=result["message"],
            )

        return result

    except HTTPException:
        raise

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )