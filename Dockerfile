# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend
WORKDIR /app

# Install PHP so @laravel/vite-plugin-wayfinder can run php artisan
RUN apk add --no-cache php83 php83-phar php83-mbstring php83-openssl php83-tokenizer php83-xml php83-ctype php83-session php83-fileinfo php83-dom php83-xmlwriter \
    && ln -sf /usr/bin/php83 /usr/bin/php

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Install PHP dependencies needed by artisan
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Build frontend assets (wayfinder plugin needs php artisan)
RUN npm run build

# Stage 2: Build Backend & Setup Server
FROM php:8.3-fpm-alpine

# Install system dependencies & Nginx
RUN apk add --no-cache \
    nginx \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    sqlite-dev \
    unzip \
    curl \
    git \
    supervisor \
    gettext \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip gd bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel files
COPY . .

# Copy frontend build from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Install PHP dependencies (production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Configure Nginx & PHP-FPM
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache \
    # Allow nginx to write to its necessary directories when run as non-root (if needed)
    && chown -R www-data:www-data /var/lib/nginx \
    && chown -R www-data:www-data /var/log/nginx

# Railway exposes the port dynamically
ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["docker-entrypoint.sh"]
