# ==================== Node 22 ====================
FROM node:22.19.0 AS node

# ==================== PHP 8.2 ====================
FROM php:8.2-fpm

ARG user=laravel
ARG uid=1000

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions (Laravel 12 compatible)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        pdo_sqlite \
        bcmath \
        exif \
        pcntl \
        intl \
        mbstring \
        zip \
        gd

# Copy Node (for Vite usage inside container if needed)
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# User setup
RUN useradd -G www-data,root -u ${uid} -d /home/${user} ${user} \
    && mkdir -p /home/${user}/.composer \
    && chown -R ${user}:${user} /home/${user}

# PHP config
RUN echo "memory_limit=2G" > /usr/local/etc/php/conf.d/memory-limit.ini

WORKDIR /var/www

# Ensure permissions for bind mounts
RUN chown -R www-data:www-data /var/www

USER ${user}

# Default command for local dev
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]