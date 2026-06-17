# CLAUDE.md — LumenSec

> Instructions pour Claude Code. Lu automatiquement au démarrage de chaque session.
> Dernière mise à jour : juin 2026

---

## 1. Contexte produit

**LumenSec** est une plateforme SaaS de conformité cybersécurité destinée aux PME québécoises.

Trois wedges produit :
- **Cyber Insurance Readiness Assessment** — score de préparation pour l'assurance cyber
- **Loi 25 / CAI Compliance** — conformité à la loi québécoise sur la protection des données
- **Ransomware Readiness Score** — évaluation de la résilience aux rançongiciels

Fonctionnalités : SOC Dashboard, analyse IA (Gemini), intégration M365, Evidence Pack PDF, audit logs, gestion d'incidents, KPIs.
Langue : bilingue français / anglais (`LanguageContext.tsx`).

> ⚠️ LumenSec ne garantit pas la prévention des rançongiciels, la conformité Loi 25, une réduction de prime d'assurance, ni ne remplace un audit professionnel ou un SOC humain.

---

## 2. Architecture technique

### Structure du repo (monorepo)
```
lumensec-api/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── admin_controller.rb
│   │   ├── alerts_controller.rb
│   │   ├── analysis_results_controller.rb
│   │   ├── dashboard_controller.rb
│   │   ├── kpis_controller.rb
│   │   ├── m365_controller.rb
│   │   └── webhooks_controller.rb
│   ├── models/
│   │   ├── user.rb
│   │   ├── tenant.rb              # Multi-tenancy — critique
│   │   ├── incident.rb
│   │   ├── analysis_result.rb
│   │   ├── evidence_pack.rb
│   │   ├── insurance_assessment.rb
│   │   ├── m365_alert.rb
│   │   ├── m365_credential.rb
│   │   └── webhook_event.rb
│   └── services/
│       ├── immune_analysis_service.rb    # Analyse Gemini
│       ├── insurance_scoring_engine.rb   # Score cyber insurance
│       └── m365_integration_service.rb   # Microsoft 365
├── config/
│   ├── routes.rb
│   ├── initializers/
│   │   ├── gemini.rb              # Config Gemini — modèle défini ici
│   │   ├── cors.rb
│   │   └── grover.rb
│   └── credentials.yml.enc        # ⛔ Ne jamais lire ni afficher
├── db/
│   ├── migrate/                   # Ne jamais modifier après deploy
│   └── schema.rb                  # Généré auto — ne jamais modifier
├── frontend/                      # React + Vite TypeScript
│   ├── components/
│   ├── contexts/LanguageContext.tsx
│   ├── services/api.ts
│   └── vite.config.ts
├── render.yaml
└── vercel.json
```

### Stack
| Couche | Technologie |
|--------|-------------|
| Backend | Ruby on Rails 7.2 |
| Auth | JWT custom + bcrypt (pas Devise) |
| Base de données | PostgreSQL via Supabase |
| IA | Gemini AI (gem `gemini-ai ~> 4.2`) |
| PDF | Grover (HTML → PDF) |
| Frontend | React + Vite TypeScript — dans `/frontend/` |
| Deploy backend | Render (`render.yaml`) |
| Deploy frontend | Vercel (`vercel.json`) |

### Routes actives
```ruby
GET  /health
GET  /dashboard/stats
GET  /m365/alerts
GET  /m365/credentials
POST /alerts/:id/analyze
```

---

## 3. Isolation projet — règle absolue

LumenSec est un projet sensible et séparé de Compass.

**Opérer uniquement dans le repo LumenSec courant.**

Interdit d'accéder, lire ou modifier :
- les dépôts Compass (`compass-api`, `compass-web`)
- tout autre projet SaaS
- Documents, Desktop, Downloads, OneDrive
- fichiers personnels
- dossiers parents hors repo

Avant toute action, confirmer le contexte :
```bash
pwd
git status --short
git branch --show-current
```
Si le chemin n'est pas clairement le repo LumenSec → **stopper immédiatement**.

---

## 4. Démarrage de session — READ-ONLY uniquement

Au début d'une session, exécuter **uniquement** :
```bash
pwd
git status --short
git branch --show-current
git log --oneline -5
```

Ne **jamais** lancer automatiquement :
```
git pull origin main     → risque de merge, écrasement contexte local
bundle install           → peut modifier le lockfile
npm install              → peut modifier node_modules
rails db:migrate         → peut toucher la DB Supabase/Render
rails s                  → non nécessaire pour lire du code
npm run dev              → non nécessaire pour lire du code
```

