# Gunicorn configuration file for Render deployment
import os

# Bind to the PORT environment variable (Render sets this)
bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"

# Worker configuration
workers = 2
worker_class = 'sync'

# Timeout settings (in seconds)
# Increased timeout to handle long-running image processing
timeout = 120  # 2 minutes
graceful_timeout = 30
keepalive = 5

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'depixelization-app'
