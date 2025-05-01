#!/bin/bash
# Enable strict mode for safety and predictability.
set -euo pipefail

# --- Example 1: Process Substitution ---
echo "Comparing sorted directory listings using process substitution..."
# Process substitution `<(command)` allows the output of a command (or pipeline)
# to be treated as if it were a file.
# Here, we sort the listings of /etc and /usr/lib and pass them to diff
# without creating temporary files.
diff <(ls -1 /etc | sort) <(ls -1 /usr/lib | sort)
echo "Comparison complete (exit code $?)."

# --- Example 2: Associative Arrays (Bash 4.0+) ---
# Associative arrays allow using strings as indices (keys).

# Declare an associative array.
declare -A user_roles

# Assign key-value pairs.
user_roles["alice"]="admin"
user_roles["bob"]="developer"
user_roles["charlie"]="viewer"

# Access a value using its key.
USER_TO_CHECK="bob"
# Use quotes around the key variable to handle potential spaces or special characters.
ROLE=${user_roles["$USER_TO_CHECK"]}
echo "\nRole for $USER_TO_CHECK: $ROLE"

# Check if a key exists using `-v` (Bash 4.2+).
if [[ -v user_roles["david"] ]]; then
    echo "David has a role."
else
    echo "David does not have a role assigned."
fi

echo "\nAll users (keys):"
# Iterate over the keys of the associative array.
# `!` prefix gets the keys. Quotes are important for handling keys with spaces.
for user in "${!user_roles[@]}"; do
    echo " - $user"
done

echo "\nAll roles (values):"
# Iterate over the values of the associative array.
# Quotes handle values with spaces.
for role in "${user_roles[@]}"; do
    echo " - $role"
done

echo "\nUser-Role mapping:"
# Iterate over keys and access corresponding values.
for user in "${!user_roles[@]}"; do
    echo " - User: $user, Role: ${user_roles[$user]}"
done

echo "\nAdvanced shell features demo finished."