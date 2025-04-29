**1. Concurrency and Parallelism**

* **CPU-Bound Parallelism with `multiprocessing`:**
    * Best for tasks that are limited by CPU speed and can be broken down into independent chunks. Avoids Python's Global Interpreter Lock (GIL) by using separate processes.
    * Requires: Standard library (`multiprocessing`)
    ```python
    import multiprocessing
    import time
    import math

    def heavy_computation(item):
        """Example CPU-intensive function."""
        result = 0
        for _ in range(10**6): # Simulate work
             result += math.sqrt(item * math.pi)
        # print(f"Processed {item}") # Uncomment for debug, noisy in parallel
        return item, result

    def run_parallel_cpu(data: list, num_processes: int | None = None):
        """
        Processes data in parallel using multiprocessing.Pool.map.

        Args:
            data: A list of items to process.
            num_processes: Number of worker processes. Defaults to os.cpu_count().

        Returns:
            A list of results corresponding to the input data order.
        """
        if num_processes is None:
            num_processes = multiprocessing.cpu_count()
            print(f"Using default number of processes: {num_processes}")

        start_time = time.perf_counter()
        # Using 'with' ensures the pool is properly closed
        with multiprocessing.Pool(processes=num_processes) as pool:
            # pool.map applies the function to each item in data across processes
            # It preserves the order of results corresponding to the input data.
            results = pool.map(heavy_computation, data)
        end_time = time.perf_counter()
        print(f"CPU-bound parallel processing finished in {end_time - start_time:.4f} secs")
        return results

    # Usage:
    # input_data = list(range(1, 21)) # Example data
    # parallel_results = run_parallel_cpu(input_data, num_processes=4)
    # print(f"First 5 results: {parallel_results[:5]}")
    ```

* **I/O-Bound Concurrency with `asyncio`:**
    * Ideal for tasks that spend time waiting for external operations (network requests, disk I/O). Uses a single thread and an event loop to manage multiple tasks concurrently.
    * Requires: Standard library (`asyncio`), `aiohttp` (install via `pip install aiohttp aiodns`)
    ```python
    import asyncio
    import aiohttp
    import time

    async def fetch_url_async(session: aiohttp.ClientSession, url: str) -> tuple[str, int, int | None]:
        """Asynchronously fetches a URL and returns URL, status, and content length."""
        try:
            async with session.get(url, timeout=10) as response:
                # Read content to get length, but don't store it all if large
                content = await response.read()
                print(f"Fetched {url} with status {response.status}")
                return url, response.status, len(content)
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return url, -1, None # Indicate error

    async def run_concurrent_io(urls: list[str]):
        """Fetches multiple URLs concurrently using asyncio and aiohttp."""
        start_time = time.perf_counter()
        async with aiohttp.ClientSession() as session:
            # Create a list of tasks (coroutines to be run)
            tasks = [fetch_url_async(session, url) for url in urls]
            # Run tasks concurrently and gather results
            # return_exceptions=True prevents one failed task from stopping others
            results = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = time.perf_counter()
        print(f"I/O-bound concurrent fetching finished in {end_time - start_time:.4f} secs")
        return results # Results preserve order of input URLs

    # Usage (needs to be run within an async context or using asyncio.run):
    # urls_to_fetch = [
    #     "https://www.google.com",
    #     "https://www.github.com",
    #     "https://www.python.org",
    #     "https://httpbin.org/delay/1", # Simulate a delay
    #     "https://invalid-url-example.xyz" # Example of a failing one
    # ]
    # async def main():
    #      io_results = await run_concurrent_io(urls_to_fetch)
    #      print("\nIO Results:")
    #      for result in io_results:
    #          if isinstance(result, Exception):
    #              print(f"  Task resulted in exception: {result}")
    #          else:
    #              url, status, length = result
    #              print(f"  URL: {url}, Status: {status}, Length: {length}")
    #
    # if __name__ == "__main__": # Check if running as script
    #      asyncio.run(main())
    ```

