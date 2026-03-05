#!/bin/bash
echo "🚀 Démarrage automatique de LumenSec..."

# 1. Démarrer PostgreSQL
sudo service postgresql start
echo "✅ PostgreSQL démarré"

# 2. Installer les gems si besoin
cd /workspaces/lumensec-api
bundle check || bundle install

# 3. Démarrer Rails en arrière-plan
bundle exec rails server -b 0.0.0.0 -p 3000 &
echo "✅ Rails démarré sur http://localhost:3000"

# 4. Démarrer Vite en arrière-plan
cd /workspaces/lumensec-api/frontend
npm install 2>/dev/null
npm run dev &
echo "✅ Vite démarré sur http://localhost:5173"

echo "🎉 Tous les services sont UP !"
