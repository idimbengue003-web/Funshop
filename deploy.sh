#!/bin/bash
# =============================================
# 🚀 FUNSHOP - Déploiement automatique
# =============================================
# Ce script fait TOUT pour toi :
# 1. Installe Vercel CLI
# 2. Change la base en PostgreSQL
# 3. Crée la migration
# 4. Déploie sur Vercel
# 5. Configure la base de données
# 6. Ajoute les données (seed)
#
# UTILISATION : bash deploy.sh
# =============================================

set -e

echo ""
echo "🛒 ============================================"
echo "   FUNSHOP - Déploiement Automatique"
echo "🛒 ============================================"
echo ""

# --- Vérifier que Vercel CLI est installé ---
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# --- Étape 1 : Connexion Vercel ---
echo ""
echo "🔑 Étape 1/6 : Connexion à Vercel"
echo "   → Une page va s'ouvrir dans ton navigateur"
echo "   → Connecte-toi avec GitHub (c'est le plus simple)"
echo ""
vercel login

# --- Étape 2 : Créer la base PostgreSQL sur Vercel ---
echo ""
echo "🗄️ Étape 2/6 : Création de la base de données PostgreSQL"
echo "   → On va créer une base gratuite sur Vercel"
echo ""
echo "⚠️  Si Vercel te demande de choisir, prends :"
echo "   - Region : US East (ou Europe si dispo)"
echo "   - Plan : Free (gratuit)"
echo ""

# Lier le projet Vercel d'abord
echo "📁 Liaison du projet..."
vercel link --yes

# Créer la base Postgres
echo "🗄️ Création de la base PostgreSQL..."
vercel postgres create funshop-db --yes 2>/dev/null || {
    echo ""
    echo "⚠️  La base n'a pas pu être créée automatiquement."
    echo "   Fais-le manuellement :"
    echo "   1. Va sur https://vercel.com/dashboard"
    echo "   2. Clique sur ton projet → Storage → Create Database → Postgres"
    echo "   3. Reviens ici et appuie sur Entrée"
    echo ""
    read -p "   Appuie sur Entrée quand c'est fait..."
}

# Récupérer les variables d'environnement
echo "📥 Récupération de la variable DATABASE_URL..."
vercel env pull .env.production.local 2>/dev/null || true

# --- Étape 3 : Changer le schéma en PostgreSQL ---
echo ""
echo "🔄 Étape 3/6 : Configuration de PostgreSQL..."

# Sauvegarder le schéma SQLite
cp prisma/schema.prisma prisma/schema.sqlite.bak

# Remplacer sqlite par postgresql
sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

# Générer le client Prisma
npx prisma generate

# --- Étape 4 : Créer la migration ---
echo ""
echo "📊 Étape 4/6 : Migration de la base de données..."

# Lire DATABASE_URL depuis .env.production.local
if [ -f .env.production.local ]; then
    export $(grep DATABASE_URL .env.production.local | xargs)
fi

if [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" == postgres* ]]; then
    echo "✅ URL PostgreSQL trouvée, migration en cours..."
    npx prisma migrate dev --name init --skip-seed 2>/dev/null || \
    npx prisma db push
else
    echo "⚠️  DATABASE_URL PostgreSQL non trouvée."
    echo "   Tape ta DATABASE_URL PostgreSQL :"
    echo "   (tu la trouves sur Vercel → Storage → Postgres → .env.local)"
    echo ""
    read -p "   DATABASE_URL = " DATABASE_URL
    export DATABASE_URL
    npx prisma migrate dev --name init --skip-seed 2>/dev/null || \
    DATABASE_URL="$DATABASE_URL" npx prisma db push
fi

# --- Étape 5 : Peupler la base ---
echo ""
echo "🌱 Étape 5/6 : Ajout des produits et vendeurs..."
if [ -n "$DATABASE_URL" ]; then
    DATABASE_URL="$DATABASE_URL" npx tsx prisma/seed.ts
    echo "✅ Base de données peuplée !"
else
    echo "⚠️  Exécute manuellement : DATABASE_URL=xxx npx tsx prisma/seed.ts"
fi

# --- Étape 6 : Déployer ---
echo ""
echo "🚀 Étape 6/6 : Déploiement sur Vercel..."

# Restaurer le schéma SQLite pour le dev local
cp prisma/schema.sqlite.bak prisma/schema.sqlite.prisma

# Déployer
vercel --prod

# --- Nettoyage ---
rm -f .env.production.local prisma/schema.sqlite.bak

echo ""
echo "🎉 ============================================"
echo "   FUNSHOP est en ligne ! 🎉"
echo "🎉 ============================================"
echo ""
echo "   📱 Ton site est accessible à l'URL que Vercel t'a donnée"
echo ""
echo "   🌐 Pour ajouter ton propre domaine (ex: funshop.sn) :"
echo "      1. Va sur https://vercel.com/dashboard"
echo "      2. Clique sur ton projet → Settings → Domains"
echo "      3. Tape ton domaine et suis les instructions"
echo ""
echo "   🔄 Pour remettre le dev local en SQLite :"
echo "      cp prisma/schema.sqlite.prisma prisma/schema.prisma"
echo "      bun run db:push"
echo "      bun run db:seed"
echo ""