* **Simplified Parallelism with `joblib`:**
    * Often used in scientific computing (especially with scikit-learn). Provides a simple interface for parallelizing loops (`Parallel` and `delayed`). Can use processes (`loky` backend by default) or threads.
    * Requires: `joblib` (install via `pip install joblib`)
    ```python
    import time
    import math
    from joblib import Parallel, delayed

    def moderately_heavy_task(item, factor):
        """Example task suitable for joblib."""
        result = 0
        for i in range(10**5): # Less work than multiprocessing example
            result += math.sin(item * factor / (i+1))
        return item, result

    def run_parallel_joblib(data: list, factor: float, n_jobs: int = -1, backend: str = "loky"):
        """
        Processes data in parallel using joblib.

        Args:
            data: A list of items to process.
            factor: An additional argument for the task function.
            n_jobs: Number of parallel jobs. -1 means use all available CPUs.
            backend: Parallelization backend ('loky' for processes, 'threading' for threads).

        Returns:
            A list of results. Order is generally preserved but may depend on backend specifics.
        """
        start_time = time.perf_counter()
        # The 'delayed' function wraps the function call and its arguments
        # 'Parallel' executes these delayed calls in parallel
        results = Parallel(n_jobs=n_jobs, backend=backend)(
            delayed(moderately_heavy_task)(item, factor) for item in data
        )
        end_time = time.perf_counter()
        print(f"Joblib parallel processing (backend='{backend}') finished in {end_time - start_time:.4f} secs")
        return results

    # Usage:
    # input_data_jl = list(range(1, 51))
    # joblib_results = run_parallel_joblib(input_data_jl, factor=1.5, n_jobs=-1) # Use all cores
    # joblib_results_threaded = run_parallel_joblib(input_data_jl, factor=1.5, n_jobs=4, backend='threading') # Use 4 threads
    # print(f"First 5 joblib results: {joblib_results[:5]}")
    ```

---

**2. Performance and Efficient Data Handling**

* **Reading/Writing Apache Parquet Files:**
    * Columnar format, highly efficient for storage (compression) and reading (can select specific columns). Often much faster than CSV for large datasets.
    * Requires: `pandas`, `pyarrow` (install via `pip install pandas pyarrow`) or `fastparquet`. `pyarrow` is common.
    ```python
    import pandas as pd
    from pathlib import Path

    def save_dataframe_parquet(df: pd.DataFrame, filepath: str | Path, compression: str | None = 'snappy'):
        """Saves a Pandas DataFrame to Parquet format."""
        try:
            # Common compressions: 'snappy' (fast), 'gzip' (smaller size), 'brotli', None
            df.to_parquet(filepath, compression=compression, engine='pyarrow')
            print(f"DataFrame saved to {filepath} (compression: {compression})")
        except Exception as e:
            print(f"Error saving DataFrame to Parquet {filepath}: {e}")

    def load_dataframe_parquet(filepath: str | Path, columns: list[str] | None = None) -> pd.DataFrame | None:
        """Loads a Pandas DataFrame from Parquet format, optionally selecting columns."""
        path = Path(filepath)
        if not path.exists():
            print(f"Error: Parquet file not found at {filepath}")
            return None
        try:
            df = pd.read_parquet(filepath, columns=columns, engine='pyarrow')
            print(f"DataFrame loaded from {filepath} with shape {df.shape}")
            if columns:
                print(f"  (Loaded specific columns: {columns})")
            return df
        except Exception as e:
            print(f"Error loading DataFrame from Parquet {filepath}: {e}")
            return None

    # Usage:
    # Assuming 'my_dataframe' is a large pandas DataFrame
    # parquet_path = Path("my_data.parquet")
    # save_dataframe_parquet(my_dataframe, parquet_path, compression='snappy')
    #
    # # Load entire dataframe
    # loaded_df = load_dataframe_parquet(parquet_path)
    #
    # # Load only specific columns
    # specific_cols_df = load_dataframe_parquet(parquet_path, columns=['col1', 'col_timestamp', 'col_value'])
    # if specific_cols_df is not None:
    #     print(specific_cols_df.head())
    ```

