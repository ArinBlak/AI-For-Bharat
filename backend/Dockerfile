# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for Playwright and Audio processing
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    librandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium

# Copy the rest of the backend code
# Note: In Railway, we typically deploy from the root, so we copy the backend folder
# But to make it work easily, we can assume the Railway project is rooted at /backend
COPY backend/ .

# Expose the port FastAPI will run on
# Railway uses the PORT environment variable automatically
EXPOSE 8080

# Command to run the application
# We use $PORT provided by Railway
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
