# Guia — Tomato Time na Google Play (teste interno)

Guia em português para publicar a app na conta da Play Console e fazer **teste interno** antes de abrir ao público.

**Publicado na Play Store por:** TheStudio9  
**Marca / design:** Studio 9  
**Nome na loja:** Tomato Time  
**Package ID:** `com.studio9.tomatotime`  
**Versão:** 1.0.0  
**Preço:** Grátis  

---

## Pasta Dropbox (o que o Cristóvão envia)

```
Tomato-Time-PlayStore/
├── tomato-time-v1.0.0.aab          ← ficheiro da app (upload na Play Console)
├── icon-512.png                    ← ícone da loja
├── feature-graphic.png             ← banner 1024×500
├── screenshots/
│   ├── 01-ready-to-focus.png
│   ├── 02-session-in-progress.png
│   ├── 03-break-time.png
│   ├── 04-journey-complete.png
│   └── 05-harvest.png
├── guia-teste-interno-pt.md        ← este guia
└── NOTAS.txt                       ← URL da privacy policy (preencher antes do upload)
```

### Nunca enviar por Dropbox/WhatsApp/email

- `tomatotime-release.keystore`
- `keystore.properties`
- `SIGNING_CREDENTIALS.txt`

Estes ficheiros ficam **só com quem desenvolve a app** — são necessários para atualizações futuras.

---

## Antes de começar

1. Conta Google Play Developer **aprovada** (verificação concluída).
2. **URL da política de privacidade** já online (obrigatório).  
   Exemplo de formato: `https://teu-site.github.io/privacy-policy.html`  
   O ficheiro base está em `public/privacy-policy.html` — tem de ser publicado na web, não só no Dropbox.
3. Todos os ficheiros da pasta acima descarregados no PC.

---

## Passo 1 — Criar a app

1. Abrir https://play.google.com/console  
2. Iniciar sessão com a conta Google da developer.  
3. Clicar **「Criar app」** / **「Create app」**.  
4. Preencher:

| Campo | Valor |
|-------|--------|
| Nome da app | Tomato Time |
| Idioma predefinido | English (United States) |
| App ou jogo | App |
| Grátis ou paga | Free |

5. Aceitar declarações (políticas, export EUA, etc.).  
6. Clicar **「Criar app」**.

Isto só regista a app — **ainda não está na loja pública**.

---

## Passo 2 — Ficha da loja (Store listing)

Menu: **Grow → Store presence → Main store listing**

### Nome da app
```
Tomato Time
```

### Descrição curta (máx. 80 caracteres — copiar tal qual)
```
Focus in 25-min bursts. Your tomato travels 4 sessions to complete a journey.
```

### Descrição completa (copiar o bloco inteiro)
```
Tomato Time is a cheerful Pomodoro timer built around a simple idea: focus is a journey, not a countdown.

Instead of watching minutes tick down, you watch your tomato move forward — one step at a time — across four work sessions. Each session is 25 minutes, followed by a 5-minute break. Complete all four and you've finished a full 2-hour journey.

WHY TOMATO TIME?

Most Pomodoro apps look the same: a circle, a countdown, done. Tomato Time is different. Four horizontal tracks show exactly where you are in your cycle. Your tomato mascot changes mood as you work — focused, tired near the end, relaxed on breaks, and celebrating when you finish.

It's designed to feel encouraging, not stressful. Forward counting (1 of 25, not 24:59) keeps your mind on progress, not pressure.

HOW IT WORKS

• Tap Go to start session I — your tomato begins its journey left to right
• Work for 25 minutes, then enjoy a 5-minute break (tomato rests in the centre)
• Repeat for sessions II, III, and IV
• Finish all four sessions and breaks to complete one Journey
• Each completed work session counts as one Tomato in your Harvest

YOUR HARVEST

Track what you've accomplished in tomatoes, not hours:
• Today's tomatoes and journeys
• This week's progress with a 7-day bar chart
• Current streak and all-time totals

Every tomato is a real 25-minute focus session you finished. Every journey is a full 2-hour cycle — a meaningful block of deep work.

FEATURES

• Classic Pomodoro rhythm: 25 min work / 5 min break × 4 sessions
• Visual session tracks — always know which session you're in (I, II, III, IV)
• Friendly tomato mascot with moods that match your session
• Optional sound cues at break start and when break ends
• Harvest stats stored on your device — no account required
• Timer keeps running when the app is in the background
• Notifications when a session or break ends
• Clean, calm design with a light blue palette

PERFECT FOR

• Students preparing for exams
• Developers, designers, and writers doing deep work
• Anyone who wants structured focus without a generic timer
• People learning the Pomodoro Technique for the first time

PRIVACY

Tomato Time stores your harvest stats locally on your device. No sign-up, no cloud sync, no ads. Your focus data stays yours.

Made with care by Studio 9. Published on Google Play by TheStudio9.
```

### Gráficos (upload dos ficheiros da pasta Dropbox)

| Campo | Ficheiro |
|-------|----------|
| Ícone da app | `icon-512.png` |
| Feature graphic | `feature-graphic.png` |
| Screenshots telemóvel | `screenshots/01` … `05` (mínimo 2, recomendado 5) |

