"""
Reduced Mode data models.

Defines reduced mode state models.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, UUID4


class ReducedModeState(BaseModel):
    """Reduced mode state model stored in database."""
    
    id: UUID4
    user_id: UUID4
    is_active: bool = False
    activated_at: Optional[datetime] = None
    deactivated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ReducedModeResponse(BaseModel):
    """Response containing reduced mode state."""
    
    is_active: bool
    activated_at: Optional[datetime] = None
    deactivated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
