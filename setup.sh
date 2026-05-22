#!/bin/bash
# =============================================================
# setup.sh — Cria o projeto MobileTicketsIonic do zero
# Execute: chmod +x setup.sh && ./setup.sh
# =============================================================

set -e

echo "🔧 Verificando dependências..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js não encontrado. Instale em https://nodejs.org"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm não encontrado."; exit 1; }

echo "📦 Instalando Ionic CLI e Angular CLI globalmente..."
npm install -g @ionic/cli @angular/cli 2>/dev/null || true

echo "🚀 Criando projeto Ionic Angular..."
ionic start MobileTicketsIonic tabs --type=angular --capacitor --no-git

cd MobileTicketsIonic

echo "📁 Copiando arquivos do projeto..."
# Descomente se estiver usando este script junto com os arquivos gerados:
# cp -r ../src ./
# cp ../angular.json ./
# cp ../tsconfig.json ./
# cp ../capacitor.config.ts ./
# cp ../ionic.config.json ./
# cp ../.gitignore ./
# cp ../LICENSE ./
# cp ../README.md ./

echo "📦 Instalando dependências..."
npm install

echo "✅ Projeto pronto! Execute:"
echo "   cd MobileTicketsIonic"
echo "   ionic serve"
