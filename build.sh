#!/bin/bash
# Build script for Bulldog Dermatitis Handbook site
# Pattern: static site with self-contained visualizations
# Re-usable template for any knowledge-base project

set -e

DIST="dist"
SITE="site"
VIZ="viz"
DATA="data"

echo "=== Building Bulldog Dermatitis Handbook ==="

# Clean
rm -rf "$DIST"
mkdir -p "$DIST/css" "$DIST/viz" "$DIST/data"

# Copy site files
cp "$SITE"/*.html "$DIST/"
cp "$SITE/css/"*.css "$DIST/css/"

# Copy visualizations (self-contained HTML)
cp "$VIZ"/*.html "$DIST/viz/" 2>/dev/null || echo "No viz files yet"

# Copy data
cp "$DATA"/*.json "$DIST/data/" 2>/dev/null || echo "No data files yet"

# Copy PDF handbook if present
if [ -f "bulldog_dermatitis_handbook.pdf" ]; then
  cp bulldog_dermatitis_handbook.pdf "$DIST/"
  echo "  -> Handbook PDF copied"
fi

# Template replacements in index.html
SECTION_COUNT=20
REF_COUNT=17
if [ -f "$DIST/index.html" ]; then
  sed -i '' "s/{{SECTION_COUNT}}/$SECTION_COUNT/g" "$DIST/index.html" 2>/dev/null || true
  sed -i '' "s/{{REF_COUNT}}/$REF_COUNT/g" "$DIST/index.html" 2>/dev/null || true
  sed -i '' "s/{{BUILD_DATE}}/$(date +%Y-%m-%d)/g" "$DIST/index.html" 2>/dev/null || true
fi

echo "=== Build complete -> $DIST/ ==="
echo ""
echo "To preview: npx serve $DIST"
echo "To deploy:  npx wrangler pages deploy $DIST --project-name=bulldog-derm"
