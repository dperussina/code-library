from memory_profiler import profile
import time
import numpy as np

@profile
def process_large_data(size_mb):
    """Function that allocates significant memory."""
    print(f"Allocating array of roughly {size_mb} MB...")
    num_elements = int((size_mb * 1024 * 1024) / 8)
    try:
        large_array = np.random.rand(num_elements)
        result = np.sum(large_array)
        time.sleep(1)
        return result
    except MemoryError:
        print("MemoryError: Could not allocate the requested array.")
        return None