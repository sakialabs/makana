"""
Authentication service.

Handles JWT token verification and user profile management.
"""
import logging
from typing import Optional
from datetime import datetime
from jose import jwt, JWTError
from supabase import create_client, Client
from config import settings
from models.user import User, UserProfile

logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication and user management."""
    
    def __init__(self) -> None:
        """Initialize auth service with Supabase client."""
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
        self.jwt_secret = settings.supabase_jwt_secret
    
    def verify_token(self, token: str) -> User:
        """
        Verify JWT token and return user.
        
        Args:
            token: JWT access token
            
        Returns:
            User object with id and email
            
        Raises:
            JWTError: If token is invalid or expired
            
        Examples:
            >>> service = AuthService()
            >>> user = service.verify_token("valid.jwt.token")
            >>> assert user.email == "user@example.com"
        """
        try:
            # Decode JWT token
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"],
                audience="authenticated"
            )
            
            # Extract user information
            user_id = payload.get("sub")
            email = payload.get("email")
            
            if not user_id or not email:
                raise JWTError("Invalid token payload")
            
            logger.info(f"Token verified for user: {user_id}")
            
            return User(
                id=user_id,
                email=email,
                aud=payload.get("aud", "authenticated"),
                role=payload.get("role", "authenticated")
            )
            
        except JWTError as e:
            logger.warning(f"Token verification failed: {str(e)}")
            raise
    
    def create_user_profile(self, user_id: str, email: str) -> UserProfile:
        """
        Create user profile in database.
        
        Args:
            user_id: User UUID from Supabase Auth
            email: User email address
            
        Returns:
            Created UserProfile
            
        Examples:
            >>> service = AuthService()
            >>> profile = service.create_user_profile(
            ...     "550e8400-e29b-41d4-a716-446655440000",
            ...     "user@example.com"
            ... )
            >>> assert profile.email == "user@example.com"
        """
        try:
            # Check if profile already exists
            existing = self.supabase.table("user_profiles").select("*").eq(
                "id", user_id
            ).execute()
            
            if existing.data:
                logger.info(f"User profile already exists: {user_id}")
                return UserProfile(**existing.data[0])
            
            # Create new profile
            now = datetime.utcnow()
            profile_data = {
                "id": user_id,
                "email": email,
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }
            
            result = self.supabase.table("user_profiles").insert(
                profile_data
            ).execute()
            
            logger.info(f"User profile created: {user_id}")
            
            return UserProfile(**result.data[0])
            
        except Exception as e:
            logger.error(f"Failed to create user profile: {str(e)}")
            raise
    
    def get_user_profile(self, user_id: str) -> Optional[UserProfile]:
        """
        Get user profile by ID.
        
        Args:
            user_id: User UUID
            
        Returns:
            UserProfile if found, None otherwise
        """
        try:
            result = self.supabase.table("user_profiles").select("*").eq(
                "id", user_id
            ).execute()
            
            if result.data:
                return UserProfile(**result.data[0])
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user profile: {str(e)}")
            return None


# Global auth service instance
auth_service = AuthService()