* **Memory Profiling (Function Decorator):**
    * Useful for identifying memory bottlenecks in functions handling large data.
    * Requires: `memory_profiler` (install via `pip install memory_profiler`)
    ```python
    from memory_profiler import profile
    import time
    import numpy as np

    # Note: The @profile decorator prints memory usage line-by-line to stdout.
    # For programmatic access, you might need to use memory_profiler API differently.
    # This decorator is primarily for interactive analysis/debugging.
    @profile
    def process_large_data(size_mb):
        """Function that allocates significant memory."""
        print(f"Allocating array of roughly {size_mb} MB...")
        # Calculate number of float64 elements for target size
        # float64 is 8 bytes
        num_elements = int((size_mb * 1024 * 1024) / 8)
        try:
            large_array = np.random.rand(num_elements)
            print("Array allocated. Performing some operation...")
            result = np.sum(large_array) # Simulate work
            time.sleep(1) # Pause to observe memory
            print("Operation complete.")
            # Memory for large_array should be released when function exits
            return result
        except MemoryError:
            print("MemoryError: Could not allocate the requested array.")
            return None

    # Usage:
    # Run this from a script or interactive session where memory_profiler is installed.
    # The output will show memory usage increments line by line.
    # print("Running memory profile example:")
    # process_large_data(size_mb=500) # Allocate ~500 MB
    # print("Memory profile example finished.")
    ```

---

**3. Scientific Computing (SciPy)**

* **1D Interpolation:**
    * Estimating values between known data points along one dimension.
    * Requires: `numpy`, `scipy` (install via `pip install numpy scipy`)
    ```python
    import numpy as np
    from scipy.interpolate import interp1d
    # import matplotlib.pyplot as plt # Optional: for visualization

    def interpolate_1d(x_known: np.ndarray, y_known: np.ndarray, x_new: np.ndarray, kind: str = 'linear'):
        """
        Performs 1D interpolation.

        Args:
            x_known: X-coordinates of the known data points (must be increasing).
            y_known: Y-coordinates of the known data points.
            x_new: X-coordinates where interpolation is desired.
            kind: Type of interpolation ('linear', 'cubic', 'nearest', 'quadratic', etc.).

        Returns:
            A NumPy array of interpolated y-values corresponding to x_new.
        """
        if not np.all(np.diff(x_known) > 0):
             raise ValueError("x_known must be monotonically increasing.")
        try:
            # Create the interpolation function
            interp_func = interp1d(x_known, y_known, kind=kind, fill_value="extrapolate", bounds_error=False)
            # Apply the function to the new x values
            y_new = interp_func(x_new)
            return y_new
        except ValueError as e:
             print(f"Interpolation error: {e}")
             # Handle cases like x_new outside bounds if bounds_error=True (default)
             return np.full_like(x_new, np.nan) # Return NaNs on error
        except Exception as e:
            print(f"An unexpected error occurred during interpolation: {e}")
            return np.full_like(x_new, np.nan)


    # Usage:
    # # Known data points (e.g., measurements)
    # x_data = np.array([0, 1, 3, 5, 6])
    # y_data = np.array([0, 2, 1, 4, 3.5])
    #
    # # Points where we want to estimate values
    # x_interp = np.linspace(0, 6, 50) # 50 points between 0 and 6
    #
    # # Perform linear and cubic interpolation
    # y_linear = interpolate_1d(x_data, y_data, x_interp, kind='linear')
    # y_cubic = interpolate_1d(x_data, y_data, x_interp, kind='cubic')
    #
    # print(f"First 5 linear interpolated values: {y_linear[:5]}")
    # print(f"First 5 cubic interpolated values: {y_cubic[:5]}")

    # # Optional: Plotting
    # plt.figure()
    # plt.plot(x_data, y_data, 'o', label='Known Data')
    # plt.plot(x_interp, y_linear, '-', label='Linear Interpolation')
    # plt.plot(x_interp, y_cubic, '--', label='Cubic Interpolation')
    # plt.xlabel("X")
    # plt.ylabel("Y")
    # plt.legend()
    # plt.title("1D Interpolation Example")
    # plt.grid(True)
    # plt.show()
    ```

