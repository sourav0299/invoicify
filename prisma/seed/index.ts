import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const plans = [
  {
    name: 'Essential',
    price: 14900,
    currency: 'INR',
    features: {
      businesses: 1,
      users: 1,
      invoices: 50,
      products: 100,
      parties: 20,
      customTemplates: false,
      reports: ['before_tax', 'after_tax']
    },
    isActive: true
  },
  {
    name: 'Elite',
    price: 24900,
    currency: 'INR',
    features: {
      businesses: 2,
      users: 4,
      invoices: 100,
      products: 200,
      parties: 50,
      customTemplates: true,
      reports: ['all']
    },
    isActive: true
  },
  {
    name: 'Enterprise',
    price: 0,
    currency: 'INR',
    features: {
      businesses: 5,
      users: -1,
      invoices: -1,
      products: -1,
      parties: -1,
      customTemplates: true,
      reports: ['all']
    },
    isActive: true
  }
]

async function main() {
  console.log('Start seeding...')
  
  // Clear existing plans
  await prisma.plan.deleteMany()
  
  // Create new plans
  for (const plan of plans) {
    const createdPlan = await prisma.plan.create({
      data: plan
    })
    console.log(`Created plan: ${createdPlan.name}`)
  }
  
  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })