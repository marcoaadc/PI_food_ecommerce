import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const customerHash = await bcrypt.hash('cliente123', 10);

  const shopkeeper = await prisma.user.upsert({
    where: { email: 'admin@burguerhouse.com' },
    update: {},
    create: {
      name: 'Admin Lojista',
      email: 'admin@burguerhouse.com',
      password: passwordHash,
      role: 'SHOPKEEPER',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: customerHash,
      role: 'CUSTOMER',
    },
  });

  const products = [
    {
      name: 'X-Burguer',
      description: 'Hambúrguer artesanal com queijo, alface e tomate',
      price: 18.9,
      stock: 50,
      category: 'Lanches',
    },
    {
      name: 'X-Bacon',
      description: 'Hambúrguer artesanal com bacon crocante e queijo cheddar',
      price: 22.9,
      stock: 40,
      category: 'Lanches',
    },
    {
      name: 'X-Salada',
      description: 'Hambúrguer com alface, tomate, cebola e maionese',
      price: 16.9,
      stock: 45,
      category: 'Lanches',
    },
    {
      name: 'Pizza Margherita',
      description: 'Molho de tomate, mussarela, tomate e manjericão fresco',
      price: 35.9,
      stock: 30,
      category: 'Pizzas',
    },
    {
      name: 'Pizza Calabresa',
      description: 'Calabresa fatiada, cebola e mussarela',
      price: 32.9,
      stock: 25,
      category: 'Pizzas',
    },
    {
      name: 'Pizza Quatro Queijos',
      description: 'Mussarela, provolone, gorgonzola e parmesão',
      price: 38.9,
      stock: 20,
      category: 'Pizzas',
    },
    {
      name: 'Coca-Cola 2L',
      description: 'Refrigerante Coca-Cola garrafa 2 litros',
      price: 10.9,
      stock: 100,
      category: 'Bebidas',
    },
    {
      name: 'Guaraná Antarctica 2L',
      description: 'Refrigerante Guaraná Antarctica garrafa 2 litros',
      price: 8.9,
      stock: 80,
      category: 'Bebidas',
    },
    {
      name: 'Suco Natural de Laranja',
      description: 'Suco de laranja natural 500ml',
      price: 12.9,
      stock: 60,
      category: 'Bebidas',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: product,
    });
  }

  console.log(`Seed completed:`);
  console.log(`  - Shopkeeper: ${shopkeeper.email}`);
  console.log(`  - Customer: ${customer.email}`);
  console.log(`  - Products: ${products.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
