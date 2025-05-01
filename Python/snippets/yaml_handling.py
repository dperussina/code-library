import yaml # Import the PyYAML library for working with YAML files.
from pathlib import Path # Import Path for object-oriented filesystem paths.

def load_yaml_config(filepath: str | Path) -> dict | None:
    """Loads configuration or data from a YAML file using yaml.safe_load.

    Args:
        filepath: The path (string or Path object) to the YAML file.

    Returns:
        A Python dictionary representing the YAML content, or None if loading fails.
    """
    try:
        # Open the YAML file in read mode ('r') with UTF-8 encoding.
        with open(filepath, 'r', encoding='utf-8') as f:
            # Use yaml.safe_load to parse the YAML file.
            # safe_load is preferred over load as it prevents arbitrary code execution
            # from untrusted YAML sources.
            config = yaml.safe_load(f)
        # Return the parsed data (usually a dictionary).
        return config
    except FileNotFoundError:
        # Handle the case where the file does not exist.
        print(f"Error: YAML file not found at {filepath}")
        return None
    except yaml.YAMLError as e:
        # Handle errors during YAML parsing (e.g., invalid syntax).
        # YAMLError is the base class for PyYAML errors.
        print(f"Error parsing YAML file {filepath}: {e}")
        return None
    except Exception as e:
        # Handle other potential file reading errors.
        print(f"An unexpected error occurred reading {filepath}: {e}")
        return None

def save_yaml_config(filepath: str | Path, data: dict, default_flow_style=False):
    """Saves a Python dictionary to a YAML file.

    Args:
        filepath: The path (string or Path object) where the YAML file will be saved.
        data: The Python dictionary to save.
        default_flow_style: If False (default), uses block style. If True, uses flow style (inline).
    """
    try:
        # Open the file in write mode ('w') with UTF-8 encoding.
        with open(filepath, 'w', encoding='utf-8') as f:
            # Use yaml.dump to serialize the Python dictionary to YAML format.
            # allow_unicode=True ensures Unicode characters are handled correctly.
            # default_flow_style=False creates a more readable block-style YAML.
            # sort_keys=False preserves the original order of keys in the dictionary.
            yaml.dump(data, f, allow_unicode=True, default_flow_style=default_flow_style, sort_keys=False)
        print(f"Data successfully saved to YAML file: {filepath}")
    except Exception as e:
        # Handle errors during YAML serialization or file writing.
        print(f"Error saving data to YAML file {filepath}: {e}")

# Example Usage:
# config_data = {'database': {'host': 'localhost', 'port': 5432}, 'user': 'admin'}
# save_yaml_config("config.yaml", config_data)
# loaded_config = load_yaml_config("config.yaml")
# if loaded_config:
#    print("Loaded Config:", loaded_config)