import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1) Upsert Admin User
  const adminEmail = 'admin@example.com'
  const plainPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '08123456789',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  // 2) Upsert allowed visit day = Wednesday (3)
  //    If your model has a unique constraint on allowedWeekday:
  await prisma.visitSetting.create({
    data: {
      allowedWeekday: 3,
    },
  })

  console.log('✅ Seed finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
})