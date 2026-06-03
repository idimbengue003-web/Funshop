#!/bin/bash
# Build script for Railway deployment
# Switches Prisma schema to PostgreSQL before building

set -e

echo "🔧 Switching to PostgreSQL schema for production..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building Next.js..."
next build

echo "✅ Build complete!"
