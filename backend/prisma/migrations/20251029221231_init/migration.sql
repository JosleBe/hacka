-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "stellarPublicKey" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "profileImage" TEXT,
    "verified" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanIdOnChain" INTEGER NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "amountReleased" REAL NOT NULL DEFAULT 0,
    "numMilestones" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "impactDescription" TEXT NOT NULL,
    "impactUnit" TEXT NOT NULL,
    "impactTarget" REAL NOT NULL,
    "impactAchieved" REAL NOT NULL DEFAULT 0,
    "txHash" TEXT,
    "approvedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Loan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "impactRequired" REAL NOT NULL,
    "validated" INTEGER NOT NULL DEFAULT 0,
    "validatorId" TEXT,
    "validationTimestamp" DATETIME,
    "txHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Milestone_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "impactDelivered" REAL NOT NULL,
    "proofHash" TEXT,
    "proofImages" TEXT,
    "notes" TEXT,
    "txHash" TEXT,
    "validatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Validation_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Validation_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Validation_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investorId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reputation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "completedLoans" INTEGER NOT NULL DEFAULT 0,
    "totalImpact" REAL NOT NULL DEFAULT 0,
    "onTimeRate" INTEGER NOT NULL DEFAULT 100,
    "reputationScore" INTEGER NOT NULL DEFAULT 0,
    "nftIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reputation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hash" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stellarPublicKey_key" ON "User"("stellarPublicKey");

-- CreateIndex
CREATE INDEX "User_stellarPublicKey_idx" ON "User"("stellarPublicKey");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_loanIdOnChain_key" ON "Loan"("loanIdOnChain");

-- CreateIndex
CREATE INDEX "Loan_borrowerId_idx" ON "Loan"("borrowerId");

-- CreateIndex
CREATE INDEX "Loan_status_idx" ON "Loan"("status");

-- CreateIndex
CREATE INDEX "Loan_loanIdOnChain_idx" ON "Loan"("loanIdOnChain");

-- CreateIndex
CREATE INDEX "Milestone_loanId_idx" ON "Milestone"("loanId");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_loanId_index_key" ON "Milestone"("loanId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Validation_milestoneId_key" ON "Validation"("milestoneId");

-- CreateIndex
CREATE INDEX "Validation_loanId_idx" ON "Validation"("loanId");

-- CreateIndex
CREATE INDEX "Validation_validatorId_idx" ON "Validation"("validatorId");

-- CreateIndex
CREATE INDEX "Investment_investorId_idx" ON "Investment"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "Reputation_userId_key" ON "Reputation"("userId");

-- CreateIndex
CREATE INDEX "Document_loanId_idx" ON "Document"("loanId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");
