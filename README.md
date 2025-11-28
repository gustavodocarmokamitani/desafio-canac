# ☁️ Desafio Clima - API Wrapper & Frontend

## Visão Geral do Projeto

Este projeto consiste em uma aplicação web completa para visualização de dados climáticos. A arquitetura é dividida em dois serviços principais: um **Backend (API Wrapper)** para buscar, consolidar e transformar os dados de clima, e um **Frontend (Interface do Usuário)** para apresentar esses resultados.

Toda a solução é orquestrada de forma eficiente e isolada através do **Docker Compose**.

---

## 🚀 Tecnologias Utilizadas

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Orquestração** | **Docker & Docker Compose** | Contêineres e orquestração de ambientes. |
| **Backend** | **Python (FastAPI)** | Criação da API *wrapper* assíncrona de alta performance. |
| **Requisições** | **httpx** | Cliente HTTP assíncrono para comunicação com APIs externas. |
| **Frontend** | **Next.js 14+ (React/TypeScript)** | Framework para a interface do usuário. |
| **Estilização** | **Tailwind CSS** | Framework CSS utilitário para design rápido e responsivo. |

---

## 📦 Como Rodar a Aplicação

Este projeto foi desenhado para ser executado integralmente via Docker.

### Pré-requisitos

Certifique-se de ter o **Docker Desktop** (que inclui o Docker Engine e o Docker Compose) instalado na sua máquina.

### Passos para Inicialização

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/gustavodocarmokamitani/desafio-canac.git
    ```
    ```bash
    cd desafio-canac
    ```
2.  **Construir e Iniciar os Contêineres:**

    Execute o comando `docker compose up` para construir as imagens e iniciar os serviços em *background*:

    ```bash
    docker compose up
    ```
    * O serviço **`backend`** (FastAPI) estará acessível na porta `8000`.
    * O serviço **`frontend`** (Next.js) estará acessível na porta `3000`.

3.  **Acessar a Aplicação:**

    Após a inicialização, acesse a interface do usuário no seu navegador:

    ```
    http://localhost:3000
    ```

---

## 📐 Decisões de Arquitetura e Design

### 1. Arquitetura em Camadas (Wrapper API)

* **Separação de Responsabilidades:** O **Backend (FastAPI)** atua como um *wrapper*, isolando o frontend da complexidade das APIs externas (Open-Meteo). Sua função é **tratar erros**, **buscar coordenadas** e **unificar/simplificar os dados** em um formato JSON ideal para consumo pelo frontend.
* **Performance:** Uso do `httpx` assíncrono para evitar o bloqueio do servidor enquanto aguarda as respostas das APIs de terceiros.

### 2. Tratamento de Dados Simplificado (Backend)

Para priorizar a **simplicidade** e cumprir o escopo, a lógica de sincronização de dados foi simplificada:

* Os dados de **temperatura** e **vento** são extraídos da seção `current_weather`.
* Dados horários como **umidade** e **precipitação** são extraídos da **primeira entrada `[0]`** da lista de dados horários (`hourly`), assumindo que esta é a hora cheia mais próxima da medição atual.

### 3. Frontend (Next.js)

* **Tipagem Forte (TypeScript):** Utilizada em todos os componentes e na camada de API para garantir a integridade dos dados na comunicação com o backend.
* **Componentização:** A interface é construída com componentes reutilizáveis e estilizada utilizando **Tailwind CSS** para um design *mobile-first* e responsivo.

---

## 💡 Sugestões de Melhorias Futuras (Foco em Robustez e Escalabilidade)

Para levar este projeto a um nível de produção, as seguintes melhorias operacionais são recomendadas:

### 1. Caching de Geocoding (Implementado com Redis)

* **O que é:** Armazenar as coordenadas geográficas (latitude e longitude) de uma cidade no **Redis** após a primeira busca bem-sucedida.
* **Benefício:** Reduz drasticamente a **latência** nas requisições subsequentes para a mesma cidade e evita atingir os limites de requisição da API de Geocoding externa.
* **Como Fazer (Resumo):**
    1.  Adicionar um serviço `redis` ao `docker-compose.yaml`.
    2.  No *backend* (FastAPI), usar o cliente `redis` para:
        * Tentar buscar a chave `geocode:{cidade}`.
        * Se não encontrar, realizar a chamada externa, e então armazenar o resultado como JSON no Redis usando `SETEX` (com tempo de expiração, ex: $1\text{ hora}$).

### 2. Rate Limiting (Controle de Frequência de Requisições)

* **O que é:** Implementar um mecanismo para limitar o número de requisições que um único cliente (identificado pelo endereço IP) determinando o período (ex: $10\text{ requisições}$ por minuto).
* **Benefício:** Protege o servidor contra sobrecarga (ataques DoS) e, mais importante, protege as APIs de clima externas contra o uso excessivo, prevenindo o bloqueio do seu *wrapper*.
* **Como Fazer (Resumo):**
    1.  Utilizar uma biblioteca para FastAPI (ex: `fastapi-limiter`).
    2.  Integrar esta biblioteca com o **Redis** para armazenar as contagens de acesso por IP.
    3.  Aplicar um *decorator* (ex: `@limiter(...)`) no *endpoint* principal (`/weather/{city_name}`) para impor o limite. Clientes excedendo o limite recebem um status **429 Too Many Requests**.

### 3. Logging e Monitoramento Estruturado

* **O que é:** Configurar o *backend* (FastAPI) para gerar *logs* em formato **JSON** (estrutura chave-valor), registrando metadados essenciais para cada requisição e erro.
* **Benefício:** Facilita a **análise e a busca** (*searching*) em plataformas de monitoramento centralizadas (como Grafana Loki ou Elastic Stack), permitindo identificar rapidamente erros, gargalos e padrões de acesso em um ambiente de produção.
* **Como Fazer (Resumo):**
    1.  Utilizar uma biblioteca como **`python-json-logger`** ou configurar o **`loguru`** para formatar os *logs* como JSON.
    2.  Implementar um *middleware* no FastAPI para interceptar eventos de requisição/resposta e incluir campos estruturados como `timestamp`, `endpoint`, `status_code` e `user_ip` em cada registro.
