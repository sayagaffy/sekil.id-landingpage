/**
 * Seed the initial SUPERADMIN account.
 *
 * Usage (requires DATABASE_URL in .env.local):
 *   tsx scripts/seed-admin.ts
 *
 * Or with explicit env:
 *   DATABASE_URL="postgresql://..." ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="secret123" tsx scripts/seed-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

function ask(prompt: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    if (hidden) {
      process.stdout.write(prompt)
      process.stdin.setRawMode?.(true)
      let input = ''
      process.stdin.on('data', (char: Buffer) => {
        const ch = char.toString()
        if (ch === '\r' || ch === '\n') {
          process.stdin.setRawMode?.(false)
          process.stdout.write('\n')
          rl.close()
          resolve(input)
        } else if (ch === '') {
          process.exit()
        } else if (ch === '') {
          input = input.slice(0, -1)
        } else {
          input += ch
          process.stdout.write('*')
        }
      })
    } else {
      rl.question(prompt, (answer) => {
        rl.close()
        resolve(answer)
      })
    }
  })
}

async function main() {
  console.log('\n🔐 Seed Superadmin — Sekil.id CMS\n')

  const existing = await prisma.adminUser.findFirst({
    where: { role: 'SUPERADMIN' },
  })
  if (existing) {
    console.log(`✓ Superadmin already exists: ${existing.email}`)
    console.log('  Use the /keystatic/users page to add more users.\n')
    return
  }

  const name =
    process.env.ADMIN_NAME ?? (await ask('Full name (e.g. "Budi Admin"): '))
  const email =
    process.env.ADMIN_EMAIL ?? (await ask('Email: '))
  const password =
    process.env.ADMIN_PASSWORD ?? (await ask('Password (min 8 chars): ', true))

  if (password.length < 8) {
    console.error('✗ Password must be at least 8 characters.')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 12)
  const user = await prisma.adminUser.create({
    data: {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hash,
      role: 'SUPERADMIN',
      organisation: 'B One Corp / Sekil.id',
    },
  })

  console.log(`\n✅ Superadmin created: ${user.email} (id: ${user.id})`)
  console.log('   Login at /keystatic/login\n')
}

main()
  .catch((err) => {
    console.error('Error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
