import pandas as pd
import numpy as np

def handle_missing_data(df: pd.DataFrame) -> dict:
    """Handles missing data in a DataFrame by dropping rows, filling with zeros, and filling with column means."""
    try:
        dropped_rows = df.dropna()
        filled_zero = df.fillna(0)
        filled_mean = df.copy()
        for column in df.select_dtypes(include=[np.number]).columns:
            mean_value = df[column].mean()
            filled_mean[column].fillna(mean_value, inplace=True)
        return {
            'dropped_rows': dropped_rows,
            'filled_zero': filled_zero,
            'filled_mean': filled_mean
        }
    except Exception as e:
        print(f"Error handling missing data: {e}")
        return {}

# Example usage:
# data_nan = {'colA': [1, np.nan, 3, 4, np.nan], 'colB': [5, 6, np.nan, 8, 9]}
# df_nan = pd.DataFrame(data_nan)
# results = handle_missing_data(df_nan)
# print(results['dropped_rows'])
# print(results['filled_zero'])
# print(results['filled_mean'])