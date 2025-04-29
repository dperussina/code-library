import asyncio
import aiohttp
import time

async def fetch_url_async(session: aiohttp.ClientSession, url: str) -> tuple[str, int, int | None]:
    """Asynchronously fetches a URL and returns URL, status, and content length."""
    try:
        async with session.get(url, timeout=10) as response:
            content = await response.read()
            return url, response.status, len(content)
    except Exception as e:
        return url, -1, None

async def run_concurrent_io(urls: list[str]):
    """Fetches multiple URLs concurrently using asyncio and aiohttp."""
    start_time = time.perf_counter()
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url_async(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
    end_time = time.perf_counter()
    print(f"I/O-bound concurrent fetching finished in {end_time - start_time:.4f} secs")
    return results