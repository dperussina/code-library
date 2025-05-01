#!/bin/bash
set -euo pipefail

# --- Example 1: Process Substitution ---
echo "Comparing differences between /etc and /usr/lib..."
diff <(ls -1 /etc | sort) <(ls -1 /usr/lib | sort)
echo "Comparison complete."

# --- Example 2: Associative Arrays ---
declare -A user_roles
user_roles["alice"]="admin"
user_roles["bob"]="developer"
user_roles["charlie"]="viewer"

USER_TO_CHECK="bob"
ROLE=${user_roles["$USER_TO_CHECK"]}
echo "Role for $USER_TO_CHECK: $ROLE"

if [[ -v user_roles["david"] ]]; then
    echo "David has a role."
else
    echo "David does not have a role assigned."
fi

echo "All users:"
for user in "${!user_roles[@]}"; do
    echo " - $user"
done

echo "All roles:"
for role in "${user_roles[@]}"; do
    echo " - $role"
done

echo "User-Role mapping:"
for user in "${!user_roles[@]}"; do
    echo " - User: $user, Role: ${user_roles[$user]}"
done