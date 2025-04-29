import pandas as pd

def group_and_aggregate(df: pd.DataFrame, group_by_column: str, agg_config: dict) -> pd.DataFrame:
    """Groups a DataFrame by a column and performs aggregations based on the configuration."""
    try:
        aggregated_df = df.groupby(group_by_column).agg(**agg_config)
        return aggregated_df
    except Exception as e:
        print(f"Error during grouping and aggregation: {e}")
        return pd.DataFrame()

# Example usage:
# data = {'Category': ['A', 'B', 'A', 'B', 'A'],
#         'Value': [10, 20, 15, 25, 12],
#         'Count': [1, 2, 3, 1, 2]}
# df = pd.DataFrame(data)
# agg_config = {
#     'total_value': ('Value', 'sum'),
#     'average_value': ('Value', 'mean'),
#     'max_count': ('Count', 'max'),
#     'num_records': ('Value', 'size')
# }
# result = group_and_aggregate(df, 'Category', agg_config)
# print(result)