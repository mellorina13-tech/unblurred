#!/bin/bash
# Start script for Render deployment

echo "Starting Depixelization App with Gunicorn..."
gunicorn --config gunicorn_config.py app:app
