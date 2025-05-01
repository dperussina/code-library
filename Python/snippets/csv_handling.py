# Reading CSV Files (using `csv` module)
import csv # Import the standard library CSV module for working with CSV files.
from pathlib import Path # Import Path for object-oriented filesystem paths.

def read_csv_basic(filepath: str | Path) -> list[list[str]]:
    """Reads a CSV file using the csv module, returns list of lists."""
    data = [] # Initialize an empty list to store the rows read from the CSV.
    try:
        # Open the CSV file in read mode ('r') with UTF-8 encoding.
        # newline='' prevents extra blank rows when reading.
        with open(filepath, 'r', newline='', encoding='utf-8') as csvfile:
            # Create a CSV reader object.
            reader = csv.reader(csvfile)
            # Read and optionally store or skip the header row.
            header = next(reader) # Skip header row, or store it
            # Iterate over the remaining rows in the CSV file.
            for row in reader:
                # Append each row (as a list of strings) to the data list.
                data.append(row)
        # Return the list containing all rows (excluding the header).
        return data
    except FileNotFoundError:
        # Handle the case where the specified file does not exist.
        print(f"Error: File not found at {filepath}")
        return [] # Return an empty list in case of error.
    except Exception as e:
        # Handle any other exceptions that might occur during file reading or processing.
        print(f"Error reading CSV {filepath}: {e}")
        return [] # Return an empty list in case of error.

# Writing Pandas DataFrame to CSV
import pandas as pd # Import the pandas library for data manipulation, especially DataFrames.

def write_csv_pandas(df, filepath, index=False):
    """Writes a pandas DataFrame to a CSV file."""
    try:
        # Use the DataFrame's to_csv method to write data to the specified file path.
        # index=False prevents writing the DataFrame index as a column in the CSV.
        # encoding='utf-8' specifies the character encoding for the output file.
        df.to_csv(filepath, index=index, encoding='utf-8')
        # Print a success message upon successful completion.
        print(f"Successfully wrote DataFrame to {filepath}")
    except Exception as e:
        # Handle any exceptions that might occur during the writing process.
        print(f"Error writing DataFrame to CSV {filepath}: {e}")