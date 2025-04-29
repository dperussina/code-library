import numpy as np

def create_numpy_arrays():
    """Demonstrates creating various types of NumPy arrays."""
    arr_from_list = np.array([1, 2, 3, 4, 5])
    zeros_arr = np.zeros((3, 4)) # 3x4 array of zeros
    ones_arr = np.ones(5, dtype=int) # 1D array of 5 ones (integers)
    range_arr = np.arange(0, 10, 2) # Like Python range: [0, 2, 4, 6, 8]
    linspace_arr = np.linspace(0, 1, 5) # 5 numbers evenly spaced between 0 and 1 (inclusive)
    return arr_from_list, zeros_arr, ones_arr, range_arr, linspace_arr

def basic_array_operations():
    """Demonstrates basic element-wise operations on NumPy arrays."""
    a = np.array([1, 2, 3])
    b = np.array([4, 5, 6])
    sum_arr = a + b         # [5, 7, 9]
    diff_arr = a - b        # [-3, -3, -3]
    prod_arr = a * b        # [4, 10, 18]
    div_arr = a / b         # [0.25, 0.4, 0.5]
    scalar_prod = a * 2     # [2, 4, 6]
    dot_product = np.dot(a, b) # 1*4 + 2*5 + 3*6 = 32
    return sum_arr, diff_arr, prod_arr, div_arr, scalar_prod, dot_product