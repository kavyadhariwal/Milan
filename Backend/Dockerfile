# Use official Python image
FROM python:3.10-slim

# Install system dependencies required by dlib and face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-python-dev \
    libboost-thread-dev \
    libsm6 \
    libxext6 \
    libxrender-dev \
    python3-opencv \
    git \
    curl

# Create app directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Collect static files (optional)
RUN python Backend/manage.py collectstatic --noinput

# Port to expose
EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "Backend.Backend.wsgi:application", "--bind", "0.0.0.0:8000"]
