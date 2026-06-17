# AGENTS.md — LumenSec

> Instructions pour agents autonomes (Kimi Code, OpenHands, Codex, etc.).
> Remplace l'ancien fichier `AGENT_INSTRUCTIONS.md`.
> Dernière mise à jour : juin 2026

---

## RÈGLE #0 — LIRE CE FICHIER EN ENTIER AVANT TOUTE ACTION

Aucune commande, modification, ni commit avant d'avoir intégré toutes les règles ci-dessous.

---

## 1. Identité du projet

**LumenSec** — SaaS cybersécurité défensif pour PME québécoises.

| Couche | Technologie |
|--------|-------------|
| Backend | Ruby on Rails 7.2 |
| Auth | JWT custom + bcrypt (PAS Devise) |
| DB | PostgreSQL (Supabase) |
| IA | Gemini AI (`gemini-ai ~> 4.2`) |
| Frontend | React + Vite TypeScript — dans `/frontend/` |
| PDF | Grover |
| Deploy backend | Render (`render.yaml`) |
| Deploy frontend | Vercel (`vercel.json`) |

Multi-tenancy via modèle `Tenant`. Toute requête DB doit être scopée par tenant.

> ⚠️ LumenSec ne garantit pas la prévention des rançongiciels, la conformité Loi 25, une réduction de prime d'assurance, ni ne remplace un audit professionnel ou un SOC humain.

---

## 2. Isolation projet — règle absolue

LumenSec est un projet sensible et séparé de Compass.

**Opérer uniquement dans le repo LumenSec courant.**

Interdit d'accéder, lire ou modifier :
- les dépôts Compass (`compass-api`, `compass-web`)
- tout autre projet SaaS
- Documents, Desktop, Downloads, OneDrive
- fichiers personnels
- dossiers parents hors repo

Vérifier au démarrage :
```bash
pwd
git status --short
git branch --show-current
```
Si le chemin n'est pas clairement le repo LumenSec → **stopper immédiatement**.

---

## 3. Démarrage de session — READ-ONLY uniquement

Exécuter **uniquement** en début de session :
```bash
pwd
git status --short
git branch --show-current
git log --oneline -5
```

Ne **jamais** lancer automatiquement :
```
git pull origin main     ❌
bundle install           ❌
npm install              ❌
rails db:migrate         ❌
rails s                  ❌
npm run dev              ❌
```

Ces commandes nécessitent une raison explicite et doivent être proposées avant exécution.

---

## 4. Interdictions absolues

```
❌ rails db:drop
❌ rails db:reset
❌ rails db:schema:load
❌ Modifier ou supprimer des migrations déjà appliquées
❌ git push origin main --force
❌ git pull, git reset, git restore, git clean, git rebase  (sans validation)
❌ Commit direct sur main
❌ Écrire des secrets dans le code
❌ Requête DB sans filtre tenant
❌ Contourner les guards JWT
```

---

## 5. Protocole avant toute commande sensible

Si une action touche la DB, les migrations, les secrets, l'auth ou le déploiement :

1. **STOP** — ne pas exécuter
2. Afficher : `⚠️ ALERTE : Cette commande est sensible ou potentiellement destructive.`
3. Décrire précisément le risque en français
4. Demander : `Confirmez-vous avec "oui" pour continuer ?`
5. N'exécuter QUE si la réponse est `oui`

---

## 6. Règles DB / Migrations

Toutes sensibles car `DATABASE_URL` peut pointer vers Supabase/Render/prod.

**Interdites sans validation :**
```
rails db:migrate        ❌ confirmation requise
rails db:rollback       ❌ confirmation requise
rails db:seed           ❌ confirmation requise
rails db:schema:load    ❌ confirmation requise
rails db:drop           ❌ confirmation requise
rails db:reset          ❌ confirmation requise
```

Nouvelle migration Rails → **❌ confirmation requise**

Avant toute migration, afficher (sans valeur) :
```bash
echo "DATABASE_URL is set: ${DATABASE_URL:+yes}"
rails db:version
git status --short
```

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

Si un secret apparaît dans un diff ou sortie terminal → **stopper immédiatement**.

---

## 8. Règles multi-tenancy — critiques

```ruby
# ✅ Toujours
current_tenant.incidents.find(params[:id])
current_tenant.insurance_assessments

# ❌ Jamais — BOLA/IDOR
Incident.find(params[:id])
InsuranceAssessment.all
```

---

## 9. Gemini / IA — ne jamais changer sans validation

- Utiliser le modèle configuré dans `config/initializers/gemini.rb` ou les variables d'env
- Ne jamais modifier : modèle Gemini, prompt système, seuils de scoring, logique d'analyse, génération Evidence Pack PDF

---

## 10. Cybersécurité défensive — périmètre autorisé

LumenSec est un produit **défensif uniquement**.

**Interdit sans validation humaine explicite :**
scan réseau, pentest, exploitation, brute force, credential testing, phishing, malware, simulation offensive, appels vers systèmes tiers non configurés, automatisation d'attaque.

