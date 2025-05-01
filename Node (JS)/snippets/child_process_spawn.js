'use strict';

// child_process module provides ability to spawn subprocesses
const { spawn } = require('child_process');
const os = require('os');

/**
 * Executes an external command as a child process using `spawn`.
 * Handles stdout, stderr streams and process exit/error events.
 * Returns a Promise that resolves with the output or rejects on error.
 * `spawn` is generally preferred over `exec` for long-running processes
 * or commands with potentially large output, as it uses streams.
 *
 * @param {string} command - The command to execute (e.g., 'ls', 'git', 'python').
 * @param {string[]} [args=[]] - An array of string arguments for the command.
 * @param {object} [options={}] - Options object for child_process.spawn.
 *                                See Node.js docs for details (e.g., cwd, env, shell).
 * @returns {Promise<{code: number | null, stdout: string, stderr: string}>}
 *          Resolves with exit code, accumulated stdout, and stderr.
 *          Rejects with an error object containing code, stdout, stderr on failure.
 */
function runCommandStream(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`Spawning command: ${command} ${args.join(' ')}`);

        // Default options: pipe stdio to capture output
        const spawnOptions = { stdio: 'pipe', ...options };

        // Spawn the child process
        const child = spawn(command, args, spawnOptions);

        let stdoutData = '';
        let stderrData = '';

        // --- Stream Handling ---
        // Listen for data on stdout stream
        if (child.stdout) {
            child.stdout.on('data', (data) => {
                const chunk = data.toString();
                stdoutData += chunk;
                console.log(`stdout chunk: ${chunk.trim()}`); // Log chunks immediately
            });
            child.stdout.on('error', (err) => console.error(`Stdout stream error for "${command}":`, err));
        } else {
             console.warn(`Command "${command}" has no stdout stream.`);
        }


        // Listen for data on stderr stream
        if (child.stderr) {
            child.stderr.on('data', (data) => {
                const chunk = data.toString();
                stderrData += chunk;
                console.error(`stderr chunk: ${chunk.trim()}`); // Log stderr chunks immediately
            });
             child.stderr.on('error', (err) => console.error(`Stderr stream error for "${command}":`, err));
        } else {
             console.warn(`Command "${command}" has no stderr stream.`);
        }

        // --- Process Event Handling ---
        // Handle errors during spawning itself (e.g., command not found)
        child.on('error', (err) => {
            console.error(`Failed to start subprocess "${command}":`, err);
            // Enhance error object if possible
            err.stdout = stdoutData;
            err.stderr = stderrData;
            reject(err);
        });

        // Handle process exit (different from 'close')
        child.on('exit', (code, signal) => {
             console.log(`Subprocess "${command}" exited with code ${code}${signal ? ` (signal ${signal})` : ''}.`);
             // Note: Streams might still be finishing, 'close' is more reliable for completion.
        });

        // Handle when all stdio streams have closed (signals true completion)
        child.on('close', (code, signal) => {
            console.log(`Subprocess "${command}" stdio streams closed.`);
            if (code === 0) {
                // Command executed successfully
                resolve({ code, stdout: stdoutData, stderr: stderrData });
            } else {
                // Command failed
                const error = new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`);
                error.code = code;
                error.signal = signal;
                error.stdout = stdoutData;
                error.stderr = stderrData;
                reject(error);
            }
        });
    });
}

// --- Example Usage ---
async function main() {
    // --- Example 1: List files (cross-platform) ---
    console.log("\n--- Example 1: Listing directory contents ---");
    const listCommand = os.platform() === 'win32' ? 'dir' : 'ls';
    const listArgs = os.platform() === 'win32' ? [] : ['-la'];
    try {
        const result = await runCommandStream(listCommand, listArgs);
        console.log(`\n"${listCommand}" Successful Output:`);
        console.log(result.stdout);
    } catch (error) {
        console.error(`\n"${listCommand}" Failed:`, error.message);
        if (error.stderr) console.error("Stderr:", error.stderr);
    }

    // --- Example 2: Run python script (if python is available) ---
    console.log("\n--- Example 2: Running a Python script ---");
     // Create a dummy python script
     const pythonScriptPath = require('path').join(__dirname, 'temp_script.py');
     require('fs').writeFileSync(pythonScriptPath, 'import sys\nprint("Hello from Python!")\nprint("Argv:", sys.argv)\nsys.stderr.write("An error message from Python stderr\\n")\nsys.exit(0)');
    try {
        const pyResult = await runCommandStream('python', [pythonScriptPath, 'arg1', 'arg2']);
        console.log(`\n"python" Successful Output:`);
        console.log("Stdout:", pyResult.stdout);
        console.log("Stderr:", pyResult.stderr); // Note: Stderr is captured even on success (exit code 0)
    } catch (error) {
         // This might fail if python isn't in the PATH
        console.error(`\n"python" Failed:`, error.message);
         if(error.stderr) console.error("Stderr:", error.stderr);
    } finally {
         // Clean up dummy script
         try { require('fs').unlinkSync(pythonScriptPath); } catch(e){}
    }

    // --- Example 3: Command that fails ---
     console.log("\n--- Example 3: Running a command expected to fail ---");
     try {
        // Using ls with an invalid option or non-existent file
        const failArgs = os.platform() === 'win32' ? ['/nonexistent'] : ['-invalidoption'];
        await runCommandStream(listCommand, failArgs);
        console.log(`\n"${listCommand} ${failArgs.join(' ')}" Succeeded (Unexpected!)`);
     } catch (error) {
        console.error(`\n"${listCommand} ${failArgs.join(' ')}" Failed as expected:`);
         console.error(`  Error Message: ${error.message}`);
         console.error(`  Exit Code: ${error.code}`);
         if (error.stderr) console.error(`  Stderr:\n${error.stderr}`);
         // Note: error.stdout might also contain output before failure
     }
}

if (require.main === module) {
    main();
}

module.exports = { runCommandStream }; 