-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ACHAT', 'VENTE', 'CONVERSION', 'TRANSFERT');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PRIX_SUPERIEUR', 'PRIX_INFERIEUR', 'VARIATION_POSITIVE', 'VARIATION_NEGATIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "TradingAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "mainCurrency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crypto" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Crypto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "montantEUR" DOUBLE PRECISION NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "quantiteCrypto" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isConverted" BOOLEAN NOT NULL DEFAULT false,
    "convertCurrency" TEXT,
    "convertQuantity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStat" (
    "id" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "prixMinimum" DOUBLE PRECISION NOT NULL,
    "prixMaximum" DOUBLE PRECISION NOT NULL,
    "prixMoyen" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "variation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyStat" (
    "id" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "prixMinimum" DOUBLE PRECISION NOT NULL,
    "prixMaximum" DOUBLE PRECISION NOT NULL,
    "prixMoyen" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "variation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthlyStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "cryptoId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TradingAccount_userId_key" ON "TradingAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TradingAccount_username_key" ON "TradingAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_symbol_key" ON "Crypto"("symbol");

-- CreateIndex
CREATE INDEX "Crypto_symbol_idx" ON "Crypto"("symbol");

-- CreateIndex
CREATE INDEX "TransactionHistory_transactionId_idx" ON "TransactionHistory"("transactionId");

-- CreateIndex
CREATE INDEX "DailyStat_date_idx" ON "DailyStat"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStat_cryptoId_date_key" ON "DailyStat"("cryptoId", "date");

-- CreateIndex
CREATE INDEX "MonthlyStat_date_idx" ON "MonthlyStat"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyStat_cryptoId_date_key" ON "MonthlyStat"("cryptoId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_accountId_cryptoId_key" ON "Portfolio"("accountId", "cryptoId");

-- CreateIndex
CREATE INDEX "Alert_accountId_idx" ON "Alert"("accountId");

-- CreateIndex
CREATE INDEX "Alert_cryptoId_idx" ON "Alert"("cryptoId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStat" ADD CONSTRAINT "DailyStat_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStat" ADD CONSTRAINT "MonthlyStat_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
