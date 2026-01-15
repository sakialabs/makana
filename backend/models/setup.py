"""
Setup data models.

Defines preset configuration models.
"""
from datetime import datetime
from pydantic import BaseModel, UUID4, Field


class Setup(BaseModel):
    """Setup model stored in database."""
    
    id: UUID4
    name: str
    description: str
    default_session_duration: int = Field(..., ge=1, le=120)
    emphasis: str = Field(..., pattern="^(rest|continuity|health)$")
    is_preset: bool = True
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserSetup(BaseModel):
    """User setup model (active configuration)."""
    
    id: UUID4
    user_id: UUID4
    setup_id: UUID4
    activated_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


class SetupActivate(BaseModel):
    """Schema for activating a setup."""
    
    setup_id: UUID4
    
    class Config:
        json_schema_extra = {
            "example": {
                "setup_id": "00000000-0000-0000-0000-000000000001"
            }
        }


class SetupResponse(BaseModel):
    """Response containing setup data."""
    
    id: UUID4
    name: str
    description: str
    default_session_duration: int
    emphasis: str
    
    class Config:
        from_attributes = True
