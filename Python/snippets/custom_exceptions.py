# Define a base class for custom exceptions in this module or application.
# Inheriting from the built-in Exception class is standard practice.
class CustomError(Exception):
    """Base class for custom exceptions."""
    # Pass is used as a placeholder, indicating no additional logic is needed in the base class itself.
    pass

# Define a specific exception for file not found errors.
# Inherits from the custom base class CustomError.
class FileNotFoundError(CustomError):
    """Raised when a file is not found."""
    # This specific error class doesn't need additional logic beyond what's inherited.
    pass

# Define a specific exception for invalid data errors.
# Inherits from the custom base class CustomError.
class InvalidDataError(CustomError):
    """Raised when data is invalid."""
    # This specific error class also doesn't need additional logic.
    pass