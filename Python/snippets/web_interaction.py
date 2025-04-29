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