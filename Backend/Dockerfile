# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory inside container
WORKDIR /app

# Copy all backend project files to container
COPY . .

# Install OS dependencies (for face_recognition & dlib)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-all-dev \
    libssl-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*
 
# Upgrade pip
RUN pip install --upgrade pip

# Install CPU-only Torch and TorchVision
RUN pip install torch==2.0.1+cpu torchvision==0.15.2+cpu --index-url https://download.pytorch.org/whl/cpu

# Install rest of the requirements
RUN pip install --retries=10 --timeout=120 --no-cache-dir --progress-bar off -r requirements.txt

# Collect static files (skip this if not needed)
RUN python manage.py collectstatic --noinput || echo "Collectstatic failed, continuing..."

# Expose port
EXPOSE 8000

# Start Gunicorn server
CMD ["gunicorn", "Backend.wsgi:application", "--chdir", "/app", "--bind", "0.0.0.0:8000"]

