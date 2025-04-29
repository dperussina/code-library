import pandas as pd
from pathlib import Path

def save_dataframe_parquet(df: pd.DataFrame, filepath: str | Path, compression: str | None = 'snappy'):
    """Saves a Pandas DataFrame to Parquet format."""
    try:
        df.to_parquet(filepath, compression=compression, engine='pyarrow')
        print(f"DataFrame saved to {filepath} (compression: {compression})")
    except Exception as e:
        print(f"Error saving DataFrame to Parquet {filepath}: {e}")

def load_dataframe_parquet(filepath: str | Path, columns: list[str] | None = None) -> pd.DataFrame | None:
    """Loads a Pandas DataFrame from Parquet format, optionally selecting columns."""
    path = Path(filepath)
    if not path.exists():
        print(f"Error: Parquet file not found at {filepath}")
        return None
    try:
        df = pd.read_parquet(filepath, columns=columns, engine='pyarrow')
        print(f"DataFrame loaded from {filepath} with shape {df.shape}")
        return df
    except Exception as e:
        print(f"Error loading DataFrame from Parquet {filepath}: {e}")
        return None