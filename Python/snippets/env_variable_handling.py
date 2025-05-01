import os # Import the os module for interacting with the operating system, including environment variables.
from dotenv import load_dotenv # Import load_dotenv function from the python-dotenv library.

def load_env_variables(env_file: str = ".env"):
    """Loads environment variables from a .env file."""
    # Check if the specified .env file exists in the current directory or path.
    if os.path.exists(env_file):
        # Load the environment variables from the file into the system's environment.
        load_dotenv(env_file)
        # Confirm that the variables were loaded.
        print(f"Environment variables loaded from {env_file}")
    else:
        # Warn the user if the .env file was not found.
        print(f"Warning: {env_file} not found.")