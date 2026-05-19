/**
 * Reset password untuk admin user yang sudah ada.
 *
 * Usage:
 *   ADMIN_EMAIL="kamu@example.com" ADMIN_PASSWORD="newpassword123" npm run admin:reset-password
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('❌  Set ADMIN_EMAIL dan ADMIN_PASSWORD sebagai env vars.')
    console.error('    Contoh:')
    console.error('    ADMIN_EMAIL="kamu@sekil.id" ADMIN_PASSWORD="password123" npm run admin:reset-password')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('❌  Password minimal 8 karakter.')
    process.exit(1)
  }

  const user = await prisma.adminUser.findUnique({ where: { email } })
  if (!user) {
    console.error(`❌  User ${email} tidak ditemukan.`)
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.adminUser.update({
    where: { email },
    data: { password: hash },
  })

  console.log(`✅  Password untuk ${email} berhasil direset.`)
}

main()
  .catch((err) => {
    console.error('Error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
