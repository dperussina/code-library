import os
from dotenv import load_dotenv

def load_env_variables(env_file: str = ".env"):
    """Loads environment variables from a .env file."""
    if os.path.exists(env_file):
        load_dotenv(env_file)
        print(f"Environment variables loaded from {env_file}")
    else:
        print(f"Warning: {env_file} not found.")