Ces commandes nécessitent une raison explicite et doivent être **proposées avant exécution**.

---

## 5. Règles Git

```
❌ Commit direct sur main
❌ git push sans validation humaine
❌ git pull origin main  (sauf demande explicite)
❌ git reset
❌ git checkout --
❌ git restore
❌ git clean
❌ git rebase
❌ git push --force
```

Convention de branches :
```
claude/description-courte
fix/description-courte
feat/description-courte
security/description-courte
```

---

## 6. Règles DB / Migrations — toutes sensibles

Toute commande DB est sensible car `DATABASE_URL` peut pointer vers Supabase/Render/prod.

**Interdites sans validation explicite :**
```
rails db:migrate
rails db:rollback
rails db:seed
rails db:schema:load
rails db:drop
rails db:reset
```

Avant toute migration, afficher (sans valeur) :
```bash
echo "DATABASE_URL is set: ${DATABASE_URL:+yes}"
rails db:version
git status --short
```

Ne jamais modifier :
- `db/schema.rb` directement
- une migration déjà appliquée
- des données existantes sans plan de rollback

---

## 7. Secrets — ne jamais afficher, copier ni committer

```
.env  /  .env.local  /  .env.production
config/master.key
config/credentials.yml.enc
Render env vars
Supabase keys (anon / service_role)
GEMINI_API_KEY
M365 client secret
JWT secret
```

Si un secret apparaît dans un diff ou une sortie terminal → **stopper immédiatement**.

---

## 8. Multi-tenancy — critique

Séparation des données via le modèle `Tenant`. Toute requête DB doit filtrer par tenant.

```ruby
# ✅ Toujours
current_tenant.incidents.find(params[:id])
current_tenant.insurance_assessments

# ❌ Jamais — BOLA/IDOR
Incident.find(params[:id])
InsuranceAssessment.all
```

---

## 9. Auth JWT — ne jamais affaiblir

- Gem : `bcrypt` + `jwt` (pas Devise)
- Tokens vérifiés dans `application_controller.rb`
- Ne jamais contourner ni affaiblir les guards d'auth
- Ne jamais stocker de tokens en clair

---

## 10. Gemini AI

- Gem : `gemini-ai ~> 4.2`
- Config dans `config/initializers/gemini.rb`
- Utilisé dans `immune_analysis_service.rb`
- **Ne jamais changer le modèle Gemini sans validation explicite**
- Utiliser le modèle configuré dans l'initializer ou les variables d'environnement

---

## 11. Cybersécurité défensive — périmètre autorisé

LumenSec est un produit **défensif uniquement**.

**Autorisé :**
- audit de code
- revue sécurité
- amélioration dashboard
- scoring de préparation
- suivi de remédiation
- preuve documentaire / Evidence Pack
- conformité Loi 25
- alerting interne
- tests unitaires de logique interne

**Interdit sans validation humaine explicite :**
- scan réseau
- pentest / exploitation
- brute force / credential testing
- phishing ou simulation offensive
- appels vers systèmes tiers non configurés
- automatisation d'attaque

---

## 12. Routing des modèles (catégories génériques)

| Type de tâche | Niveau recommandé |
|---|---|
| Lecture rapide, grep, inspection | Modèle léger |
| Patch standard, ajout feature | Modèle intermédiaire |
| Architecture, sécurité, auth, tenant, conformité | Modèle fort |

Ne pas figer des noms de modèles spécifiques dans les règles projet — ils évoluent.

---

## 13. Sécurité — priorités en cours

- [ ] Isolation tenant sur tous les modèles (BOLA/IDOR)
- [ ] Audit JWT : secret fort, expiration, rotation
- [ ] Validation scopes OAuth M365
- [ ] `bundle audit` — dépendances Ruby
- [ ] `npm audit` — dépendances frontend
- [ ] Revue RBAC (modèle User → rôles)

> Règle : audit lecture seule avant tout patch. Backend avant frontend. Jamais les deux simultanément.

---

## 14. Déploiement

| Composant | Plateforme | Config |
|-----------|-----------|--------|
| Backend Rails | Render | `render.yaml` |
| Frontend React/Vite | Vercel | `vercel.json` |
| PostgreSQL | Supabase | `DATABASE_URL` dans Render env |

> ⚠️ Loi 25 : valider que la région Supabase est Canada Central.

