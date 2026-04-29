# Burguer House

Plataforma completa de e-commerce e delivery de comida, construída com arquitetura moderna e boas práticas de engenharia de software.

## Sobre o Projeto

Aplicação fullstack que permite clientes navegarem por um catálogo de produtos (lanches, pizzas e bebidas), montarem pedidos com carrinho de compras, gerenciarem endereços e métodos de pagamento, e acompanharem o status de entrega. Lojistas possuem um painel administrativo para gerenciar produtos e pedidos.

**Origem:** Reconstrução de um projeto acadêmico (Digital House, 2021) que utilizava Express.js + EJS + jQuery. Modernizado com stack atual aplicando princípios SOLID, tipagem estrita, segurança e separação de responsabilidades.

## Tech Stack

| Camada | Tecnologias |
|--------|------------|
| **Backend** | NestJS, TypeScript, Prisma ORM, MySQL, Passport JWT |
| **Frontend** | React 19, TypeScript, Vite, React Router |
| **Autenticação** | JWT access token + HTTP-only refresh cookie |
| **Validação** | class-validator (backend), Zod (frontend) |
| **Infraestrutura** | Docker Compose, npm workspaces (monorepo) |

## Arquitetura

```
PI_food_ecommerce/
├── packages/
│   ├── backend/                 # API REST (NestJS)
│   │   ├── src/
│   │   │   ├── auth/            # Autenticação JWT + Passport
│   │   │   ├── users/           # Perfil de usuário
│   │   │   ├── products/        # Catálogo de produtos
│   │   │   ├── addresses/       # Endereços de entrega
│   │   │   ├── payment-methods/ # Métodos de pagamento
│   │   │   ├── orders/          # Gestão de pedidos
│   │   │   ├── common/          # Guards, filters, decorators
│   │   │   ├── config/          # ConfigModule + validação
│   │   │   └── prisma/          # PrismaService global
│   │   └── prisma/
│   │       ├── schema.prisma    # Schema do banco
│   │       └── seed.ts          # Dados iniciais
│   └── frontend/                # SPA React
│       └── src/
│           ├── api/             # Cliente HTTP (Axios)
│           ├── contexts/        # AuthContext, CartContext
│           ├── hooks/           # Custom hooks
│           ├── pages/           # Páginas (customer + shopkeeper)
│           ├── components/      # Componentes reutilizáveis
│           └── types/           # TypeScript types
├── docker-compose.yml           # MySQL 8
├── .env.example                 # Template de variáveis
└── tsconfig.base.json           # Config TypeScript compartilhada
```

## Modelo de Dados

```
User (role: CUSTOMER | SHOPKEEPER)
├── Address[]         (endereços de entrega)
├── PaymentMethod[]   (últimos 4 dígitos apenas)
└── Order[]
    ├── Address       (snapshot do endereço)
    ├── PaymentMethod (referência ao pagamento)
    └── OrderItem[]
        └── Product   (snapshot de preço e nome)

Product (category: Lanches | Pizzas | Bebidas)
```

**Melhorias sobre o schema legado:**
- `DECIMAL(10,2)` ao invés de `FLOAT` para valores monetários
- Foreign keys com constraints e `onDelete`
- Enums para status, tipos e roles
- Armazenamento seguro (apenas últimos 4 dígitos do cartão)

## API Endpoints

### Autenticação (público)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Login (retorna JWT) |
| POST | `/api/auth/refresh` | Renovar access token |
| POST | `/api/auth/logout` | Limpar refresh cookie |

### Usuários (autenticado)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users/me` | Perfil do usuário |
| PATCH | `/api/users/me` | Atualizar perfil |

### Produtos (GET público, mutações requerem SHOPKEEPER)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products` | Listar produtos |
| GET | `/api/products/:id` | Detalhes do produto |
| POST | `/api/products` | Criar produto |
| PATCH | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Desativar produto |

### Endereços / Pagamentos / Pedidos
| Recurso | Operações |
|---------|-----------|
| Endereços | CRUD + seleção de endereço ativo |
| Pagamentos | CRUD + seleção de método ativo |
| Pedidos | Criar, listar, atualizar status, cancelar |

## Pré-requisitos

- **Node.js** >= 18.x
- **Docker** e **Docker Compose**
- **npm** >= 7 (suporte a workspaces)

## Instalação e Setup

```bash
# 1. Clonar o repositório
git clone https://github.com/marcoaadc/PI_food_ecommerce.git
cd PI_food_ecommerce

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais (ver seção abaixo)

# 4. Subir banco de dados
docker-compose up -d

# 5. Executar migrations
cd packages/backend
npx prisma migrate dev --name init
npx prisma db seed
cd ../..

# 6. Iniciar em modo desenvolvimento
npm run dev:backend   # Terminal 1 → http://localhost:3000
npm run dev:frontend  # Terminal 2 → http://localhost:5173
```

### Variáveis de Ambiente

```env
DATABASE_URL="mysql://root:root123@localhost:3306/burguer_house"
JWT_ACCESS_SECRET=sua-chave-secreta-com-pelo-menos-32-caracteres
JWT_REFRESH_SECRET=outra-chave-secreta-com-pelo-menos-32-caracteres
FRONTEND_URL=http://localhost:5173
```

## Usuários de Teste (após seed)

| Role | Email | Senha |
|------|-------|-------|
| Lojista | admin@burguerhouse.com | admin123 |
| Cliente | cliente@teste.com | cliente123 |

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev:backend` | Inicia backend em modo watch |
| `npm run dev:frontend` | Inicia frontend com Vite |
| `npm run build` | Build de produção (backend + frontend) |
| `npm run lint` | Lint em todos os packages |
| `npm run format` | Formatar código com Prettier |
| `npm test --workspace=packages/backend` | Rodar testes unitários do backend |

## Princípios e Decisões Técnicas

- **SOLID**: Cada módulo NestJS tem responsabilidade única; guards e decorators seguem Open/Closed; PrismaService permite inversão de dependência
- **Segurança**: Senhas com bcrypt, JWT com refresh em HTTP-only cookie, dados sensíveis de cartão não armazenados, validação em todas as entradas
- **Type Safety**: TypeScript strict em todo o projeto, Prisma gera tipos automaticamente, DTOs validados com class-validator
- **Monorepo**: npm workspaces para simplicidade, configs compartilhadas (ESLint, Prettier, TypeScript)

## Roadmap

- [x] Fase 1: Scaffolding e infraestrutura
- [x] Fase 2: Sistema de autenticação (JWT + Passport)
- [x] Fase 3: Catálogo de produtos (listagem, filtro por categoria)
- [x] Fase 4: Carrinho de compras (localStorage, drawer lateral)
- [x] Fase 5: Gestão de endereços (CRUD, ViaCEP, seleção)
- [x] Fase 6: Métodos de pagamento (últimos 4 dígitos, seleção)
- [x] Fase 7: Fluxo de pedidos (checkout, histórico)
- [x] Fase 8: Dashboard do lojista (produtos, pedidos com status)
- [x] Fase 9: Testes e polimento (17 testes, error boundary, 404)

## Licença

Este projeto é de uso educacional e de portfólio.
