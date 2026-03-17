import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ptvea.co.id' },
    update: {},
    create: {
      email: 'admin@ptvea.co.id',
      password: hashedPassword,
      fullName: 'Super Admin',
      role: 'admin',
      isActive: true,
    },
  })

  console.log('✅ Default admin user created/verified:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Password: admin123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
