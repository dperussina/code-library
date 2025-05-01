import asyncio # Import the library for writing concurrent code using the async/await syntax.
import aiohttp # Import the asynchronous HTTP client/server library.
import time # Import the time module for performance timing.

# Define an asynchronous function to fetch a single URL.
async def fetch_url_async(session: aiohttp.ClientSession, url: str) -> tuple[str, int, int | None]:
    """Asynchronously fetches a URL and returns URL, status, and content length."""
    try:
        # Perform an asynchronous GET request using the provided session.
        # Set a timeout for the request.
        async with session.get(url, timeout=10) as response:
            # Asynchronously read the response content.
            content = await response.read()
            # Return the URL, HTTP status code, and the length of the content.
            return url, response.status, len(content)
    except Exception as e:
        # Handle exceptions (e.g., timeouts, connection errors).
        # Return the URL, an error status code (-1), and None for length.
        print(f"Error fetching {url}: {e}") # Optional: log or print the error
        return url, -1, None

# Define an asynchronous function to run multiple fetch operations concurrently.
async def run_concurrent_io(urls: list[str]):
    """Fetches multiple URLs concurrently using asyncio and aiohttp."""
    # Record the start time.
    start_time = time.perf_counter()
    # Create an asynchronous HTTP session that can be reused for multiple requests.
    async with aiohttp.ClientSession() as session:
        # Create a list of tasks, one for each URL, calling fetch_url_async.
        tasks = [fetch_url_async(session, url) for url in urls]
        # Run all tasks concurrently and wait for them to complete.
        # asyncio.gather collects results or exceptions from the tasks.
        # return_exceptions=True ensures that exceptions are returned as results rather than stopping the gather.
        results = await asyncio.gather(*tasks, return_exceptions=True)
    # Record the end time.
    end_time = time.perf_counter()
    # Print the total time taken.
    print(f"I/O-bound concurrent fetching finished in {end_time - start_time:.4f} secs")
    # Return the list of results (or exceptions) from the tasks.
    return results