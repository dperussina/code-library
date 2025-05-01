# Python Code Snippets Library: Basic Examples

This document provides an overview of common Python tasks covered in our code snippets library, formatted for clarity.

**Core Libraries Often Needed:**

* `os`, `pathlib`: File system interaction
* `csv`: Working with CSV files
* `json`: Working with JSON data
* `collections`: Useful data structures like `Counter`, `defaultdict`
* `time`, `datetime`: Timing code, handling dates and times
* `logging`: Recording events and errors
* `argparse`: Parsing command-line arguments
* `requests`: Making HTTP requests (install via `pip install requests`)
* `numpy`: Numerical computing (install via `pip install numpy`)
* `pandas`: Data manipulation and analysis (install via `pip install pandas`)

*(For a library, you'd list `requests`, `numpy`, `pandas` etc., in your `setup.py` or `requirements.txt`)*

---

**1. File Handling (I/O)**

* **Reading a Text File Line by Line**
    *   **What it does:** Reads an entire text file into memory and returns its contents as a list of strings, with leading/trailing whitespace removed from each line.
    *   **Why you use it:** Useful for processing configuration files, logs, or any line-delimited text data where the entire file content can comfortably fit in memory.
    *   [See standalone snippet: snippets/file_handling.py](./snippets/file_handling.py)
    ```python
    import os
    from pathlib import Path

    def read_text_file(filepath: str | Path) -> list[str]:
        """Reads a text file and returns a list of lines."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = [line.strip() for line in f]
            return lines
        except FileNotFoundError:
            print(f"Error: File not found at {filepath}")
            return []
        except Exception as e:
            print(f"Error reading file {filepath}: {e}")
            return []

    # Usage:
    # lines = read_text_file("my_data.txt")
    # if lines:
    #     print(f"Read {len(lines)} lines.")
    ```

* **Writing Lines to a Text File**
    *   **What it does:** Writes a list of strings to a specified text file, adding a newline character after each string.
    *   **Why you use it:** To save processed data, logs, or generated text content to a file. Allows appending or overwriting.
    *   [See standalone snippet: snippets/file_handling.py](./snippets/file_handling.py)
    ```python
    from pathlib import Path

    def write_text_file(filepath: str | Path, lines: list[str], overwrite: bool = False):
        """Writes a list of strings to a text file, one string per line."""
        mode = 'w' if overwrite else 'a' # 'w' for overwrite, 'a' for append
        try:
            with open(filepath, mode, encoding='utf-8') as f:
                for line in lines:
                    f.write(line + '\n')
            print(f"Successfully wrote {len(lines)} lines to {filepath} (mode: {mode})")
        except Exception as e:
            print(f"Error writing to file {filepath}: {e}")

    # Usage:
    # data_to_write = ["Line 1", "Line 2", "Another line"]
    # write_text_file("output.txt", data_to_write, overwrite=True)
    ```

* **Reading CSV Files (using `csv` module)**
    *   **What it does:** Parses a Comma Separated Values (CSV) file using Python's built-in `csv` library.
    *   **Why you use it:** Standard, lightweight way to read structured tabular data without external dependencies like pandas. Good for simple CSV processing.
    *   [See standalone snippet: snippets/csv_handling.py](./snippets/csv_handling.py)
    ```python
    import csv
    from pathlib import Path

    def read_csv_basic(filepath: str | Path) -> list[list[str]]:
        """Reads a CSV file using the csv module, returns list of lists."""
        data = []
        try:
            with open(filepath, 'r', newline='', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                header = next(reader) # Skip header row, or store it
                # print(f"CSV Header: {header}")
                for row in reader:
                    data.append(row)
            return data
        except FileNotFoundError:
            print(f"Error: File not found at {filepath}")
            return []
        except Exception as e:
            print(f"Error reading CSV {filepath}: {e}")
            return []

    # Usage:
    # csv_data = read_csv_basic("data.csv")
    # if csv_data:
    #    print(f"Read {len(csv_data)} rows (excluding header).")
    ```

* **Reading CSV Files (using `pandas` - common for Data Science)**
    *   **What it does:** Reads a CSV file directly into a pandas DataFrame.
    *   **Why you use it:** Extremely common in data analysis workflows. Pandas provides powerful tools for manipulation, cleaning, and analysis immediately after reading.
    *   [See standalone snippet: snippets/csv_handling.py](./snippets/csv_handling.py) (*Functionality likely within this file*)
    ```python
    import pandas as pd
    from pathlib import Path

    def read_csv_pandas(filepath: str | Path) -> pd.DataFrame | None:
        """Reads a CSV file using pandas into a DataFrame."""
        try:
            df = pd.read_csv(filepath)
            print(f"Successfully read {filepath} into DataFrame with shape {df.shape}")
            return df
        except FileNotFoundError:
            print(f"Error: File not found at {filepath}")
            return None
        except Exception as e:
            print(f"Error reading CSV {filepath} with pandas: {e}")
            return None

    # Usage:
    # dataframe = read_csv_pandas("data.csv")
    # if dataframe is not None:
    #     print(dataframe.head())
    ```

* **Writing Pandas DataFrame to CSV**
    *   **What it does:** Saves the contents of a pandas DataFrame to a CSV file.
    *   **Why you use it:** Standard way to persist DataFrames or share tabular data generated from analysis.
    *   [See standalone snippet: snippets/csv_handling.py](./snippets/csv_handling.py)
    ```python
    import pandas as pd
    from pathlib import Path

    def write_csv_pandas(df: pd.DataFrame, filepath: str | Path, index: bool = False):
        """Writes a pandas DataFrame to a CSV file."""
        try:
            df.to_csv(filepath, index=index, encoding='utf-8')
            print(f"Successfully wrote DataFrame to {filepath}")
        except Exception as e:
            print(f"Error writing DataFrame to CSV {filepath}: {e}")

    # Usage:
    # Assuming 'dataframe' is a pandas DataFrame
    # write_csv_pandas(dataframe, "output_data.csv")
    ```

* **Reading JSON Files**
    *   **What it does:** Parses a file containing JSON data into the equivalent Python object (usually a dictionary or list).
    *   **Why you use it:** JSON is a very common format for configuration files, API responses, and data interchange.
    *   [See standalone snippet: snippets/json_handling.py](./snippets/json_handling.py)
    ```python
    import json
    from pathlib import Path

    def read_json_file(filepath: str | Path) -> dict | list | None:
        """Reads a JSON file and returns its content (dict or list)."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        except FileNotFoundError:
            print(f"Error: File not found at {filepath}")
            return None
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON format in {filepath}")
            return None
        except Exception as e:
            print(f"Error reading JSON file {filepath}: {e}")
            return None

    # Usage:
    # config = read_json_file("config.json")
    # if config:
    #     print("Config loaded:", config)
    ```

* **Writing Data to JSON File**
    *   **What it does:** Serializes a Python dictionary or list into JSON format and writes it to a file.
    *   **Why you use it:** To save Python data structures in a standard, human-readable format that can be easily read by other programs or systems.
    *   [See standalone snippet: snippets/json_handling.py](./snippets/json_handling.py)
    ```python
    import json
    from pathlib import Path

    def write_json_file(filepath: str | Path, data: dict | list, indent: int = 4):
        """Writes Python dict or list to a JSON file."""
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=indent, ensure_ascii=False)
            print(f"Successfully wrote data to {filepath}")
        except Exception as e:
            print(f"Error writing JSON file {filepath}: {e}")

    # Usage:
    # my_dict = {"name": "example", "version": 1, "enabled": True}
    # write_json_file("output.json", my_dict)
    ```

**2. File System Operations (using `pathlib`)**

* **Listing Files in a Directory**
    *   **What it does:** Retrieves a list of file paths within a specified directory, optionally matching a specific pattern.
    *   **Why you use it:** To discover files for processing, check directory contents, or perform batch operations.
    *   [See standalone snippet: snippets/file_system_operations.py](./snippets/file_system_operations.py)
    ```python
    from pathlib import Path

    def list_files(directory: str | Path, pattern: str = "*") -> list[Path]:
        """Lists files in a directory matching a pattern."""
        dir_path = Path(directory)
        if not dir_path.is_dir():
            print(f"Error: Directory not found or not a directory: {directory}")
            return []
        return list(dir_path.glob(pattern))

    # Usage:
    # txt_files = list_files(".", pattern="*.txt") # Files in current dir
    # all_files_recursive = list_files("/path/to/data", pattern="**/*") # All files recursively
    # print(f"Found files: {txt_files}")
    ```

* **Creating Directories**
    *   **What it does:** Creates a directory at the specified path.
    *   **Why you use it:** To ensure that output directories or necessary folder structures exist before writing files. `parents=True` is useful for creating nested directories.
    *   [See standalone snippet: snippets/file_system_operations.py](./snippets/file_system_operations.py)
    ```python
    from pathlib import Path

    def create_directory(dir_path: str | Path):
        """Creates a directory, including parent directories if needed."""
        path = Path(dir_path)
        try:
            path.mkdir(parents=True, exist_ok=True) # exist_ok=True prevents error if exists
            print(f"Directory ensured: {path}")
        except Exception as e:
            print(f"Error creating directory {path}: {e}")

    # Usage:
    # create_directory("data/raw/images")
    ```

* **Checking if File or Directory Exists**
    *   **What it does:** Checks if a path exists in the file system and whether it points to a file or a directory.
    *   **Why you use it:** To avoid errors by confirming a file exists before reading it, or a directory exists before writing to it or listing its contents.
    *   [See standalone snippet: snippets/file_system_operations.py](./snippets/file_system_operations.py)
    ```python
    from pathlib import Path

    def path_exists(path_str: str | Path) -> bool:
        """Checks if a file or directory exists."""
        return Path(path_str).exists()

    def is_file(path_str: str | Path) -> bool:
        """Checks if a path is an existing file."""
        return Path(path_str).is_file()

    def is_dir(path_str: str | Path) -> bool:
        """Checks if a path is an existing directory."""
        return Path(path_str).is_dir()

    # Usage:
    # if path_exists("config.json"):
    #     print("Config exists.")
    # if is_dir("data"):
    #     print("'data' is a directory.")
    ```

**3. Data Structures & Common Operations**

* **Counting Item Frequencies**
    *   **What it does:** Counts how many times each unique item appears in a list (or other iterable).
    *   **Why you use it:** Useful for summarizing data, finding the most common elements, or analyzing distributions.
    *   [See standalone snippet: snippets/data_structures.py](./snippets/data_structures.py)
    ```python
    from collections import Counter

    def count_items(items: list) -> Counter:
        """Counts the frequency of each item in a list."""
        return Counter(items)

    # Usage:
    # my_list = ['a', 'b', 'a', 'c', 'b', 'a']
    # counts = count_items(my_list) # Counter({'a': 3, 'b': 2, 'c': 1})
    # print(counts['a']) # Output: 3
    # print(counts.most_common(2)) # Output: [('a', 3), ('b', 2)]
    ```

* **Flattening a List of Lists**
    *   **What it does:** Transforms a list where each element is itself a list (a nested list) into a single, non-nested list.
    *   **Why you use it:** To simplify data structures that result from operations that group items into lists, making the individual items easier to iterate over or process.
    *   [See standalone snippet: snippets/utility_functions.py](./snippets/utility_functions.py)
    ```python
    def flatten_list(list_of_lists: list[list]) -> list:
        """Flattens a list of lists into a single list."""
        return [item for sublist in list_of_lists for item in sublist]
        # Alternative using itertools (potentially more efficient for large lists)
        # import itertools
        # return list(itertools.chain.from_iterable(list_of_lists))

    # Usage:
    # nested_list = [[1, 2], [3, 4, 5], [6]]
    # flat = flatten_list(nested_list) # [1, 2, 3, 4, 5, 6]
    # print(flat)
    ```

* **Removing Duplicates from a List (while preserving order)**
    *   **What it does:** Creates a new list containing only the first occurrence of each unique element from the input list, maintaining the original relative order.
    *   **Why you use it:** When you need a list of unique items but the order matters (unlike converting directly to a `set`).
    *   [See standalone snippet: snippets/data_structures.py](./snippets/data_structures.py)
    ```python
    def unique_ordered(items: list) -> list:
        """Removes duplicates from a list while preserving original order."""
        seen = set()
        unique_items = []
        for item in items:
            if item not in seen:
                unique_items.append(item)
                seen.add(item)
        return unique_items

    # Usage:
    # my_list = [1, 3, 2, 3, 1, 4, 2, 5]
    # uniques = unique_ordered(my_list) # [1, 3, 2, 4, 5]
    # print(uniques)
    ```

**4. Utility Functions**

* **Timing Code Execution (Decorator)**
    *   **What it does:** A Python decorator that measures the execution time of any function it wraps.
    *   **Why you use it:** Easy way to quickly profile the performance of specific functions without cluttering the function logic with timing code.
    *   [See standalone snippet: snippets/utility_functions.py](./snippets/utility_functions.py)
    ```python
    import time
    import functools

    def timer_decorator(func):
        """Decorator that prints the execution time of the function it decorates."""
        @functools.wraps(func)
        def wrapper_timer(*args, **kwargs):
            start_time = time.perf_counter() # More precise than time.time()
            value = func(*args, **kwargs)
            end_time = time.perf_counter()
            run_time = end_time - start_time
            print(f"Finished {func.__name__!r} in {run_time:.4f} secs")
            return value
        return wrapper_timer

    # Usage:
    # @timer_decorator
    # def potentially_slow_function(n):
    #     """Example function to time."""
    #     total = 0
    #     for i in range(n):
    #         total += i
    #     return total
    #
    # result = potentially_slow_function(1000000)
    ```

* **Basic Logging Setup**
    *   **What it does:** Configures Python's standard `logging` module for basic use.
    *   **Why you use it:** To record informational messages, warnings, errors, and debug details during script execution, which is crucial for monitoring and troubleshooting. Allows directing output to console and/or files.
    *   [See standalone snippet: snippets/utility_functions.py](./snippets/utility_functions.py) (*Assuming logger setup is here*)
    ```python
    import logging
    import sys

    def setup_basic_logging(level=logging.INFO, log_file: str | None = None):
        """Sets up basic logging to console and optionally to a file."""
        log_format = '%(asctime)s - %(levelname)s - %(message)s'
        handlers = [logging.StreamHandler(sys.stdout)]
        if log_file:
            handlers.append(logging.FileHandler(log_file, mode='a')) # 'a' for append

        logging.basicConfig(level=level, format=log_format, handlers=handlers)
        logging.info("Logging setup complete.")

    # Usage:
    # setup_basic_logging(level=logging.DEBUG, log_file="app.log")
    # logging.debug("This is a debug message.")
    # logging.info("Informational message.")
    # logging.warning("A warning occurred.")
    # logging.error("An error occurred.")
    # logging.critical("Critical failure.")
    ```

* **Command-Line Argument Parsing**
    *   **What it does:** Defines and parses arguments provided to a Python script when it's run from the command line.
    *   **Why you use it:** Makes scripts more flexible and configurable without needing to edit the code directly. Standard way to handle inputs, file paths, and options.
    *   [See standalone snippet: snippets/argparse_utilities.py](./snippets/argparse_utilities.py)
    ```python
    import argparse

    def parse_arguments():
        """Parses command-line arguments using argparse."""
        parser = argparse.ArgumentParser(description="Description of your script.")
        parser.add_argument("input_file", help="Path to the input file.")
        parser.add_argument("-o", "--output", default="output.txt", help="Path to the output file (default: output.txt).")
        parser.add_argument("-n", "--number", type=int, default=10, help="An integer parameter (default: 10).")
        parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")
        # Add more arguments as needed

        args = parser.parse_args()
        return args

    # Usage (typically in a script's main block):
    # if __name__ == "__main__":
    #     args = parse_arguments()
    #     print(f"Input file: {args.input_file}")
    #     print(f"Output file: {args.output}")
    #     print(f"Number: {args.number}")
    #     if args.verbose:
    #         print("Verbose mode enabled.")
          # Call your main logic function with args
          # main_function(args.input_file, args.output, args.number, args.verbose)
    ```

* **Handling Dates and Times**
    *   **What it does:** Provides functions to work with dates and times, including getting the current time, converting between strings and `datetime` objects, and calculating durations.
    *   **Why you use it:** Essential for timestamping events, parsing date information from data sources, performing date-based calculations, and formatting dates for display or logging.
    *   [See standalone snippet: snippets/datetime_utilities.py](./snippets/datetime_utilities.py)
    ```python
    from datetime import datetime, timedelta

    def get_current_timestamp(format_str: str = "%Y-%m-%d_%H-%M-%S") -> str:
        """Returns the current timestamp as a formatted string."""
        return datetime.now().strftime(format_str)

    def string_to_datetime(date_string: str, format_str: str = "%Y-%m-%d") -> datetime | None:
        """Converts a date string to a datetime object."""
        try:
            return datetime.strptime(date_string, format_str)
        except ValueError:
            print(f"Error: Could not parse date string '{date_string}' with format '{format_str}'")
            return None

    def datetime_to_string(dt_obj: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
        """Converts a datetime object to a formatted string."""
        return dt_obj.strftime(format_str)

    def time_difference(dt1: datetime, dt2: datetime) -> timedelta:
        """Calculates the difference between two datetime objects."""
        return abs(dt1 - dt2) # abs() ensures positive duration

    # Usage:
    # timestamp = get_current_timestamp() # e.g., "2025-04-28_19-09-20"
    # print(f"Current Timestamp: {timestamp}")
    # dt = string_to_datetime("2023-10-26", "%Y-%m-%d")
    # if dt:
    #    print(f"Parsed datetime: {dt}")
    #    future_date = dt + timedelta(days=7)
    #    print(f"One week later: {datetime_to_string(future_date)}")
    ```

**5. Web Interaction**

* **Simple GET Request**
    *   **What it does:** Fetches content from a web URL using an HTTP GET request.
    *   **Why you use it:** To retrieve data from web APIs, download files, or scrape simple web pages.
    *   [See standalone snippet: snippets/web_interaction.py](./snippets/web_interaction.py)
    ```python
    import requests

    def fetch_url_data(url: str) -> requests.Response | None:
        """Performs a GET request to a URL and returns the Response object."""
        try:
            response = requests.get(url, timeout=10) # Add timeout
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            print(f"Successfully fetched data from {url} (Status: {response.status_code})")
            return response
        except requests.exceptions.RequestException as e:
            print(f"Error fetching URL {url}: {e}")
            return None

    # Usage:
    # api_url = "https://api.github.com/users/google"
    # response = fetch_url_data(api_url)
    # if response:
    #     try:
    #         data = response.json() # Assuming the response is JSON
    #         print(f"GitHub user '{data.get('login')}' has {data.get('public_repos')} public repos.")
    #     except requests.exceptions.JSONDecodeError:
    #         print("Response was not valid JSON.")
    #         # print(response.text) # Print raw text if not JSON
    ```

**6. NumPy Basics (Numerical Computing)**

* **Creating NumPy Arrays**
    *   **What it does:** Demonstrates creating NumPy ndarrays (n-dimensional arrays).
    *   **Why you use it:** NumPy arrays are the foundation for numerical computing in Python, offering efficient storage and operations for numerical data compared to standard Python lists.
    *   [See standalone snippet: snippets/numpy_basics.py](./snippets/numpy_basics.py)
    ```python
    import numpy as np

    # From list
    arr_from_list = np.array([1, 2, 3, 4, 5])

    # Zeros, Ones
    zeros_arr = np.zeros((3, 4)) # 3x4 array of zeros
    ones_arr = np.ones(5, dtype=int) # 1D array of 5 ones (integers)

    # Range of numbers
    range_arr = np.arange(0, 10, 2) # Like Python range: [0, 2, 4, 6, 8]
    linspace_arr = np.linspace(0, 1, 5) # 5 numbers evenly spaced between 0 and 1 (inclusive)

    # print("Array from list:", arr_from_list)
    # print("Zeros array:\n", zeros_arr)
    # print("Ones array:", ones_arr)
    # print("Arange array:", range_arr)
    # print("Linspace array:", linspace_arr)
    ```

* **Basic Array Operations (Vectorization)**
    *   **What it does:** Shows how standard arithmetic operations work element-wise on NumPy arrays.
    *   **Why you use it:** Vectorization allows performing operations on entire arrays efficiently without writing explicit Python loops, leading to much faster computations for numerical tasks.
    *   [See standalone snippet: snippets/numpy_basics.py](./snippets/numpy_basics.py)
    ```python
    import numpy as np

    a = np.array([1, 2, 3])
    b = np.array([4, 5, 6])

    # Element-wise operations
    sum_arr = a + b         # [5, 7, 9]
    diff_arr = a - b        # [-3, -3, -3]
    prod_arr = a * b        # [4, 10, 18]
    div_arr = a / b         # [0.25, 0.4, 0.5]
    scalar_prod = a * 2     # [2, 4, 6]

    # Mathematical functions
    sqrt_arr = np.sqrt(a)   # [1. , 1.41421356, 1.73205081]
    exp_arr = np.exp(a)     # [ 2.71828183,  7.3890561 , 20.08553692]

    # Dot product
    dot_product = np.dot(a, b) # 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
    # Or: dot_product = a @ b

    # print("a + b =", sum_arr)
    # print("a * 2 =", scalar_prod)
    # print("sqrt(a) =", sqrt_arr)
    # print("Dot product a.b =", dot_product)
    ```

**7. Pandas Basics (Data Manipulation)**

* **Selecting Columns and Rows (`loc`, `iloc`)**
    *   **What it does:** Extracts specific subsets of data from a pandas DataFrame based on row/column labels or integer positions.
    *   **Why you use it:** Fundamental for accessing the data you need for analysis, filtering, or updates within a DataFrame.
    *   [See standalone snippet: snippets/pandas_basics.py](./snippets/pandas_basics.py)
    ```python
    import pandas as pd
    import numpy as np

    # Sample DataFrame
    data = {'col1': [1, 2, 3, 4], 'col2': [5, 6, 7, 8], 'col3': ['A', 'B', 'C', 'D']}
    df = pd.DataFrame(data, index=['row1', 'row2', 'row3', 'row4'])

    # Select columns by name
    col2_data = df['col2']          # Returns a Series
    cols1_3_data = df[['col1', 'col3']] # Returns a DataFrame

    # Select rows by label (loc)
    row2_data = df.loc['row2']      # Returns a Series (row data)
    rows1_3_data = df.loc[['row1', 'row3']] # Returns a DataFrame

    # Select rows and columns by label (loc)
    value_row2_col3 = df.loc['row2', 'col3'] # Returns the value ('B')
    subset = df.loc[['row1', 'row4'], ['col1', 'col2']] # DataFrame subset

    # Select rows by integer position (iloc)
    first_row = df.iloc[0]          # Returns a Series (first row)
    first_two_rows = df.iloc[0:2]   # Returns a DataFrame (rows 0 and 1)

    # Select rows and columns by integer position (iloc)
    value_0_1 = df.iloc[0, 1]       # Value at row 0, col 1 (which is 5)
    subset_iloc = df.iloc[1:3, 0:2] # Rows 1, 2 and Cols 0, 1

    # print("Original DataFrame:\n", df)
    # print("\nColumn 'col2':\n", col2_data)
    # print("\nRows 'row1', 'row3':\n", rows1_3_data)
    # print("\nValue at 'row2', 'col3':", value_row2_col3)
    # print("\nFirst row (iloc[0]):\n", first_row)
    # print("\nSubset using iloc[1:3, 0:2]:\n", subset_iloc)
    ```

* **Filtering Data**
    *   **What it does:** Selects rows from a DataFrame that meet specific criteria or conditions.
    *   **Why you use it:** To isolate relevant data points for analysis, remove outliers, or prepare data subsets for specific processing steps.
    *   [See standalone snippet: snippets/pandas_basics.py](./snippets/pandas_basics.py)
    ```python
    import pandas as pd
    # Using the same df from previous example

    # Filter rows based on column value
    filter1 = df['col1'] > 2
    filtered_df1 = df[filter1]
    # Or concisely: filtered_df1 = df[df['col1'] > 2]

    # Multiple conditions (& for AND, | for OR) - use parentheses!
    filter2 = (df['col1'] > 1) & (df['col3'] == 'C')
    filtered_df2 = df[filter2]

    # Using .query() method (often more readable)
    filtered_df3 = df.query('col1 > 2 and col3 != "A"')

    # print("Original DataFrame:\n", df)
    # print("\nFiltered where col1 > 2:\n", filtered_df1)
    # print("\nFiltered where col1 > 1 AND col3 == 'C':\n", filtered_df2)
    # print("\nFiltered using query('col1 > 2 and col3 != \"A\"'):\n", filtered_df3)
    ```

* **Handling Missing Data (`NaN`)**
    *   **What it does:** Provides methods to detect, remove, or replace missing values (often represented as `NaN`) in a DataFrame.
    *   **Why you use it:** Missing data can cause errors in calculations or bias analysis results. These techniques are essential for data cleaning and preparation.
    *   [See standalone snippet: snippets/missing_data_handling.py](./snippets/missing_data_handling.py)
    ```python
    import pandas as pd
    import numpy as np

    data_nan = {'colA': [1, np.nan, 3, 4, np.nan], 'colB': [5, 6, np.nan, 8, 9]}
    df_nan = pd.DataFrame(data_nan)

    # Check for missing values
    missing_values = df_nan.isnull() # DataFrame of True/False
    missing_counts = df_nan.isnull().sum() # Series with counts per column

    # Drop rows with any missing values
    df_dropped_rows = df_nan.dropna()

    # Drop columns with any missing values
    df_dropped_cols = df_nan.dropna(axis=1)

    # Fill missing values with a specific value (e.g., 0)
    df_filled_zero = df_nan.fillna(0)

    # Fill missing values with the mean of the column (only works for numeric columns)
    mean_A = df_nan['colA'].mean()
    df_filled_mean = df_nan.copy() # Avoid modifying original DataFrame directly if needed later
    df_filled_mean['colA'].fillna(mean_A, inplace=True)
    # Or fill all numeric columns with their respective means:
    # df_filled_means = df_nan.fillna(df_nan.mean(numeric_only=True))


    # print("Original DataFrame with NaN:\n", df_nan)
    # print("\nMissing value counts:\n", missing_counts)
    # print("\nDataFrame after dropping rows with NaN:\n", df_dropped_rows)
    # print("\nDataFrame after filling NaN with 0:\n", df_filled_zero)
    # print("\nDataFrame after filling colA NaN with mean:\n", df_filled_mean)
    ```

* **Grouping and Aggregation (`groupby`)**
    *   **What it does:** Groups rows in a DataFrame based on the values in one or more columns, then applies aggregation functions (like sum, mean, count) to other columns within each group.
    *   **Why you use it:** Powerful technique for summarizing data by category, calculating group-level statistics, and understanding variations across different segments of the data.
    *   [See standalone snippet: snippets/grouping_aggregation.py](./snippets/grouping_aggregation.py)
    ```python
    import pandas as pd

    data_group = {'Category': ['A', 'B', 'A', 'B', 'A'],
                  'Value': [10, 20, 15, 25, 12],
                  'Count': [1, 2, 3, 1, 2]}
    df_group = pd.DataFrame(data_group)

    # Group by 'Category' and calculate the sum of 'Value'
    sum_by_category = df_group.groupby('Category')['Value'].sum()

    # Group by 'Category' and calculate multiple aggregations
    agg_by_category = df_group.groupby('Category').agg(
        total_value=('Value', 'sum'),
        average_value=('Value', 'mean'),
        max_count=('Count', 'max'),
        num_records=('Value', 'size') # 'size' counts rows in each group
    )

    # print("Original DataFrame:\n", df_group)
    # print("\nSum of 'Value' by 'Category':\n", sum_by_category)
    # print("\nAggregated results by 'Category':\n", agg_by_category)
    ```

---

**Considerations for Your Library:**

1.  **Modularity:** Keep functions focused on a single task.
2.  **Docstrings:** Write clear docstrings explaining what each function does, its parameters (including types), and what it returns. Use a standard format (like Google style or NumPy style).
3.  **Type Hinting:** Use type hints (e.g., `filepath: str | Path`, `-> list[str]`) for better code clarity and maintainability. Requires Python 3.5+ (union types `|` require 3.10+ or `from typing import Union`).
4.  **Error Handling:** Include `try...except` blocks for operations that might fail (like file I/O, web requests) and provide informative error messages or log them.
5.  **Dependencies:** Clearly list external dependencies (`numpy`, `pandas`, `requests`).
6.  **Testing:** Write unit tests (using `unittest` or `pytest`) for your library functions to ensure they work correctly.
7.  **Naming Conventions:** Follow PEP 8 guidelines for naming functions (lowercase_with_underscores) and variables.
8.  **Virtual Environments:** Always develop and test your library within a dedicated virtual environment (`venv` or `conda`) to manage dependencies.

This collection provides a strong foundation for common tasks. You can expand it further based on the specific needs of the engineers and data scientists using your library.