* **Function Minimization (Optimization):**
    * Finding the arguments (parameters) that minimize a given objective function.
    * Requires: `numpy`, `scipy`
    ```python
    import numpy as np
    from scipy.optimize import minimize

    def objective_function(params: np.ndarray, *args) -> float:
        """
        Example objective function to minimize (e.g., Rosenbrock function).
        Args:
             params: Array of parameters (x, y) to optimize.
             args: Optional additional fixed arguments.
        Returns:
             Scalar value of the function at the given params.
        """
        x, y = params
        # Example: Rosenbrock function, minimum at (1, 1) with value 0
        return (1 - x)**2 + 100 * (y - x**2)**2
        # Example: Simple parabola, min at (a,b) = (2,3)
        # a_target, b_target = args
        # return (params[0] - a_target)**2 + (params[1] - b_target)**2


    def find_minimum(func, initial_guess: np.ndarray, method: str = 'BFGS', func_args=()):
        """
        Finds the minimum of a scalar function of one or more variables.

        Args:
            func: The objective function to be minimized.
            initial_guess: Initial guess for the parameters.
            method: Optimization algorithm (e.g., 'BFGS', 'Nelder-Mead', 'L-BFGS-B').
            func_args: Tuple of extra fixed arguments to pass to the objective function.

        Returns:
            A SciPy OptimizeResult object containing the solution and details.
            Returns None if optimization fails.
        """
        print(f"Starting optimization with method '{method}' from guess {initial_guess}...")
        try:
            result = minimize(func, initial_guess, args=func_args, method=method)
            if result.success:
                print(f"Optimization successful!")
                print(f"  Minimum found at: {result.x}")
                print(f"  Function value at minimum: {result.fun}")
                print(f"  Iterations: {result.nit}")
            else:
                print(f"Optimization failed: {result.message}")
            return result
        except Exception as e:
            print(f"An error occurred during optimization: {e}")
            return None

    # Usage:
    # initial_params = np.array([0.0, 0.0]) # Starting point for search
    # optimize_result = find_minimum(objective_function, initial_params, method='BFGS')

    # # Example with args for the simple parabola
    # def simple_parabola(params, a_target, b_target):
    #     return (params[0] - a_target)**2 + (params[1] - b_target)**2
    #
    # initial_guess_parabola = np.array([0.0, 0.0])
    # target_values = (2.0, 3.0)
    # parabola_result = find_minimum(simple_parabola, initial_guess_parabola, method='Nelder-Mead', func_args=target_values)
    # if parabola_result and parabola_result.success:
    #     print(f"Parabola minimum near target {target_values}: {parabola_result.x}")

    ```

---

**4. Machine Learning Utilities (Scikit-learn)**

* **Feature Scaling:**
    * Transforms features to be on a similar scale, which is important for many ML algorithms (e.g., SVM, Gradient Descent based). `StandardScaler` removes the mean and scales to unit variance.
    * Requires: `numpy`, `scikit-learn` (install via `pip install numpy scikit-learn`)
    ```python
    import numpy as np
    from sklearn.preprocessing import StandardScaler

    def scale_features(X_train: np.ndarray, X_test: np.ndarray | None = None):
        """
        Scales features using StandardScaler (zero mean, unit variance).
        Fits the scaler on X_train and transforms both X_train and X_test.

        Args:
            X_train: Training data (numpy array, shape [n_samples, n_features]).
            X_test: Optional test data to transform using the *same* scaler.

        Returns:
            A tuple containing:
              - Scaled training data (np.ndarray)
              - Scaled test data (np.ndarray or None if X_test was None)
              - The fitted StandardScaler object (for inverse transform or future use)
        """
        scaler = StandardScaler()
        print("Fitting StandardScaler on training data and transforming...")
        X_train_scaled = scaler.fit_transform(X_train)
        print("Scaler fitted.")

        X_test_scaled = None
        if X_test is not None:
            print("Transforming test data...")
            X_test_scaled = scaler.transform(X_test) # Use the SAME scaler fitted on train data
            print("Test data transformed.")

        return X_train_scaled, X_test_scaled, scaler

    # Usage:
    # # Sample data (e.g., 10 samples, 3 features)
    # X_train_raw = np.array([[1, 10, 100], [2, 12, 110], [1.5, 9, 95], [0.5, 11, 105]])
    # X_test_raw = np.array([[1.8, 11.5, 108], [0.8, 9.5, 98]])
    #
    # X_train_s, X_test_s, fitted_scaler = scale_features(X_train_raw, X_test_raw)
    #
    # print("\nOriginal Training Data Mean:", X_train_raw.mean(axis=0))
    # print("Scaled Training Data Mean:", X_train_s.mean(axis=0)) # Should be close to 0
    # print("Scaled Training Data Std Dev:", X_train_s.std(axis=0)) # Should be close to 1
    #
    # print("\nOriginal Test Data:\n", X_test_raw)
    # print("Scaled Test Data:\n", X_test_s)
    #
    # # To revert scaling (e.g., for interpreting predictions)
    # # X_test_original = fitted_scaler.inverse_transform(X_test_s)
    # # print("\nInverse Transformed Test Data:\n", X_test_original)
    ```

