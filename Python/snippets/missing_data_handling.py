import pandas as pd # Import pandas for DataFrame operations.
import numpy as np # Import numpy, primarily for np.nan and numerical types.

def handle_missing_data(df: pd.DataFrame) -> dict:
    """Handles missing data in a DataFrame by demonstrating three common strategies:
       1. Dropping rows with any NaN values.
       2. Filling NaN values with 0.
       3. Filling NaN values with the mean of their respective columns (for numerical columns).

    Args:
        df: The input pandas DataFrame potentially containing missing values (NaN).

    Returns:
        A dictionary containing DataFrames resulting from each strategy:
        {'dropped_rows': DataFrame, 'filled_zero': DataFrame, 'filled_mean': DataFrame}
        Returns an empty dictionary if an error occurs.
    """
    try:
        # 1. Drop rows containing any NaN values.
        # Creates a new DataFrame, doesn't modify the original df.
        dropped_rows = df.dropna()

        # 2. Fill all NaN values with 0.
        # Creates a new DataFrame, doesn't modify the original df.
        filled_zero = df.fillna(0)

        # 3. Fill NaN values with the mean of each numerical column.
        # Create a copy to avoid modifying the original DataFrame indirectly.
        filled_mean = df.copy()
        # Iterate through columns that contain numerical data.
        for column in filled_mean.select_dtypes(include=[np.number]).columns:
            # Calculate the mean of the current column, ignoring NaNs.
            mean_value = filled_mean[column].mean()
            # Fill NaN values in this specific column with the calculated mean.
            # inplace=True modifies the 'filled_mean' DataFrame directly.
            filled_mean[column].fillna(mean_value, inplace=True)

        # Return the results in a dictionary.
        return {
            'dropped_rows': dropped_rows,
            'filled_zero': filled_zero,
            'filled_mean': filled_mean
        }
    except Exception as e:
        # Handle potential errors during processing.
        print(f"Error handling missing data: {e}")
        return {} # Return an empty dictionary on error.

# Example usage:
# data_nan = {'colA': [1, np.nan, 3, 4, np.nan], 'colB': [5, 6, np.nan, 8, 9], 'colC': ['x', 'y', 'z', np.nan, 'w']}
# df_nan = pd.DataFrame(data_nan)
# print("Original DataFrame:")
# print(df_nan)
# results = handle_missing_data(df_nan)
# print("\nDataFrame after dropping rows with NaN:")
# print(results['dropped_rows'])
# print("\nDataFrame after filling NaN with 0:")
# print(results['filled_zero'])
# print("\nDataFrame after filling NaN with column mean:")
# print(results['filled_mean'])