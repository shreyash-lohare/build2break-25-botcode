# Use official n8n image
FROM n8nio/n8n:latest

# Set working directory
WORKDIR /data

# Copy your workflow into the n8n data folder
COPY workflows/ /data/workflows/

# Copy environment variables (API keys, etc.)
COPY .env /data/.env

# Expose n8n default port
EXPOSE 5678

# Run n8n automatically when the container starts
CMD ["n8n", "start"]
