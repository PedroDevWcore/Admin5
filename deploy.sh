#!/bin/bash

# Script de deploy para o painel administrativo
echo "🚀 Iniciando deploy do painel administrativo..."

# Parar o servidor se estiver rodando
echo "⏹️ Parando servidor existente..."
pkill -f "node server/app.js" || true

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do frontend
echo "🏗️ Fazendo build do frontend..."
npm run build:prod

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    echo "❌ Erro: Diretório dist não foi criado!"
    exit 1
fi

# Copiar arquivos para o diretório de produção (ajuste o caminho conforme necessário)
echo "📁 Copiando arquivos..."
# sudo cp -r dist/* /var/www/samhost/Admin/
# sudo cp -r server /var/www/samhost/
# sudo cp package*.json /var/www/samhost/
# sudo cp .env /var/www/samhost/

# Reiniciar o Nginx (se necessário)
echo "🔄 Reiniciando Nginx..."
# sudo systemctl reload nginx

# Iniciar o servidor
echo "🚀 Iniciando servidor..."
npm run server &

echo "✅ Deploy concluído!"
echo "🌐 Painel administrativo disponível em: http://samhost.wcore.com.br/Admin"
echo "🔧 API disponível em: http://samhost.wcore.com.br/Admin/api"

# Verificar se o servidor está rodando
sleep 3
if curl -f http://localhost:3002/Admin/api/health > /dev/null 2>&1; then
    echo "✅ Servidor está rodando corretamente!"
else
    echo "❌ Erro: Servidor não está respondendo!"
    exit 1
fi