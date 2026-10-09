from pydantic import BaseModel, Field, field_validator


class RouteRequest(BaseModel):
    origin: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    cargo_type: str = Field(..., min_length=2)
    containers: int = Field(..., ge=1, le=1000)

    @field_validator("origin", "destination", "cargo_type")
    @classmethod
    def clean_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty")
        return value


class QuotationRequest(BaseModel):
    origin: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    cargo_type: str = Field(..., min_length=2)
    containers: int = Field(..., ge=1, le=1000)

    @field_validator("origin", "destination", "cargo_type")
    @classmethod
    def clean_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty")
        return value