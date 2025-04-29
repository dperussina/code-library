# Reading CSV Files (using `csv` module)
import csv
from pathlib import Path

def read_csv_basic(filepath: str | Path) -> list[list[str]]:
    """Reads a CSV file using the csv module, returns list of lists."""
    data = []
    try:
        with open(filepath, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader) # Skip header row, or store it
            for row in reader:
                data.append(row)
        return data
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return []
    except Exception as e:
        print(f"Error reading CSV {filepath}: {e}")
        return []

# Writing Pandas DataFrame to CSV
import pandas as pd

def write_csv_pandas(df, filepath, index=False):
    """Writes a pandas DataFrame to a CSV file."""
    try:
        df.to_csv(filepath, index=index, encoding='utf-8')
        print(f"Successfully wrote DataFrame to {filepath}")
    except Exception as e:
        print(f"Error writing DataFrame to CSV {filepath}: {e}")