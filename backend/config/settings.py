"""
Application settings and configuration.

Loads environment variables and provides typed configuration objects.
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Supabase Configuration
    supabase_url: str
    supabase_key: str
    supabase_jwt_secret: str
    
    # Application Configuration
    app_env: str = "development"
    log_level: str = "INFO"
    
    # API Configuration
    api_v1_prefix: str = "/api/v1"
    cors_origins: Union[List[str], str] = ["http://localhost:3000", "http://localhost:19006"]
    
    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
