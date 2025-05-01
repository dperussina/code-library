from memory_profiler import profile # Import the profile decorator for line-by-line memory usage analysis.
import time # Import time for pausing execution.
import numpy as np # Import NumPy for numerical operations, especially large arrays.

# Apply the @profile decorator to the function you want to profile.
# This requires running the script via `python -m memory_profiler your_script.py`
@profile
def process_large_data(size_mb):
    """Function that allocates significant memory."""
    print(f"Allocating array of roughly {size_mb} MB...")
    # Calculate the number of 64-bit float elements (8 bytes each) needed for the target size.
    num_elements = int((size_mb * 1024 * 1024) / 8)
    try:
        # Create a large NumPy array filled with random numbers.
        # This is the primary memory allocation step.
        large_array = np.random.rand(num_elements)
        # Perform some operation on the array.
        result = np.sum(large_array)
        # Pause briefly to allow memory measurement if needed.
        time.sleep(1)
        # Return the result.
        return result
    except MemoryError:
        # Handle the case where the system cannot allocate the requested memory.
        print("MemoryError: Could not allocate the requested array.")
        return None