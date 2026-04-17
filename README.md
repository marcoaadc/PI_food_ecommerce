# Burguer House - Food E-Commerce & Delivery

Plataforma de e-commerce de comida com sistema de delivery. Monorepo com backend NestJS e frontend React.

## Tech Stack

- **Backend:** NestJS + Prisma + MySQL + TypeScript
- **Frontend:** React + Vite + TanStack Query + Tailwind CSS + TypeScript
- **Auth:** JWT (access + refresh tokens)

## Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Subir MySQL
docker-compose up -d

# Rodar migrations e seed
npm run db:migrate --workspace=packages/backend
npm run db:seed --workspace=packages/backend

# Iniciar desenvolvimento
npm run dev
```

## Estrutura

```
packages/
  backend/   → API NestJS (porta 3000)
  frontend/  → SPA React (porta 5173)
```
