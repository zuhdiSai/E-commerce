# ==========================================
# Stage 1: Install PHP Dependencies
# ==========================================
FROM composer:2.7 AS php_builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# ==========================================
# Stage 2: Build Frontend Assets (React/Vite)
# ==========================================
# Menggunakan base php:8.3-cli (Debian-based) agar PHP tersedia untuk Vite plugin
FROM php:8.3-cli AS frontend_builder

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs zip unzip

WORKDIR /app

# Copy dependency PHP dari stage sebelumnya (dibutuhkan oleh artisan wayfinder:generate)
COPY --from=php_builder /app/vendor ./vendor

# Copy file konfigurasi core Laravel yang dibutuhkan oleh Artisan
COPY artisan ./
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY app/ app/

# Copy file dependency frontend dan install
COPY package.json package-lock.json vite.config.ts ./
RUN npm ci

# Copy resource dan build
COPY resources/ resources/
COPY public/ public/
RUN npm run build

# ==========================================
# Stage 3: Production Server (PHP 8.3 + Apache)
# ==========================================
FROM php:8.3-apache

# Menggunakan apt-get untuk menginstal library OS pendukung
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql mbstring pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Aktifkan modul mod_rewrite Apache untuk routing Laravel
RUN a2enmod rewrite

# Arahkan DocumentRoot Apache langsung ke folder /public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf

# Railway menggunakan PORT environment variable secara dinamis
# Kita harus mengganti port 80 dengan $PORT pada konfigurasi Apache
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:${PORT}/g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# Copy seluruh kode sumber Laravel
COPY . .

# Ambil hasil dari stage sebelumnya (vendor PHP dan build aset React)
COPY --from=php_builder /app/vendor /var/www/html/vendor
COPY --from=frontend_builder /app/public/build /var/www/html/public/build

# Atur permission direktori yang membutuhkan akses tulis (write)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["docker-entrypoint.sh"]
