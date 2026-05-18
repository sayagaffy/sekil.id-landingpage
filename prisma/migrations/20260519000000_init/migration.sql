-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'DEMO_SCHEDULED', 'PROPOSAL_SENT', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "institutionType" TEXT NOT NULL,
    "estimatedSeats" TEXT NOT NULL,
    "interestedProducts" TEXT[],
    "message" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "referrer" TEXT,
    "segment" TEXT,
    "productFromUrl" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "segment" TEXT,
    "source" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_email_key" ON "WaitlistEntry"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
