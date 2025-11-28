 
FROM docker.io/library/node:20-slim
 

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json ./
COPY package-lock.json ./ 

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar o Next.js
CMD ["npm", "run", "dev"]