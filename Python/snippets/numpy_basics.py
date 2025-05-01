import numpy as np

def create_numpy_arrays():
    """Demonstrates creating various types of NumPy arrays."""
    # Create an array from a Python list.
    arr_from_list = np.array([1, 2, 3, 4, 5])
    # Create an array filled with zeros. Takes a shape tuple.
    zeros_arr = np.zeros((3, 4)) # Creates a 3x4 array of floating-point zeros.
    # Create an array filled with ones. Can specify the data type (dtype).
    ones_arr = np.ones(5, dtype=int) # Creates a 1D array of 5 integer ones.
    # Create an array with a range of values (similar to Python's range).
    range_arr = np.arange(0, 10, 2) # Creates [0, 2, 4, 6, 8]. Stop value is exclusive.
    # Create an array with evenly spaced values over a specified interval.
    linspace_arr = np.linspace(0, 1, 5) # Creates 5 numbers evenly spaced between 0 and 1 (inclusive).
    # Return all created arrays.
    return arr_from_list, zeros_arr, ones_arr, range_arr, linspace_arr

def basic_array_operations():
    """Demonstrates basic element-wise operations and dot product on NumPy arrays."""
    # Define two sample arrays.
    a = np.array([1, 2, 3])
    b = np.array([4, 5, 6])

    # Element-wise addition.
    sum_arr = a + b         # Result: [5, 7, 9]
    # Element-wise subtraction.
    diff_arr = a - b        # Result: [-3, -3, -3]
    # Element-wise multiplication.
    prod_arr = a * b        # Result: [4, 10, 18]
    # Element-wise division.
    div_arr = a / b         # Result: [0.25, 0.4, 0.5]
    # Scalar multiplication (multiply every element by 2).
    scalar_prod = a * 2     # Result: [2, 4, 6]
    # Calculate the dot product of the two vectors.
    dot_product = np.dot(a, b) # Calculation: 1*4 + 2*5 + 3*6 = 32
    # Return the results of the operations.
    return sum_arr, diff_arr, prod_arr, div_arr, scalar_prod, dot_product