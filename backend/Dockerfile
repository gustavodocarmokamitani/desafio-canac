# Usa uma imagem leve do Python
FROM python:3.10-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de dependências e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Comando para rodar a API quando o container subir
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]