#!/bin/bash
set -e

echo "Starting API entrypoint script..."

# Wait for Postgres
echo "Waiting for Postgres..."
until pg_isready -h postgres -p 5432 -U postgres -d mydb; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done
echo "Postgres is up!"

# Wait for Redis
echo "Waiting for Redis..."
until nc -z redis 6379; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done
echo "Redis is up!"

# Run Prisma migrations
echo "Running Prisma migrations..."
cd /app/packages/store
bun run migrate:deploy

# Seed the database
echo "Seeding database..."
bun run seed

# Create Redis consumer groups using the seed script
echo "Setting up Redis consumer groups..."
cd /app/packages/store
bun run prisma/redis-seed.ts

# Start the API server
echo "Starting API server..."
cd /app/apps/api
exec bun run index.ts