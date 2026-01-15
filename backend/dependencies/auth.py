"""
Authentication dependencies.

FastAPI dependencies for JWT token validation and user extraction.
"""
import logging
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from models.user import User
from services.auth_service import auth_service

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> User:
    """
    Dependency to extract and verify current user from JWT token.
    
    Args:
        credentials: HTTP Bearer token from Authorization header
        
    Returns:
        Verified User object
        
    Raises:
        HTTPException: 401 if token is invalid or expired
        
    Examples:
        >>> @app.get("/protected")
        >>> async def protected_route(user: User = Depends(get_current_user)):
        >>>     return {"user_id": user.id}
    """
    token = credentials.credentials
    
    try:
        user = auth_service.verify_token(token)
        return user
    except JWTError as e:
        logger.warning(f"Token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to verify credentials. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
