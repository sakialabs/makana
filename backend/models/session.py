"""
Session data models.

Defines session-related models for Ignition and Braking.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, UUID4, Field


class Session(BaseModel):
    """Session model stored in database."""
    
    id: UUID4
    user_id: UUID4
    setup_id: UUID4
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    next_step: Optional[str] = None
    status: str = Field(..., pattern="^(active|completed|abandoned)$")
    reduced_mode_active: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class SessionCreate(BaseModel):
    """Schema for starting a session (Ignition)."""
    
    setup_id: UUID4
    
    class Config:
        json_schema_extra = {
            "example": {
                "setup_id": "00000000-0000-0000-0000-000000000001"
            }
        }


class SessionEnd(BaseModel):
    """Schema for ending a session (Braking)."""
    
    next_step: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "next_step": "Review design document"
            }
        }


class SessionResponse(BaseModel):
    """Response containing session data."""
    
    id: UUID4
    setup_id: UUID4
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    next_step: Optional[str] = None
    status: str
    reduced_mode_active: bool
    
    class Config:
        from_attributes = True
