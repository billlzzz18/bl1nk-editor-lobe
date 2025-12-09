#!/bin/bash

# AI Development Studio Backup Script
# This script creates backups of PostgreSQL and Redis data

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ai_dev_studio_backup_${DATE}"
POSTGRES_CONTAINER="ai_dev_postgres"
REDIS_CONTAINER="ai_dev_redis"

# Create backup directory
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"

echo "Starting backup process..."

# Backup PostgreSQL
echo "Backing up PostgreSQL database..."
docker exec "${POSTGRES_CONTAINER}" pg_dump -U ai_dev ai_dev_studio > "${BACKUP_DIR}/${BACKUP_NAME}/database.sql"

# Backup Redis
echo "Backing up Redis data..."
docker exec "${REDIS_CONTAINER}" redis-cli BGSAVE
sleep 5  # Wait for BGSAVE to complete
docker cp "${REDIS_CONTAINER}:/data/dump.rdb" "${BACKUP_DIR}/${BACKUP_NAME}/redis_dump.rdb"

# Create metadata file
cat > "${BACKUP_DIR}/${BACKUP_NAME}/metadata.json" << EOF
{
  "backup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "backup_name": "${BACKUP_NAME}",
  "version": "1.0",
  "services": {
    "postgresql": "15-alpine",
    "redis": "7-alpine"
  },
  "files": {
    "database.sql": "PostgreSQL database dump",
    "redis_dump.rdb": "Redis data dump",
    "metadata.json": "Backup metadata"
  }
}
EOF

# Create tar archive
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}/"
rm -rf "${BACKUP_NAME}"

# Clean up old backups (keep last 7 days)
find "${BACKUP_DIR}" -name "ai_dev_studio_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

# Display backup info
ls -lh "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

echo "Backup process finished successfully!"