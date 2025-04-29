import time
import math
from joblib import Parallel, delayed

def moderately_heavy_task(item, factor):
    """Example task suitable for joblib."""
    result = 0
    for i in range(10**5):
        result += math.sin(item * factor / (i+1))
    return item, result

def run_parallel_joblib(data: list, factor: float, n_jobs: int = -1, backend: str = "loky"):
    """Processes data in parallel using joblib."""
    start_time = time.perf_counter()
    results = Parallel(n_jobs=n_jobs, backend=backend)(
        delayed(moderately_heavy_task)(item, factor) for item in data
    )
    end_time = time.perf_counter()
    print(f"Joblib parallel processing (backend='{backend}') finished in {end_time - start_time:.4f} secs")
    return results