# 📖 Instruções Completas — MobileTicketsIonic

## 1. PRÉ-REQUISITOS

Instale antes de começar:

```bash
# Node.js 18+ (baixe em https://nodejs.org)
node -v   # deve mostrar v18 ou superior

# Ionic CLI
npm install -g @ionic/cli

# Angular CLI
npm install -g @angular/cli
```

---

## 2. CRIAÇÃO DO PROJETO

```bash
ionic start MobileTicketsIonic tabs --type=angular --capacitor
cd MobileTicketsIonic
```

---

## 3. SUBSTITUIÇÃO DOS ARQUIVOS

Após criar o projeto, **substitua** os arquivos gerados pelo Ionic com os arquivos deste pacote:

```
Copie de:                                    Para dentro de MobileTicketsIonic/:
───────────────────────────────────────────────────────────────────────────────
src/main.ts                             →  src/main.ts
src/index.html                          →  src/index.html
src/global.scss                         →  src/global.scss
src/manifest.webmanifest                →  src/manifest.webmanifest
src/theme/variables.scss                →  src/theme/variables.scss
src/app/app.module.ts                   →  src/app/app.module.ts
src/app/app-routing.module.ts           →  src/app/app-routing.module.ts
src/app/app.component.ts                →  src/app/app.component.ts
src/app/app.component.html              →  src/app/app.component.html
src/app/tabs/tabs.module.ts             →  src/app/tabs/tabs.module.ts
src/app/tabs/tabs-routing.module.ts     →  src/app/tabs/tabs-routing.module.ts
src/app/tabs/tabs.page.ts               →  src/app/tabs/tabs.page.ts
src/app/tabs/tabs.page.html             →  src/app/tabs/tabs.page.html
src/app/models/ticket.model.ts          →  src/app/models/ticket.model.ts
src/app/models/queue.model.ts           →  src/app/models/queue.model.ts
src/app/services/queue.service.ts       →  src/app/services/queue.service.ts
src/app/pages/totem/totem.module.ts     →  src/app/pages/totem/totem.module.ts
src/app/pages/totem/totem.page.ts       →  src/app/pages/totem/totem.page.ts
src/app/pages/totem/totem.page.html     →  src/app/pages/totem/totem.page.html
src/app/pages/totem/totem.page.scss     →  src/app/pages/totem/totem.page.scss
src/app/pages/attendant/               →  src/app/pages/attendant/ (todos os arquivos)
src/app/pages/panel/                   →  src/app/pages/panel/ (todos os arquivos)
src/app/pages/reports/                 →  src/app/pages/reports/ (todos os arquivos)
angular.json                            →  angular.json
tsconfig.json                           →  tsconfig.json
capacitor.config.ts                     →  capacitor.config.ts
ionic.config.json                       →  ionic.config.json
.gitignore                              →  .gitignore
LICENSE                                 →  LICENSE
README.md                               →  README.md
```

**Delete** as pastas de páginas padrão criadas pelo template:

```bash
rm -rf src/app/tab1 src/app/tab2 src/app/tab3
```

---

## 4. INSTALAÇÃO E EXECUÇÃO

```bash
npm install
ionic serve
```

O app abrirá em `http://localhost:8100`.

---

## 5. ESTRUTURA DE PASTAS A CRIAR MANUALMENTE

Se algumas pastas não existirem, crie-as:

```bash
mkdir -p src/app/models
mkdir -p src/app/services
mkdir -p src/app/pages/totem
mkdir -p src/app/pages/attendant
mkdir -p src/app/pages/panel
mkdir -p src/app/pages/reports
mkdir -p src/app/tabs
mkdir -p docs/screenshots
```

---

## 6. CAPTURAS DE TELA PARA O README

Após executar `ionic serve`, tire prints de:

1. **Totem** → clique em SP, SE ou SG e mostre a senha gerada
2. **Atendente** → clique "Chamar Próxima Senha" com fila populada
3. **Painel** → mostre a tela com histórico de chamadas
4. **Relatórios** → aba com dados preenchidos

Salve em `docs/screenshots/` com os nomes:
- `totem.png`
- `attendant.png`
- `panel.png`
- `reports.png`

---

## 7. PUBLICAR NO GITHUB

```bash
# Dentro da pasta MobileTicketsIonic:
git init
git add .
git commit -m "feat: projeto MobileTicketsIonic completo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/MobileTicketsIonic.git
git push -u origin main
```

Crie o repositório **público** em <https://github.com/new> com o nome exato `MobileTicketsIonic` antes de executar o push.

---

## 8. CHECKLIST FINAL

- [ ] Projeto Ionic Angular com template `tabs`
- [ ] Tipo Angular com **ngModules**
- [ ] Integração Capacitor configurada
- [ ] Tela Totem funcional (emissão SP/SE/SG)
- [ ] Tela Atendente com lógica de prioridade [SP]→[SE|SG]
- [ ] Painel público com últimas 5 chamadas (sem mostrar próxima)
- [ ] Relatório diário com quantitativos e detalhamento
- [ ] Formato de senha `YYMMDD-PPSQ` implementado
- [ ] 5% de desistência do cliente implementado
- [ ] Expediente 07:00–17:00 implementado
- [ ] Repositório público no GitHub
- [ ] Nome do repositório: `MobileTicketsIonic`
- [ ] Branch: `main`
- [ ] Arquivo `LICENSE` (MIT)
- [ ] Arquivo `README.md` com 3+ screenshots
- [ ] `.gitignore` com `node_modules/` excluído
