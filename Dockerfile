# Etapa de build
FROM node:18 AS builder
WORKDIR /app

# Copia apenas arquivos de dependências primeiro (para cache eficiente)
COPY package*.json ./
# Instala todas as dependências, incluindo devDependencies (não definimos NODE_ENV aqui)
RUN npm install

# Copia o restante do código (inclui src/, tsconfig.json, etc.)
COPY . .

# (Opcional) Garante que o TypeScript esteja instalado - caso esteja no package.json, não é necessário
RUN npm install -g typescript

# Executa o build do projeto (compila TypeScript para JavaScript em dist/)
RUN npm run build

# Etapa final (imagem de produção)
FROM node:22 AS production
WORKDIR /app

# Copia apenas as dependências de produção do estágio de build 
COPY --from=builder /app/node_modules ./node_modules
# Copia os artefatos compilados e arquivos necessários
COPY --from=builder /app/dist ./dist

# Se houver arquivos estáticos/public ou outros necessários, copie-os também:
# COPY --from=builder /app/public ./public

# Define variável de ambiente para produção
ENV NODE_ENV=production

# Define o comando de inicialização
CMD ["node", "dist/server.js"]
