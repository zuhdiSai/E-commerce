#!/bin/bash

echo "Starting deployment scripts..."

# Clear and cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Link storage (idempotent)
echo "Linking storage..."
php artisan storage:link

# Start Apache in the foreground
echo "Starting Apache..."
exec apache2-foreground