* **Train-Test Split and Cross-Validation Iterator:**
    * Fundamental steps for evaluating model generalization performance. `train_test_split` creates a single hold-out set. `KFold` provides indices for K-fold cross-validation.
    * Requires: `numpy`, `scikit-learn`
    ```python
    import numpy as np
    from sklearn.model_selection import train_test_split, KFold

    def split_data(X: np.ndarray, y: np.ndarray, test_size: float = 0.2, random_state: int | None = 42, shuffle: bool = True, stratify = None):
        """Splits data into training and testing sets."""
        print(f"Splitting data: test_size={test_size}, random_state={random_state}, shuffle={shuffle}, stratify={stratify is not None}")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=random_state,
            shuffle=shuffle,
            stratify=stratify # Use stratify=y for classification tasks to preserve class proportions
        )
        print(f"Train set shape: X={X_train.shape}, y={y_train.shape}")
        print(f"Test set shape: X={X_test.shape}, y={y_test.shape}")
        return X_train, X_test, y_train, y_test

    def get_cv_indices(X: np.ndarray, n_splits: int = 5, random_state: int | None = 42, shuffle: bool = True):
        """
        Generates train/validation indices for K-Fold cross-validation.

        Args:
            X: Feature data (only shape[0] is used).
            n_splits: Number of folds (K).
            random_state: Seed for shuffling.
            shuffle: Whether to shuffle data before splitting.

        Yields:
            Tuples of (train_indices, validation_indices) for each fold.
        """
        kf = KFold(n_splits=n_splits, shuffle=shuffle, random_state=random_state)
        print(f"Generating {n_splits}-Fold CV indices (shuffle={shuffle}, random_state={random_state})")
        fold_num = 1
        for train_index, val_index in kf.split(X):
             print(f" Fold {fold_num}: Train size={len(train_index)}, Val size={len(val_index)}")
             yield train_index, val_index
             fold_num += 1

    # Usage:
    # # Sample features (100 samples, 10 features) and labels
    # X_sample = np.random.rand(100, 10)
    # y_sample = np.random.randint(0, 2, 100) # Binary classification labels
    #
    # # 1. Simple Train/Test Split
    # X_tr, X_te, y_tr, y_te = split_data(X_sample, y_sample, test_size=0.25, stratify=y_sample)
    #
    # # 2. Cross-Validation
    # print("\nCross-Validation Example:")
    # # Assume you have a model 'my_model' with fit/predict methods
    # validation_scores = []
    # for train_idx, val_idx in get_cv_indices(X_tr, n_splits=5): # Use CV on the training set
    #     X_cv_train, X_cv_val = X_tr[train_idx], X_tr[val_idx]
    #     y_cv_train, y_cv_val = y_tr[train_idx], y_tr[val_idx]
    #
    #     # --- Inside your CV loop ---
    #     # my_model.fit(X_cv_train, y_cv_train)
    #     # predictions = my_model.predict(X_cv_val)
    #     # score = calculate_some_metric(y_cv_val, predictions) # e.g., accuracy
    #     # validation_scores.append(score)
    #     # print(f"  Fold Score: {score:.4f}") # Placeholder print
    #     pass # Replace with actual model training/evaluation
    #
    # # print(f"\nAverage CV Score: {np.mean(validation_scores):.4f}") # Placeholder
    ```

* **Model Persistence (Saving/Loading):**
    * Saves a trained scikit-learn model (or other Python objects) to disk and loads it back. `joblib` is generally preferred over `pickle` for scikit-learn models, especially those containing large NumPy arrays.
    * Requires: `joblib`, `scikit-learn`
    ```python
    import joblib
    from pathlib import Path
    from sklearn.linear_model import LogisticRegression # Example model
    import numpy as np

    def save_model(model, filepath: str | Path):
        """Saves a model using joblib."""
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True) # Ensure directory exists
        try:
            joblib.dump(model, path)
            print(f"Model saved successfully to {path}")
        except Exception as e:
            print(f"Error saving model to {path}: {e}")

    def load_model(filepath: str | Path):
        """Loads a model using joblib."""
        path = Path(filepath)
        if not path.exists():
            print(f"Error: Model file not found at {path}")
            return None
        try:
            model = joblib.load(path)
            print(f"Model loaded successfully from {path}")
            return model
        except Exception as e:
            print(f"Error loading model from {path}: {e}")
            return None

    # Usage:
    # # 1. Train a dummy model
    # X_dummy = np.random.rand(20, 5)
    # y_dummy = (X_dummy[:, 0] > 0.5).astype(int) # Simple target based on first feature
    # dummy_model = LogisticRegression()
    # dummy_model.fit(X_dummy, y_dummy)
    # print("Dummy model trained.")
    #
    # # 2. Save the model
    # model_path = Path("saved_models/logistic_regression.joblib")
    # save_model(dummy_model, model_path)
    #
    # # 3. Load the model later
    # loaded_dummy_model = load_model(model_path)
    #
    # # 4. Verify loaded model (optional)
    # if loaded_dummy_model:
    #     try:
    #         predictions = loaded_dummy_model.predict(X_dummy[:5]) # Predict on a few samples
    #         print(f"Predictions from loaded model: {predictions}")
    #         original_predictions = dummy_model.predict(X_dummy[:5])
    #         assert np.array_equal(predictions, original_predictions), "Predictions differ!"
    #         print("Loaded model predictions match original model.")
    #     except Exception as e:
    #         print(f"Error using loaded model: {e}")
    ```

