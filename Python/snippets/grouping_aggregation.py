import pandas as pd # Import pandas for DataFrame manipulation.

def group_and_aggregate(df: pd.DataFrame, group_by_column: str, agg_config: dict) -> pd.DataFrame:
    """Groups a DataFrame by a column and performs aggregations based on the configuration.

    Args:
        df: The input pandas DataFrame.
        group_by_column: The name of the column to group by.
        agg_config: A dictionary specifying the aggregations.
                     Keys are the names of the new aggregated columns.
                     Values are tuples: (column_to_aggregate_on, aggregation_function_string).
                     Example: {'total_value': ('Value', 'sum'), 'avg_count': ('Count', 'mean')}

    Returns:
        A pandas DataFrame with the grouped and aggregated results, or an empty DataFrame on error.
    """
    try:
        # Group the DataFrame by the specified column.
        # Apply the aggregation functions defined in agg_config.
        # The `**agg_config` unpacks the dictionary for the .agg() method (named aggregation).
        aggregated_df = df.groupby(group_by_column).agg(**agg_config)
        # Return the resulting aggregated DataFrame.
        return aggregated_df
    except KeyError as e:
        # Handle cases where the group_by_column or a column in agg_config doesn't exist.
        print(f"Error: Column not found - {e}")
        return pd.DataFrame() # Return empty DataFrame.
    except Exception as e:
        # Handle any other errors during the process.
        print(f"Error during grouping and aggregation: {e}")
        return pd.DataFrame() # Return empty DataFrame.

# Example usage:
# data = {'Category': ['A', 'B', 'A', 'B', 'A'],
#         'Value': [10, 20, 15, 25, 12],
#         'Count': [1, 2, 3, 1, 2]}
# df = pd.DataFrame(data)
# # Define the aggregation configuration.
# agg_config = {
#     'total_value': ('Value', 'sum'),        # Sum of 'Value' column, named 'total_value'
#     'average_value': ('Value', 'mean'),     # Mean of 'Value' column, named 'average_value'
#     'max_count': ('Count', 'max'),         # Max of 'Count' column, named 'max_count'
#     'num_records': ('Value', 'size')        # Count of records in each group, named 'num_records'
# }
# result = group_and_aggregate(df, 'Category', agg_config)
# print("Aggregated Results:")
# print(result)