# Publicar a Privacy Policy no GitHub Pages

## URLs depois de ativar (substituir USER e REPO)

| Página | URL |
|--------|-----|
| Principal (recomendada para a Play Store) | `https://USER.github.io/REPO/` |
| Alternativa | `https://USER.github.io/REPO/privacy-policy.html` |

Exemplo se o repositório for `crist/tomatotime`:
`https://crist.github.io/tomatotime/`

---

## Passo 1 — Criar repositório no GitHub

1. https://github.com/new  
2. Nome sugerido: `tomatotime` (ou `tomato-time-privacy`)  
3. **Public** (obrigatório para Pages grátis sem complicações)  
4. **Não** marcar “Add README” se já vais fazer push do projeto local  
5. Criar repositório  

---

## Passo 2 — Enviar código (no PC, pasta Pomodoro)

```powershell
cd "c:\Users\crist\Documents\Pomodoro"

git init
git add .
git commit -m "Tomato Time: app, Play Store assets, privacy policy for GitHub Pages"

git branch -M main
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

Substituir `USER` e `REPO` pelo teu utilizador e nome do repositório.

*(Na primeira vez o GitHub pode pedir login no browser ou token.)*

---

## Passo 3 — Ativar GitHub Pages

1. No GitHub: repositório → **Settings** → **Pages**  
2. **Build and deployment** → Source: **Deploy from a branch**  
3. Branch: **main** → Folder: **/docs** → **Save**  
4. Esperar 1–3 minutos  
5. Aparece link verde: `https://USER.github.io/REPO/`

Abrir esse link no telemóvel/browser — deve mostrar a Privacy Policy do Tomato Time.

---

## Passo 4 — Play Console e Dropbox

Colar o URL em:

- Play Console → Store listing → Privacy policy  
- `play-store/NOTAS.txt`  
- Enviar o link à amiga no Dropbox  

---

## Atualizar a política no futuro

1. Editar `public/privacy-policy.html`  
2. Copiar para `docs/index.html` e `docs/privacy-policy.html` (ou correr o script abaixo)  
3. `git add docs/ public/privacy-policy.html` → `git commit` → `git push`  
4. Pages atualiza em ~1 minuto  

```powershell
Copy-Item public/privacy-policy.html docs/index.html
Copy-Item public/privacy-policy.html docs/privacy-policy.html
```

---

## Ficheiros servidos pela Pages (pasta `docs/`)

- `index.html` — política (URL curta)  
- `privacy-policy.html` — mesma política  
- `icon-512.png` — ícone no cabeçalho  
- `.nojekyll` — evita que o Jekyll ignore ficheiros estáticos  