* **Basic Evaluation Metrics:**
    * Calculating standard metrics to assess model performance.
    * Requires: `numpy`, `scikit-learn`
    ```python
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    from sklearn.metrics import mean_squared_error, r2_score
    import numpy as np

    def classification_metrics(y_true: np.ndarray, y_pred: np.ndarray, average: str = 'binary'):
        """Calculates common classification metrics."""
        accuracy = accuracy_score(y_true, y_pred)
        # Use appropriate 'average' for multi-class: 'micro', 'macro', 'weighted'
        precision = precision_score(y_true, y_pred, average=average, zero_division=0)
        recall = recall_score(y_true, y_pred, average=average, zero_division=0)
        f1 = f1_score(y_true, y_pred, average=average, zero_division=0)
        print("Classification Metrics:")
        print(f"  Accuracy:  {accuracy:.4f}")
        print(f"  Precision: {precision:.4f} (average='{average}')")
        print(f"  Recall:    {recall:.4f} (average='{average}')")
        print(f"  F1-Score:  {f1:.4f} (average='{average}')")
        return {'accuracy': accuracy, 'precision': precision, 'recall': recall, 'f1': f1}

    def regression_metrics(y_true: np.ndarray, y_pred: np.ndarray):
        """Calculates common regression metrics."""
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_true, y_pred)
        print("Regression Metrics:")
        print(f"  Mean Squared Error (MSE): {mse:.4f}")
        print(f"  Root Mean Squared Error (RMSE): {rmse:.4f}")
        print(f"  R-squared (R²):           {r2:.4f}")
        return {'mse': mse, 'rmse': rmse, 'r2': r2}

    # Usage:
    # # Classification Example
    # y_true_class = np.array([0, 1, 1, 0, 1, 0, 0, 1])
    # y_pred_class = np.array([0, 1, 0, 0, 1, 1, 0, 1]) # Example predictions
    # class_results = classification_metrics(y_true_class, y_pred_class)
    #
    # # Regression Example
    # y_true_reg = np.array([2.5, 0.5, 2.2, 1.9, 3.1, 2.3, 2.0])
    # y_pred_reg = np.array([2.6, 0.7, 2.0, 1.8, 3.0, 2.5, 2.1]) # Example predictions
    # reg_results = regression_metrics(y_true_reg, y_pred_reg)
    ```

---

**5. Advanced Utilities & Robustness**

