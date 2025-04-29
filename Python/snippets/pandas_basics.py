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

def handle_missing_data():
    """Demonstrates handling missing data in a DataFrame."""
    data_nan = {'colA': [1, np.nan, 3, 4, np.nan], 'colB': [5, 6, np.nan, 8, 9]}
    df_nan = pd.DataFrame(data_nan)
    df_dropped_rows = df_nan.dropna()
    df_filled_zero = df_nan.fillna(0)
    mean_A = df_nan['colA'].mean()
    df_filled_mean = df_nan.copy()
    df_filled_mean['colA'].fillna(mean_A, inplace=True)
    return df_dropped_rows, df_filled_zero, df_filled_mean