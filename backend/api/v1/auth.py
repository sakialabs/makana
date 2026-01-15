"""
Authentication API endpoints.

Handles user signup, signin, and token refresh.
"""
import logging
from fastapi import APIRouter, HTTPException, status, Depends
from models.user import UserCreate, UserLogin, TokenResponse, UserProfile, User
from services.auth_service import auth_service
from dependencies.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate) -> TokenResponse:
    """
    Create new user account.
    
    Args:
        user_data: Email and password for new account
        
    Returns:
        TokenResponse with access token and user info
        
    Raises:
        HTTPException: 400 if account creation fails
    """
    try:
        # Sign up with Supabase Auth
        auth_response = auth_service.supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to create account. Try again in a moment."
            )
        
        # Create user profile
        profile = auth_service.create_user_profile(
            user_id=auth_response.user.id,
            email=auth_response.user.email
        )
        
        # Build user object
        user = User(
            id=auth_response.user.id,
            email=auth_response.user.email,
            aud=auth_response.user.aud,
            role=auth_response.user.role
        )
        
        logger.info(f"User signed up: {user.id}")
        
        return TokenResponse(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            expires_in=auth_response.session.expires_in,
            refresh_token=auth_response.session.refresh_token,
            user=user
        )
        
    except Exception as e:
        logger.error(f"Signup failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create account. Check your email and password."
        )


@router.post("/signin", response_model=TokenResponse)
async def signin(credentials: UserLogin) -> TokenResponse:
    """
    Authenticate user and return tokens.
    
    Args:
        credentials: Email and password
        
    Returns:
        TokenResponse with access token and user info
        
    Raises:
        HTTPException: 401 if credentials are invalid
    """
    try:
        # Sign in with Supabase Auth
        auth_response = auth_service.supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to sign in. Check your email and password."
            )
        
        # Build user object
        user = User(
            id=auth_response.user.id,
            email=auth_response.user.email,
            aud=auth_response.user.aud,
            role=auth_response.user.role
        )
        
        logger.info(f"User signed in: {user.id}")
        
        return TokenResponse(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            expires_in=auth_response.session.expires_in,
            refresh_token=auth_response.session.refresh_token,
            user=user
        )
        
    except Exception as e:
        logger.error(f"Signin failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to sign in. Check your email and password."
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str) -> TokenResponse:
    """
    Refresh access token using refresh token.
    
    Args:
        refresh_token: Valid refresh token
        
    Returns:
        TokenResponse with new access token
        
    Raises:
        HTTPException: 401 if refresh token is invalid
    """
    try:
        # Refresh session with Supabase Auth
        auth_response = auth_service.supabase.auth.refresh_session(refresh_token)
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to refresh session. Please sign in again."
            )
        
        # Build user object
        user = User(
            id=auth_response.user.id,
            email=auth_response.user.email,
            aud=auth_response.user.aud,
            role=auth_response.user.role
        )
        
        logger.info(f"Token refreshed for user: {user.id}")
        
        return TokenResponse(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            expires_in=auth_response.session.expires_in,
            refresh_token=auth_response.session.refresh_token,
            user=user
        )
        
    except Exception as e:
        logger.error(f"Token refresh failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to refresh session. Please sign in again."
        )


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
) -> UserProfile:
    """
    Get current user's profile.
    
    Args:
        current_user: Authenticated user from token
        
    Returns:
        UserProfile with user data
        
    Raises:
        HTTPException: 404 if profile not found
    """
    profile = auth_service.get_user_profile(str(current_user.id))
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found."
        )
    
    return profile