* **Reading YAML Configuration Files:**
    * YAML is often preferred over INI or JSON for human-readable configuration due to its support for comments, nested structures, and anchors/aliases.
    * Requires: `PyYAML` (install via `pip install pyyaml`)
    ```python
    import yaml
    from pathlib import Path

    def load_yaml_config(filepath: str | Path) -> dict | None:
        """Loads configuration from a YAML file."""
        path = Path(filepath)
        if not path.is_file():
            print(f"Error: YAML config file not found at {path}")
            return None
        try:
            with open(path, 'r', encoding='utf-8') as f:
                # Use SafeLoader to prevent arbitrary code execution
                config = yaml.safe_load(f)
            print(f"Configuration loaded successfully from {path}")
            return config
        except yaml.YAMLError as e:
            print(f"Error parsing YAML file {path}: {e}")
            return None
        except Exception as e:
            print(f"Error reading file {path}: {e}")
            return None

    # Usage:
    # Assume you have a 'config.yaml' file like this:
    # ---
    # # Database configuration
    # database:
    #   type: postgresql
    #   host: localhost
    #   port: 5432
    #   username: db_user
    #   # Password should ideally be handled via env variables or secrets manager
    #   password: placeholder_password
    #
    # # API settings
    # api:
    #   base_url: "https://api.example.com/v1"
    #   timeout_seconds: 15
    #   retry_attempts: 3
    #
    # feature_flags:
    #   new_dashboard: true
    #   experimental_mode: false
    # ...
    #
    # config_data = load_yaml_config("config.yaml")
    #
    # if config_data:
    #     db_host = config_data.get('database', {}).get('host')
    #     api_timeout = config_data.get('api', {}).get('timeout_seconds', 10) # Default value
    #     use_new_dashboard = config_data.get('feature_flags', {}).get('new_dashboard', False)
    #
    #     print(f"\nDatabase Host: {db_host}")
    #     print(f"API Timeout: {api_timeout}")
    #     print(f"Use New Dashboard: {use_new_dashboard}")
    ```

* **Basic Database Interaction with SQLAlchemy Core:**
    * Uses SQLAlchemy's Core API for more database-agnostic SQL execution compared to raw DBAPI drivers (like `sqlite3`). Still uses SQL strings but provides better connection pooling and abstraction. ORM is a further step not shown here.
    * Requires: `SQLAlchemy` (install via `pip install sqlalchemy`) and potentially a DB driver if not using SQLite (e.g., `psycopg2-binary` for PostgreSQL).
    ```python
    from sqlalchemy import create_engine, text
    from sqlalchemy.exc import SQLAlchemyError

    def create_db_engine(db_url: str = "sqlite:///./my_database.db"):
        """Creates a SQLAlchemy engine."""
        try:
            # Example URLs:
            # SQLite: "sqlite:///path/to/database.db" (use relative path './' for current dir)
            # PostgreSQL: "postgresql+psycopg2://user:password@host:port/dbname"
            # MySQL: "mysql+mysqlconnector://user:password@host:port/dbname"
            engine = create_engine(db_url, echo=False) # Set echo=True to log SQL
            print(f"SQLAlchemy engine created for URL: {db_url.split('@')[0]}...") # Hide credentials
            # Try a simple connection to verify
            with engine.connect() as connection:
                 print("Database connection verified successfully.")
            return engine
        except ImportError as e:
             print(f"DB driver error: {e}. Ensure the required driver is installed.")
             return None
        except SQLAlchemyError as e:
            print(f"Error creating SQLAlchemy engine: {e}")
            return None

    def execute_sql(engine, sql_query: str, params: dict | None = None):
        """Executes a SQL query using the engine and returns results if any."""
        if engine is None:
             print("Error: Database engine is not initialized.")
             return None

        results = None
        try:
            with engine.connect() as connection:
                # Use text() for literal SQL; helps prevent SQL injection if params used correctly
                statement = text(sql_query)
                # Execute query; use parameters for safety if query involves external input
                cursor_result = connection.execute(statement, parameters=params or {})

                # If it's a SELECT-like query, fetch results
                if cursor_result.returns_rows:
                    # Fetch all results as a list of Row objects (behave like tuples/dicts)
                    results = cursor_result.fetchall()
                    print(f"Query executed successfully, {len(results)} rows returned.")
                else:
                    # For INSERT/UPDATE/DELETE, rowcount might be available
                    print(f"Non-query statement executed successfully. Rows affected: {cursor_result.rowcount}")

                # For INSERT/UPDATE/DELETE, changes need to be committed
                # connection.commit() is automatically called when exiting 'with' block by default
                # For more control, use: connection.begin() and connection.commit()/rollback()

        except SQLAlchemyError as e:
            print(f"Error executing SQL query: {e}")
            # Optionally rollback in case of error if using explicit transaction
            # connection.rollback()
            return None # Indicate error
        except Exception as e:
             print(f"An unexpected error occurred during SQL execution: {e}")
             return None

        return results

    # Usage:
    # db_engine = create_db_engine() # Creates/connects to local SQLite file 'my_database.db'
    #
    # if db_engine:
    #     # Example: Create table (Idempotent using 'IF NOT EXISTS')
    #     create_table_sql = """
    #     CREATE TABLE IF NOT EXISTS users (
    #         id INTEGER PRIMARY KEY,
    #         name TEXT NOT NULL,
    #         email TEXT UNIQUE
    #     );
    #     """
    #     execute_sql(db_engine, create_table_sql)
    #
    #     # Example: Insert data with parameters (safer)
    #     insert_sql = "INSERT INTO users (name, email) VALUES (:name, :email) ON CONFLICT(email) DO NOTHING"
    #     user_data = {"name": "Alice", "email": "alice@example.com"}
    #     execute_sql(db_engine, insert_sql, params=user_data)
    #     user_data_2 = {"name": "Bob", "email": "bob@example.com"}
    #     execute_sql(db_engine, insert_sql, params=user_data_2)
    #
    #     # Example: Select data
    #     select_sql = "SELECT id, name, email FROM users WHERE name LIKE :pattern"
    #     select_params = {"pattern": "A%"} # Find users whose name starts with A
    #     user_results = execute_sql(db_engine, select_sql, params=select_params)
    #
    #     if user_results:
    #         print("\nSelected Users:")
    #         for row in user_results:
    #             # Access columns by index or name
    #             print(f"  ID: {row[0]}, Name: {row.name}, Email: {row.email}")
    #
    #     # Example: Select all
    #     all_users = execute_sql(db_engine, "SELECT * FROM users")
    #     if all_users:
    #          print("\nAll Users:")
    #          for user in all_users:
    #               print(f"  {user}")

    ```

