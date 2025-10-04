FROM nginx:stable-alpine

# Copy custom NGINX configuration with reverse proxy for /webhook
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets
COPY . /usr/share/nginx/html

EXPOSE 80
