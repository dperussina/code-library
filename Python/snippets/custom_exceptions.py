class CustomError(Exception):
    """Base class for custom exceptions."""
    pass

class FileNotFoundError(CustomError):
    """Raised when a file is not found."""
    pass

class InvalidDataError(CustomError):
    """Raised when data is invalid."""
    pass