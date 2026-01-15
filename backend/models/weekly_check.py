"""
Weekly Check data models.

Defines weekly reflection related models.
"""
from datetime import datetime, date
from typing import Dict, Any, Optional
from pydantic import BaseModel, UUID4, Field


class WeeklyCheck(BaseModel):
    """Weekly check model stored in database."""
    
    id: UUID4
    user_id: UUID4
    week_start_date: date
    week_end_date: date
    responses: Dict[str, Any]
    insight: Optional[str] = None
    scope_recommendation: Optional[str] = None
    completed_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class WeeklyCheckCreate(BaseModel):
    """Schema for creating a weekly check."""
    
    responses: Dict[str, Any] = Field(
        ...,
        description="Reflection responses (capacity, experience, etc.)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "responses": {
                    "capacity": "good",
                    "reflection": "Steady week with consistent practice"
                }
            }
        }


class WeeklyCheckResponse(BaseModel):
    """Response containing weekly check data."""
    
    id: UUID4
    week_start_date: date
    week_end_date: date
    responses: Dict[str, Any]
    insight: Optional[str] = None
    scope_recommendation: Optional[str] = None
    completed_at: datetime
    
    class Config:
        from_attributes = True
