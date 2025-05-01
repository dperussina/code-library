// Note: This example requires adding the `rayon` crate to your Cargo.toml:
// [dependencies]
// rayon = "1.5" // Or a newer version

use rayon::prelude::*; // Import the parallel iterator traits
use std::time::Instant; // For basic timing comparison

/// Calculates the sum of squares of a large vector sequentially.
fn sum_of_squares_sequential(numbers: &[i64]) -> i64 {
    numbers.iter().map(|&x| x * x).sum()
}

/// Calculates the sum of squares of a large vector in parallel using Rayon.
fn sum_of_squares_parallel(numbers: &[i64]) -> i64 {
    // `.par_iter()` creates a parallel iterator.
    // Rayon automatically handles splitting the work across available CPU cores.
    // The subsequent operations (`map`, `sum`) are performed in parallel chunks.
    numbers.par_iter().map(|&x| x * x).sum()
}

/// Demonstrates transforming a collection in parallel.
fn transform_in_parallel(numbers: &mut [i32]) {
    // `.par_iter_mut()` provides mutable access in parallel.
    // Be cautious with mutable parallel iteration if order or dependencies matter.
    // Here, each element is modified independently, so it's safe.
    numbers.par_iter_mut().for_each(|n| {
        // Simulate some work before modifying
        let initial = *n;
        *n = initial.pow(2) + initial; 
    });
}

// Example Usage
/*
fn main() {
    let size = 10_000_000; // Use a large number to see potential performance difference
    let numbers: Vec<i64> = (1..=size).collect();
    let mut numbers_mut: Vec<i32> = (1..=20).collect(); // Smaller vec for mutable example

    println!("Calculating sum of squares for {} numbers...", size);

    // --- Sequential Calculation ---
    let start_seq = Instant::now();
    let sum_seq = sum_of_squares_sequential(&numbers);
    let duration_seq = start_seq.elapsed();
    println!("Sequential Sum: {}", sum_seq);
    println!("Sequential Time:  {:?}", duration_seq);

    // --- Parallel Calculation ---
    let start_par = Instant::now();
    let sum_par = sum_of_squares_parallel(&numbers);
    let duration_par = start_par.elapsed();
    println!("Parallel Sum:   {}", sum_par);
    println!("Parallel Time:    {:?}", duration_par);

    // Verify results are the same
    assert_eq!(sum_seq, sum_par);

    // Performance comparison note:
    // The actual speedup depends on the number of CPU cores, 
    // the nature of the task (CPU-bound vs I/O-bound), and the overhead 
    // of parallelization. For very small tasks, sequential might be faster.
    if duration_par < duration_seq {
        println!("Parallel execution was faster!");
    } else {
        println!("Sequential execution was faster or similar (might happen for small tasks or low core counts).");
    }
    
    // --- Parallel Mutable Transformation ---
    println!("\nTransforming collection in parallel...");
    println!("Original mutable data: {:?}", numbers_mut);
    transform_in_parallel(&mut numbers_mut);
    println!("Transformed mutable data: {:?}", numbers_mut);
}
*/ 