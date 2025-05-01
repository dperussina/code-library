import requests # Import the requests library for making HTTP requests.

def fetch_url_data(url: str, timeout: int = 10) -> requests.Response | None:
    """Performs an HTTP GET request to a URL and returns the Response object.

    Includes basic error handling and a timeout.

    Args:
        url: The URL to fetch data from.
        timeout: The maximum time (in seconds) to wait for the server to send data.

    Returns:
        A requests.Response object if the request is successful (status code 2xx),
        otherwise None.
    """
    try:
        # Send a GET request to the specified URL.
        # timeout specifies how long to wait for a response before giving up.
        response = requests.get(url, timeout=timeout)

        # Check if the request resulted in an HTTP error (status code 4xx or 5xx).
        # If it did, this will raise an requests.exceptions.HTTPError.
        response.raise_for_status()

        # If no error was raised, the request was successful (status code 2xx).
        print(f"Successfully fetched data from {url} (Status: {response.status_code})")
        # Return the full Response object, which contains status code, headers, content, etc.
        return response

    # Catch potential exceptions from the requests library.
    # This includes connection errors, timeout errors, HTTP errors, etc.
    except requests.exceptions.RequestException as e:
        # Print an error message including the specific exception.
        print(f"Error fetching URL {url}: {e}")
        # Return None to indicate failure.
        return None

# Example usage:
# response = fetch_url_data("https://httpbin.org/get")
# if response:
#     print("Response Content:", response.json()) # Assuming JSON content
# response_fail = fetch_url_data("https://httpbin.org/status/404") # Example of a failed request