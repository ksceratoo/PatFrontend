#!/bin/bash

echo "🔍 Checking mbcheck build status..."
echo ""

# Check if mbcheck-linux exists
if [ -f "patCom/paterl/mbcheck/mbcheck-linux" ]; then
    echo "✅ mbcheck-linux binary found!"
    echo "📊 Binary info:"
    file patCom/paterl/mbcheck/mbcheck-linux
    ls -la patCom/paterl/mbcheck/mbcheck-linux
    echo ""
else
    echo "❌ mbcheck-linux binary not found yet"
    echo "📋 This means either:"
    echo "   - GitHub Action is still running"
    echo "   - GitHub Action failed"
    echo "   - Git pull needed to get the latest changes"
    echo ""
fi

# Check if regular mbcheck exists (local)
if [ -f "patCom/paterl/mbcheck/mbcheck" ]; then
    echo "✅ Local mbcheck binary found (for development)"
else
    echo "❌ Local mbcheck binary not found"
fi

echo ""
echo "🌐 To check GitHub Actions status:"
echo "   Visit: https://github.com/ksceratoo/PatFrontend/actions"
echo ""
echo "🔄 To refresh from GitHub:"
echo "   Run: git pull origin main"
echo ""
echo "🧪 To test the type checker:"
echo "   Local: npm run dev (uses local mbcheck if available, fallback otherwise)"
echo "   Cloud: Visit your Vercel deployment"
