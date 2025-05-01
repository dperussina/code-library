use std::thread;
use std::time::Duration;
use std::sync::{Arc, Mutex};

/// Spawns multiple threads that perform a simple task.
/// Demonstrates joining threads to wait for their completion.
fn spawn_and_join_threads() {
    let mut handles = vec![];

    println!("Spawning 5 threads...");
    for i in 0..5 {
        // `move` closure takes ownership of `i`
        let handle = thread::spawn(move || {
            println!("Thread {} started.", i);
            // Simulate some work
            thread::sleep(Duration::from_millis(50 * i)); 
            println!("Thread {} finished.", i);
            i * 2 // Return a value (optional)
        });
        handles.push(handle);
    }

    println!("Waiting for threads to complete...");
    let mut results = vec![];
    for handle in handles {
        // `join` waits for the thread to finish and returns a Result
        // containing the value returned by the closure.
        match handle.join() {
            Ok(result) => {
                println!("Joined thread returned: {}", result);
                results.push(result);
            }
            Err(e) => {
                // If a thread panics, join returns an Err
                eprintln!("A thread panicked: {:?}", e);
            }
        }
    }
    println!("All threads joined. Results: {:?}", results);
}

/// Demonstrates sharing mutable state between threads using `Arc` and `Mutex`.
fn shared_mutable_state() {
    // Arc: Atomically Reference Counted pointer. Allows shared ownership across threads.
    // Mutex: Mutual Exclusion lock. Ensures only one thread accesses the data at a time.
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    println!("\nSpawning 10 threads to increment a shared counter...");
    for i in 0..10 {
        // Clone the Arc to give each thread its own reference to the counter.
        // The underlying Mutex<i32> is shared.
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // Lock the mutex. This blocks if another thread holds the lock.
            // `lock()` returns a Result, `unwrap()` panics on error (e.g., poisoned mutex).
            let mut num = counter_clone.lock().unwrap();
            
            // MutexGuard (`num`) dereferences to the inner data (`i32`).
            *num += 1;
            println!("Thread {} incremented counter. Current value (inside lock): {}", i, *num);
            
            // The lock is automatically released when `num` (the MutexGuard) goes out of scope.
        });
        handles.push(handle);
    }

    // Wait for all threads to complete.
    for handle in handles {
        handle.join().unwrap(); // Unwrap assumes threads won't panic here
    }

    // Lock the mutex on the main thread to read the final value.
    let final_value = *counter.lock().unwrap();
    println!("All threads finished. Final counter value: {}", final_value);
    assert_eq!(final_value, 10);
}

// Example Usage (within a main function or test)
/*
fn main() {
    println!("--- Basic Thread Spawning and Joining ---");
    spawn_and_join_threads();

    println!("\n--- Shared Mutable State with Arc<Mutex<T>> ---");
    shared_mutable_state();
}
*/ 