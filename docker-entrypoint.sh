#!/bin/sh

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

# Substitute dynamic Railway port into Nginx configuration
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start php-fpm in the background
echo "Starting PHP-FPM..."
php-fpm -D

# Start nginx in the foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
