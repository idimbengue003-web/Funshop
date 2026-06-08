# 🚀 FUNSHOP - Déploiement ULTRA SIMPLE

## Option A : Railway (LE PLUS SIMPLE — 3 clics) ⭐⭐⭐

Railway garde SQLite, pas besoin de changer quoi que ce soit !

1. Va sur **[railway.app](https://railway.app)** → **Login with GitHub**
2. Clique **"New Project"** → **"Deploy from GitHub repo"**
3. Sélectionne ton repo `funshop` → **Deploy** ✅

C'EST TOUT. Railway détecte automatiquement Next.js et déploie.
Tu reçois une URL du type : `funshop-production.up.railway.app`

Pour ajouter ton domaine :
- **Settings** → **Custom Domain** → Tape `funshop.sn`

---

## Option B : Vercel (1 commande)

```bash
# 1. Pousse ton code sur GitHub
git init && git add . && git commit -m "FUNSHOP"
# Crée un repo sur github.com puis :
git remote add origin https://github.com/TON-USER/funshop.git
git push -u origin main

# 2. Déploie en 1 commande
bash deploy.sh
```

Le script fait TOUT automatiquement (connexion, base de données, migration, seed, déploiement).

---

## Option C : Render (3 clics aussi)

1. Va sur **[render.com](https://render.com)** → **Sign Up with GitHub**
2. **New** → **Web Service** → Sélectionne ton repo
3. Build Command : `npm run build`
   Start Command : `npm run start`
   → **Create Web Service** ✅

---

## 🏆 RECOMMANDATION : Railway

C'est le plus simple car :
- ✅ Pas besoin de changer la base de données (SQLite fonctionne)
- ✅ 3 clics et c'est déployé
- ✅ Domaine personnalisé en 1 clic
- ✅ SSL/HTTPS automatique
- ✅ Gratuit pour les petits projets
