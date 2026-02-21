#!/bin/bash
# Quick Setup Script for Sanklap Event Platform
# Run this to get started quickly after setting up Supabase

echo "🚀 Sanklap Event Platform - Quick Setup"
echo "========================================"
echo ""

# Check Node version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Current: $NODE_VERSION"
if [[ "$NODE_VERSION" < "v20" ]]; then
  echo "   ⚠️  WARNING: Node.js 20+ required"
  echo "   Install: brew install node@20 && brew link node@20 --force"
fi

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "📝 Setup steps:"
echo "1. Edit .env.local with your Supabase credentials:"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key"
echo ""
echo "2. In Supabase, run this SQL:"
echo "   - Open: https://app.supabase.com"
echo "   - Go to SQL Editor"
echo "   - Copy contents of SCHEMA.sql"
echo "   - Run the SQL"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "5. Go to admin setup:"
echo "   http://localhost:3000/admin/setup"
echo "   Password: admin123 (CHANGE THIS!)"
echo ""
echo "6. Add sectors and channels"
echo ""
echo "✅ Setup complete! Your event is ready."
