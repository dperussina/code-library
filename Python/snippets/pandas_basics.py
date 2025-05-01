import pandas as pd
import numpy as np

def create_sample_dataframe():
    """Creates a sample pandas DataFrame for demonstration purposes."""
    data = {'col1': [1, 2, 3, 4], 'col2': [5, 6, 7, 8], 'col3': ['A', 'B', 'C', 'D']}
    df = pd.DataFrame(data, index=['row1', 'row2', 'row3', 'row4'])
    return df

def filter_dataframe(df: pd.DataFrame):
    """Demonstrates filtering rows in a DataFrame based on conditions."""
    filter1 = df['col1'] > 2
    filtered_df1 = df[filter1]
    filter2 = (df['col1'] > 1) & (df['col3'] == 'C')
    filtered_df2 = df[filter2]
    filtered_df3 = df.query('col1 > 2 and col3 != "A"')
    return filtered_df1, filtered_df2, filtered_df3

def handle_missing_data_demo(df_nan: pd.DataFrame):
    """Demonstrates basic strategies for handling missing data (NaN) in a DataFrame.

    Args:
        df_nan: A DataFrame potentially containing NaN values.

    Returns:
        A tuple containing:
        - df_dropped_rows: DataFrame with rows containing any NaN dropped.
        - df_filled_zero: DataFrame with NaNs filled with 0.
        - df_filled_mean: DataFrame with NaNs in 'colA' filled with the mean of 'colA'.
    """
    df_dropped_rows = df_nan.dropna()
    df_filled_zero = df_nan.fillna(0)
    mean_A = df_nan['colA'].mean()
    df_filled_mean = df_nan.copy()
    df_filled_mean['colA'].fillna(mean_A, inplace=True)
    return df_dropped_rows, df_filled_zero, df_filled_mean