* **Regular Expression Matching:**
    * Finding patterns in strings using the `re` module.
    * Requires: Standard library (`re`)
    ```python
    import re

    def find_pattern(text: str, pattern: str, find_all: bool = False):
        """
        Searches for a regex pattern in text.

        Args:
            text: The string to search within.
            pattern: The regular expression pattern.
            find_all: If True, find all non-overlapping matches.
                      If False, find only the first match.

        Returns:
            If find_all is True: A list of all matching strings.
            If find_all is False: A re.Match object for the first match, or None if no match.
        """
        try:
            regex = re.compile(pattern) # Compile for efficiency if used repeatedly
            if find_all:
                matches = regex.findall(text)
                print(f"Found {len(matches)} matches for pattern '{pattern}'")
                return matches
            else:
                match = regex.search(text) # search() finds first match anywhere in string
                if match:
                    print(f"Found first match for pattern '{pattern}': {match.group(0)}")
                    # Access groups: match.group(1), match.group(2), etc.
                    # Access span: match.span()
                else:
                    print(f"No match found for pattern '{pattern}'")
                return match
        except re.error as e:
            print(f"Invalid regular expression pattern '{pattern}': {e}")
            return [] if find_all else None
        except Exception as e:
            print(f"An error occurred during regex search: {e}")
            return [] if find_all else None


    # Usage:
    # text_data = "User email: alice@example.com, Order ID: 12345, Date: 2025-04-28. Contact support@example.org for help. Ref: ABC-987."

    # # Example 1: Find all email addresses
    # email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    # emails = find_pattern(text_data, email_pattern, find_all=True) # ['alice@example.com', 'support@example.org']
    # print("Emails found:", emails)

    # # Example 2: Find the first Order ID (digits)
    # order_id_pattern = r'Order ID:\s*(\d+)' # Use capturing group () for the number
    # order_match = find_pattern(text_data, order_id_pattern, find_all=False)
    # if order_match:
    #     order_id = order_match.group(1) # Get content of the first capturing group
    #     print(f"Order ID extracted: {order_id}") # Output: 12345

    # # Example 3: Find date in YYYY-MM-DD format
    # date_pattern = r'(\d{4})-(\d{2})-(\d{2})'
    # date_match = find_pattern(text_data, date_pattern)
    # if date_match:
    #     year, month, day = date_match.groups() # Get all captured groups
    #     print(f"Date found: Year={year}, Month={month}, Day={day}")

    # # Example 4: Find reference code (ABC-123 format)
    # ref_pattern = r'Ref:\s*([A-Z]{3}-\d{3})'
    # ref_match = find_pattern(text_data, ref_pattern)
    # if ref_match:
    #     print(f"Reference Code: {ref_match.group(1)}") # ABC-987
    ```

---

Remember to add necessary installation instructions (`pip install ...`) or list dependencies in your library's `setup.py` or `requirements.txt`. These advanced snippets should provide powerful additions to your toolkit.