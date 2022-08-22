#!/usr/bin/env bash
set -e

# mkdir -p $DMU_DUS_LOCAL_STORAGE_PATH

exec gunicorn --bind 0.0.0.0:5000 app:dds_app --timeout 1200 --workers 4 --access-logfile '-' --error-logfile '-'