"""
Daily Check data models.

Defines daily check-in related models.
"""
from datetime import datetime, date
from typing import Dict, Any
from pydantic import BaseModel, UUID4, Field


class DailyCheck(BaseModel):
    """Daily check model stored in database."""
    
    id: UUID4
    user_id: UUID4
    check_date: date
    responses: Dict[str, Any]
    completed_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class DailyCheckCreate(BaseModel):
    """Schema for creating a daily check."""
    
    responses: Dict[str, Any] = Field(
        ...,
        description="Check-in responses (energy_level, intention, etc.)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "responses": {
                    "energy_level": "medium",
                    "intention": "Focus on backend implementation"
                }
            }
        }


class DailyCheckResponse(BaseModel):
    """Response containing daily check data."""
    
    id: UUID4
    check_date: date
    responses: Dict[str, Any]
    completed_at: datetime
    
    class Config:
        from_attributes = True
