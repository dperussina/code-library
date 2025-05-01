import pandas as pd # Import pandas for DataFrame operations.
from pathlib import Path # Import Path for object-oriented filesystem paths.

def save_dataframe_parquet(df: pd.DataFrame, filepath: str | Path, compression: str | None = 'snappy'):
    """Saves a Pandas DataFrame to Parquet format, which is efficient for large datasets.

    Args:
        df: The pandas DataFrame to save.
        filepath: The path (string or Path object) where the Parquet file will be saved.
        compression: The compression algorithm to use ('snappy', 'gzip', 'brotli', None).
                     'snappy' is often a good balance between speed and compression ratio.
                     Requires appropriate libraries installed (e.g., python-snappy, brotli).
    """
    try:
        # Use the DataFrame's to_parquet method.
        # engine='pyarrow' or 'fastparquet' can be specified (pyarrow is common).
        df.to_parquet(filepath, compression=compression, engine='pyarrow')
        # Confirm successful saving.
        print(f"DataFrame saved to {filepath} (compression: {compression})")
    except Exception as e:
        # Handle potential errors during saving (e.g., invalid path, compression library missing).
        print(f"Error saving DataFrame to Parquet {filepath}: {e}")

def load_dataframe_parquet(filepath: str | Path, columns: list[str] | None = None) -> pd.DataFrame | None:
    """Loads a Pandas DataFrame from Parquet format, optionally selecting specific columns.

    Args:
        filepath: The path (string or Path object) to the Parquet file.
        columns: An optional list of column names to load. If None, loads all columns.
                 Loading only needed columns can significantly improve performance.

    Returns:
        The loaded pandas DataFrame, or None if loading fails.
    """
    path = Path(filepath)
    # Check if the file exists before attempting to load.
    if not path.exists():
        print(f"Error: Parquet file not found at {filepath}")
        return None
    try:
        # Use pandas.read_parquet to load the data.
        # Specifying columns can reduce memory usage and load time.
        df = pd.read_parquet(filepath, columns=columns, engine='pyarrow')
        # Confirm successful loading and show shape.
        print(f"DataFrame loaded from {filepath} with shape {df.shape}")
        # Return the loaded DataFrame.
        return df
    except Exception as e:
        # Handle potential errors during loading (e.g., corrupted file, invalid format).
        print(f"Error loading DataFrame from Parquet {filepath}: {e}")
        return None