"""
User data models.

Defines user profile and authentication-related models.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, UUID4


class User(BaseModel):
    """User model from JWT token verification."""
    
    id: UUID4
    email: EmailStr
    aud: str = "authenticated"
    role: str = "authenticated"
    
    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """User profile stored in database."""
    
    id: UUID4
    email: EmailStr
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login."""
    
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class TokenResponse(BaseModel):
    """Response containing authentication tokens."""
    
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None
    user: User
