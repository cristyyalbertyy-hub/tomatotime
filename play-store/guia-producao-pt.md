# Guia — Publicar Tomato Time na Google Play (Production)

**App:** Tomato Time · **Package:** `com.studio9.tomatotime` · **Versão:** 1.1.0 (code 3)  
**Developer:** TheStudio9 · **Preço:** Grátis  
**Contacto loja:** hello@studio9medical.com

---

## Pasta para enviar à TheStudio9

```
play-store/
├── tomato-time-v1.1.0.aab
├── icon-512.png
├── feature-graphic.png
├── screenshots/
│   ├── 01-ready-to-focus.png
│   ├── 02-session-in-progress.png
│   ├── 03-break-time.png
│   ├── 04-journey-complete.png
│   └── 05-harvest.png
├── NOTAS.txt
└── (este guia)
```

**Nunca enviar:** keystore, `keystore.properties`, `SIGNING_CREDENTIALS.txt`.

---

## Passo 1 — Confirmar preço

**Monetize → Products → App pricing** → **Free** (sem IAP).

---

## Passo 2 — Ficha da loja

**Grow → Store presence → Main store listing**

| Campo | Valor |
|-------|--------|
| Nome | Tomato Time |
| Categoria | Productivity |
| Email | hello@studio9medical.com |
| Privacy policy | https://cristyyalbertyy-hub.github.io/tomatotime/privacy-policy.html |
| Website | https://studio9medical.com/tomato-time/ |

Textos completos: `docs/play-store-listing.md` (copiar descrição curta + longa).

Upload: `icon-512.png`, `feature-graphic.png`, screenshots (mín. 2).

---

## Passo 3 — App content (obrigatório)

**Policy → App content** — fechar todas as tarefas:

| Item | Resposta |
|------|----------|
| Content rating | Productivity, sem conteúdo sensível → **Everyone** |
| Target audience | 13+ (ou conforme questionário) |
| Ads | **No** |
| Data safety | Não recolhe/transmite dados; stats locais no dispositivo |
| App access | Funciona sem login |
| Health / News / COVID | **No** |

Data safety (inglês):
```
Tomato Time does not collect, transmit, or sell personal data. Session counts (tomatoes and journeys) are stored locally on the device only. No account, no analytics SDKs, no ads.
```

---

## Passo 4 — Production release

1. **Test and release → Production → Create new release**
2. Upload `tomato-time-v1.1.0.aab`
3. Release notes (copiar de `docs/play-store-listing.md` → What's New v1.1.0)
4. **Review release → Start rollout to Production**
5. Seleccionar países/regiões
6. Submeter — revisão Google: **1–7 dias** (1.ª vez em Production)

---

## Passo 5 — Depois de aprovada

- Procurar "Tomato Time" na Play Store (TheStudio9)
- Adicionar badge/link em studio9medical.com/tomato-time/
- Actualizações futuras: novo AAB + `versionCode` maior

---

## Checklist

- [ ] Dashboard sem tarefas críticas em falta
- [ ] Privacy URL abre no browser
- [ ] AAB v1.1.0 (versionCode 3)
- [ ] Screenshots actualizados
- [ ] Preço Free confirmado
- [ ] Production release submetida

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| Version code already used | Pedir AAB com code maior |
| Complete setup | Fechar App content + store listing |
| Privacy inválida | URL HTTPS pública, sem login |

*Studio 9 — Tomato Time v1.1.0*
