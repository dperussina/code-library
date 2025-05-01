import numpy as np # Import NumPy for numerical arrays.
from scipy.optimize import minimize # Import the minimize function for optimization.

# Define the function to be minimized (objective function).
# This example uses the Rosenbrock function, a common benchmark for optimization algorithms.
def objective_function(params: np.ndarray, *args) -> float:
    """Example objective function (Rosenbrock) to minimize."""
    # Unpack the parameters (variables to optimize).
    x, y = params
    # Any additional fixed arguments passed via minimize's 'args' parameter would be in *args.
    # Calculate and return the function value.
    # The goal is to find the values of x and y that make this return value as small as possible.
    return (1 - x)**2 + 100 * (y - x**2)**2

def find_minimum(func, initial_guess: np.ndarray, method: str = 'BFGS', func_args=()):
    """Finds the minimum of a scalar function using scipy.optimize.minimize.

    Args:
        func: The objective function to be minimized. Must take a NumPy array of parameters
              as the first argument and return a scalar value.
        initial_guess: An initial guess for the parameters (NumPy array).
                       The optimization algorithm starts searching from this point.
        method: The optimization algorithm to use (e.g., 'BFGS', 'Nelder-Mead', 'CG', 'L-BFGS-B').
                See SciPy documentation for available methods and their characteristics.
        func_args: A tuple of extra fixed arguments to pass to the objective function `func`.

    Returns:
        The optimization result object (OptimizeResult) from SciPy, which contains information
        like the optimal parameters (`result.x`), the minimum function value (`result.fun`),
        success status (`result.success`), and messages.
        Returns None if an error occurs.
    """
    try:
        # Call the minimize function.
        # - func: The objective function.
        # - initial_guess: Starting point for the optimization.
        # - args: Extra arguments for the objective function.
        # - method: The optimization algorithm.
        result = minimize(func, initial_guess, args=func_args, method=method)

        # Check if the optimization was successful.
        if result.success:
            print(f"Optimization successful using {method}: {result.message}")
        else:
            # Print a warning if the optimization did not converge or failed.
            print(f"Optimization FAILED using {method}: {result.message}")
        # Return the full result object.
        return result
    except Exception as e:
        # Handle errors that might occur during the optimization process.
        print(f"Error during optimization with method {method}: {e}")
        return None