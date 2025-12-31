if [[ -e practice.db ]]; then
    echo 'Database already exists, doing nothing...'
else
    echo 'Creating database...'
    node setup-db.js
    node seed-user-dev.js
fi