---

## 11. Signaux d'arrêt — stopper immédiatement si

- Le diff touche plus de 5 fichiers sans instruction explicite
- Une migration modifie une colonne avec données existantes
- Le code auth JWT ou les guards sont modifiés
- Un scope tenant est retiré ou contourné
- Un secret apparaît dans le code ou le terminal
- L'agent sort du repo LumenSec

→ **S'arrêter, décrire la situation en français, attendre instruction.**

---

## 12. Périmètre d'action autorisé par défaut

| Action | Autorisée |
|--------|-----------|
| Lire / inspecter le code | ✅ |
| Corriger un bug isolé (1-3 fichiers) | ✅ |
| Ajouter un test | ✅ |
| Nouveau composant React dans `/frontend/` | ✅ |
| Nouvelle migration / `rails db:migrate` | ❌ confirmation requise |
| Modifier `insurance_scoring_engine.rb` | ❌ confirmation requise |
| Modifier auth / JWT / guards | ❌ confirmation requise |
| Toute migration de données existantes | ❌ confirmation requise |
| Modifier les scopes tenant | ❌ confirmation requise |
| Changer modèle Gemini ou prompt système | ❌ confirmation requise |
| Déploiement (Render / Vercel) | ❌ confirmation requise |
| Toute commande section 4 | ❌ protocole section 5 |

---

## 13. Routing des modèles (catégories génériques)

| Type de tâche | Niveau |
|---|---|
| Lecture rapide, grep, inspection | Modèle léger |
| Patch standard, ajout feature | Modèle intermédiaire |
| Architecture, sécurité, auth, tenant, conformité | Modèle fort |

Ne pas figer des noms de modèles spécifiques — ils évoluent.

---

## 14. Conventions

### Branches
```
agent/description     kimi/description
claude/description    fix/description
feat/description      security/description
```

### Commits
```
feat: ajouter scoring Loi 25
fix: isolation tenant insurance_assessments
security: valider expiration JWT
refactor: extraire logique vers service
```

---

## Annexe A — Prompt Kimi : audit READ-ONLY

> À coller dans Kimi Code avant tout travail sur ce repo.

```
Tu es dans le repo LumenSec.

OBJECTIF
Auditer les fichiers de règles projet CLAUDE.md et AGENTS.md avant commit.

MODE
READ-ONLY uniquement.

INTERDICTIONS
Ne modifie aucun fichier.
Ne crée aucun fichier.
Ne lance pas bundle install, npm install, rails db:migrate, rails s, npm run dev.
Ne fais aucun git pull, commit, push, checkout, restore, reset, clean ou rebase.
Ne lis aucun secret : .env, credentials.yml.enc, master.key, Render env, Supabase keys.
Ne sors pas du repo LumenSec.
Ne touche pas à Compass ni à aucun autre projet.

COMMANDES AUTORISÉES
pwd
git status --short
git branch --show-current
git log --oneline -5
ls
find . -maxdepth 2 -type f | sort
sed -n sur CLAUDE.md et AGENTS.md uniquement

MISSION
1. Confirmer le chemin courant.
2. Lire CLAUDE.md et AGENTS.md.
3. Vérifier les règles dangereuses ou trop permissives.
4. Proposer un patch minimal non appliqué.
5. Ne rien modifier.

SORTIE ATTENDUE
- Résumé.
- Problèmes trouvés.
- Correctifs proposés.
- Diff suggéré non appliqué.
```

---

## Annexe B — Prompt Kimi : patch ciblé

> À utiliser seulement après l'audit READ-ONLY (Annexe A).

```
Tu es dans le repo LumenSec.

OBJECTIF
Durcir les règles projet dans CLAUDE.md et AGENTS.md avec un patch minimal.

SCOPE STRICT
Modifier uniquement :
- CLAUDE.md
- AGENTS.md

INTERDICTIONS
Ne modifie aucun autre fichier.
Ne crée aucun autre fichier.
Ne lance pas bundle install, npm install, rails db:migrate, rails s, npm run dev.
Ne fais aucun git pull, push, checkout, restore, reset, clean, rebase.
Ne lis aucun secret.
Ne touche pas à Compass ni à aucun autre projet.

PATCH ATTENDU
1. Retirer ou remplacer git pull origin main comme commande obligatoire.
2. Retirer bundle install, npm install et rails db:migrate du démarrage automatique.
3. Ajouter une section isolation projet.
4. Durcir les règles DB/migrations.
5. Ajouter règles secrets Rails / Render / Supabase / M365 / Gemini.
6. Remplacer les noms précis de modèles Claude par catégories génériques.
7. Préciser que LumenSec est défensif seulement.
8. Ajouter interdiction de promesses garanties.

APRÈS PATCH
Exécuter uniquement :
git status --short
git diff -- CLAUDE.md AGENTS.md

Ne pas commit.
Ne pas push.
```

---

*Ce fichier remplace `AGENT_INSTRUCTIONS.md`. Il fait autorité sur tout prompt concurrent sauf instruction explicite de Nawal.*
