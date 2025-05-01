'use strict';

const path = require('path');
const os = require('os'); // To get home directory

/**
 * Demonstrates common operations using the Node.js 'path' module.
 * Helps create cross-platform compatible paths.
 */
function demonstratePathOperations() {
    console.log(`\n--- Path Module Operations (Platform: ${process.platform}) ---`);

    // --- path.join([...paths]) ---
    // Joins path segments using the platform-specific separator.
    // Normalizes the resulting path (handles '..', '.', multiple separators).
    console.log("\n--- path.join() ---");
    const joined1 = path.join('/users', 'guest', 'docs', '../', 'config');
    console.log(`path.join('/users', 'guest', 'docs', '../', 'config'):`, joined1); // Expected: /users/guest/config or \users\guest\config

    const joined2 = path.join('data', '//raw//', 'images/', 'img.jpg');
    console.log(`path.join('data', '//raw//', 'images/', 'img.jpg'):`, joined2); // Expected: data/raw/images/img.jpg or data\raw\images\img.jpg

    const homeDir = os.homedir(); // Get user home directory
    const configPath = path.join(homeDir, '.myApp', 'settings.json');
    console.log(`Config Path (joined):`, configPath);

    // --- path.resolve([...paths]) ---
    // Resolves a sequence of paths or path segments into an absolute path.
    // Processes from right to left, prepending CWD if first path isn't absolute.
    console.log("\n--- path.resolve() ---");
    const resolved1 = path.resolve('data', 'files', 'report.pdf');
    console.log(`path.resolve('data', 'files', 'report.pdf'):`, resolved1); // Expected: /path/to/cwd/data/files/report.pdf

    const resolved2 = path.resolve('/etc', 'nginx', '../', 'apache2/httpd.conf');
    console.log(`path.resolve('/etc', 'nginx', '../', 'apache2/httpd.conf'):`, resolved2); // Expected: /etc/apache2/httpd.conf

    const resolved3 = path.resolve('/foo/bar', './baz');
    console.log(`path.resolve('/foo/bar', './baz'):`, resolved3); // Expected: /foo/bar/baz

    const resolved4 = path.resolve('/foo/bar', '/tmp/file/'); // Second path is absolute, ignores first
    console.log(`path.resolve('/foo/bar', '/tmp/file/'):`, resolved4); // Expected: /tmp/file

    const currentWorkingDir = path.resolve();
    console.log(`path.resolve() (Current Working Directory):`, currentWorkingDir);


    // --- path.dirname(p) ---
    // Returns the directory name of a path.
    console.log("\n--- path.dirname() ---");
    const filePath = '/usr/local/bin/script.sh';
    console.log(`path.dirname('${filePath}'):`, path.dirname(filePath)); // Expected: /usr/local/bin
    console.log(`path.dirname('.'):`, path.dirname('.')); // Expected: .
    console.log(`path.dirname('/only_root'):`, path.dirname('/only_root')); // Expected: /

    // --- path.basename(p[, ext]) ---
    // Returns the last portion of a path (filename). Optional suffix removal.
    console.log("\n--- path.basename() ---");
    console.log(`path.basename('${filePath}'):`, path.basename(filePath)); // Expected: script.sh
    console.log(`path.basename('${filePath}', '.sh'):`, path.basename(filePath, '.sh')); // Expected: script
    console.log(`path.basename('/dir/only/'):`, path.basename('/dir/only/')); // Expected: only
     console.log(`path.basename('.'):`, path.basename('.')); // Expected: .

    // --- path.extname(p) ---
    // Returns the extension of the path (from last '.' to end of string).
    console.log("\n--- path.extname() ---");
    console.log(`path.extname('index.html'):`, path.extname('index.html')); // Expected: .html
    console.log(`path.extname('archive.tar.gz'):`, path.extname('archive.tar.gz')); // Expected: .gz
    console.log(`path.extname('no_extension'):`, path.extname('no_extension')); // Expected: ''
    console.log(`path.extname('.bashrc'):`, path.extname('.bashrc')); // Expected: '' (dotfiles often treated as no extension)
    console.log(`path.extname('multi.dots.txt'):`, path.extname('multi.dots.txt')); // Expected: .txt

    // --- path.parse(p) ---
    // Returns an object whose properties represent significant elements of the path.
    console.log("\n--- path.parse() ---");
    const parsedPath = path.parse(filePath);
    console.log(`path.parse('${filePath}'):`, parsedPath);
    /* Expected:
    {
      root: '/',
      dir: '/usr/local/bin',
      base: 'script.sh',
      ext: '.sh',
      name: 'script'
    }
    */
    const parsedRelative = path.parse('./data/file.txt');
     console.log(`path.parse('./data/file.txt'):`, parsedRelative);
     /* Expected:
      { root: '', dir: './data', base: 'file.txt', ext: '.txt', name: 'file' }
     */

    // --- path.format(pathObject) ---
    // Returns a path string from an object (the opposite of path.parse).
    console.log("\n--- path.format() ---");
    const formattedPath = path.format({
        dir: '/home/user/data',
        base: 'report.txt'
    });
     console.log(`path.format({ dir: '/home/user/data', base: 'report.txt' }):`, formattedPath); // Expected: /home/user/data/report.txt

     const formattedPath2 = path.format({
        root: '/',
        name: 'config',
        ext: '.json'
    });
    console.log(`path.format({ root: '/', name: 'config', ext: '.json' }):`, formattedPath2); // Expected: /config.json (dir takes precedence over root if both provided)


    // --- path.sep ---
    // The platform-specific path segment separator ('\' on Windows, '/' on POSIX).
    console.log("\n--- path.sep ---");
    console.log(`Path separator (path.sep): '${path.sep}'`);

    // --- path.delimiter ---
    // The platform-specific path delimiter (';' on Windows, ':' on POSIX - used in PATH env var).
    console.log("\n--- path.delimiter ---");
    console.log(`Path delimiter (path.delimiter): '${path.delimiter}'`);

    // --- path.normalize(p) ---
    // Normalizes the given path, resolving '..' and '.' segments, multiple slashes.
    console.log("\n--- path.normalize() ---");
    const messyPath = '/foo//bar/../baz/./file.txt';
    console.log(`path.normalize('${messyPath}'):`, path.normalize(messyPath)); // Expected: /foo/baz/file.txt

}

// --- Run Demonstration ---
demonstratePathOperations();

// Export functions if they were defined separately and needed elsewhere
// module.exports = { demonstratePathOperations }; 