### Contacto
- Email de apoio: *(email da Studio 9 ou da conta developer)*

### Política de privacidade
- Colar o **URL público** (ver NOTAS.txt / acordo com Cristóvão).

---

## Passo 3 — Políticas obrigatórias (App content)

Menu: **Policy → App content**

### Content rating (classificação)
1. Iniciar questionário.  
2. Categoria: **Utility, Productivity, Communication, or Other** / Produtividade.  
3. Responder honestamente: sem violência, sem conteúdo sexual, sem apostas, etc.  
4. Submeter → obter classificação (ex.: **Everyone** / PEGI 3).

### Target audience (público-alvo)
- Indicar faixa etária conforme o questionário (ex.: **13+** ou todas as idades se permitido).

### Data safety (segurança dos dados)

Resumo para Tomato Time:

| Pergunta | Resposta sugerida |
|----------|-------------------|
| A app recolhe ou partilha dados? | **Não** (ou apenas dados no dispositivo, sem envio a servidores) |
| Dados encriptados em trânsito | N/A — não há envio de dados pessoais |
| Pedido de eliminação de dados | Utilizador pode limpar dados da app nas definições do Android ou desinstalar |
| Tipo de dados | Estatísticas de uso locais (contagens de sessões) — **armazenadas só no dispositivo** |

Texto de apoio (inglês, se pedirem descrição):
```
Tomato Time does not collect, transmit, or sell personal data. Session counts (tomatoes and journeys) are stored locally on the device only. No account, no analytics SDKs, no ads.
```

### Ads
- **A app contém anúncios?** → **Não**

### Outras declarações
- News app, COVID, governo, etc. → **Não**, salvo se a consola pedir algo específico.

Ir marcando cada item até o dashboard mostrar **sem tarefas críticas em falta**.

---

## Passo 4 — Teste interno (Internal testing)

Menu: **Test and release → Testing → Internal testing**

### 4.1 Criar release
1. Clicar **「Create new release」** / **「Criar nova versão」**.  
2. **Upload** do ficheiro `tomato-time-v1.0.0.aab`.  
3. Aguardar processamento (alguns minutos).  
4. **Release notes** (opcional, inglês):
```
Welcome to Tomato Time v1.0.0 — first internal test.

• 4-session Pomodoro cycle with visual journey tracks
• Tomato mascot, Harvest stats, background timer, notifications
```
5. **Review release** → **Start rollout to Internal testing**.

### 4.2 App signing (primeira vez)
Se aparecer pergunta sobre assinatura:
- Escolher **「Use Google Play App Signing」** (recomendado).  
- A Google gere a chave de distribuição; o AAB já vem assinado para upload.

### 4.3 Adicionar testadores
1. Na página **Internal testing**, secção **Testers**.  
2. **Create email list** — ex.: `Tomato Time testers`.  
3. Adicionar emails **Gmail** de quem vai testar (tu, amiga, etc.).  
4. **Save** → copiar o **link de opt-in** (link de teste).  
5. Enviar o link a cada testador (WhatsApp, email).

### 4.4 Instalar no telemóvel
1. Testador abre o **link de opt-in** no Android.  
2. Aceita participar no teste.  
3. Abre a **Play Store** → procura **Tomato Time** → **Instalar**.  

Pode demorar **15–60 minutos** até o link funcionar após o release.

**Requisitos:** conta Google no telemóvel; Android compatível (API 23+).

---

## Passo 5 — Depois do teste interno

Quando estiver tudo OK:

1. **Closed testing** (opcional) — mais testadores, ainda privado.  
2. **Production** — loja pública; revisão Google (pode levar dias).  

Para cada nova versão, o Cristóvão gera um novo `.aab` e repete upload no canal escolhido.

---

## Checklist rápida (para marcar)

- [ ] Conta developer verificada  
- [ ] App 「Tomato Time」 criada na consola  
- [ ] Store listing preenchida (textos + imagens)  
- [ ] URL da privacy policy ativa  
- [ ] Content rating concluído  
- [ ] Data safety preenchido  
- [ ] AAB carregado em **Internal testing**  
- [ ] Release iniciado no canal interno  
- [ ] Lista de testadores + link enviado  
- [ ] App instalada e testada no telemóvel  

---

## Problemas comuns

| Problema | O que fazer |
|----------|-------------|
| 「Complete setup」 no dashboard | Abrir checklist e fechar todas as tarefas obrigatórias |
| Não deixa fazer upload do AAB | Verificar se políticas e store listing estão completas |
| Link de teste não instala | Esperar 1 h; confirmar email Gmail na lista; mesma conta no telemóvel |
| Privacy policy rejeitada | URL tem de abrir no browser sem password |
| 「Package name already exists」 | Alguém já usou `com.studio9.tomatotime` — avisar o Cristóvão |

---

## Contactos úteis

- Play Console: https://play.google.com/console  
- Ajuda Google: https://support.google.com/googleplay/android-developer  

---

*Documento gerado para Studio 9 — Tomato Time v1.0.0*
