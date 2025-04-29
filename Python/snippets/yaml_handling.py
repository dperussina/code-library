import yaml
from pathlib import Path

def load_yaml_config(filepath: str | Path) -> dict | None:
    """Loads configuration from a YAML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        return config
    except FileNotFoundError:
        print(f"Error: YAML file not found at {filepath}")
        return None
    except yaml.YAMLError as e:
        print(f"Error parsing YAML file {filepath}: {e}")
        return None