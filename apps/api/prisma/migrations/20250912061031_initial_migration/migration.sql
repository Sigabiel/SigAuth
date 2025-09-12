-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "api" TEXT,
    "secondFactor" TEXT,
    "password" TEXT NOT NULL,
    "accounts" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "authorizationCode" TEXT,
    "subject" INTEGER NOT NULL,
    "expire" INTEGER NOT NULL,
    "created" INTEGER NOT NULL DEFAULT -1,
    "challenge" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "public"."PermissionInstance" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "containerId" INTEGER,
    "appId" INTEGER NOT NULL,
    "identifier" TEXT NOT NULL,
    "assetId" INTEGER,

    CONSTRAINT "PermissionInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssetType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Container" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "assets" JSONB NOT NULL DEFAULT '[]',
    "apps" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."App" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "webFetch" JSONB NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "public"."Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "public"."Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_api_key" ON "public"."Account"("api");

-- CreateIndex
CREATE UNIQUE INDEX "Account_secondFactor_key" ON "public"."Account"("secondFactor");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionId_key" ON "public"."Session"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "public"."Session"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_authorizationCode_key" ON "public"."Session"("authorizationCode");

-- CreateIndex
CREATE INDEX "PermissionInstance_accountId_idx" ON "public"."PermissionInstance"("accountId");

-- CreateIndex
CREATE INDEX "PermissionInstance_accountId_appId_idx" ON "public"."PermissionInstance"("accountId", "appId");

-- CreateIndex
CREATE INDEX "PermissionInstance_accountId_assetId_idx" ON "public"."PermissionInstance"("accountId", "assetId");

-- CreateIndex
CREATE INDEX "PermissionInstance_accountId_identifier_idx" ON "public"."PermissionInstance"("accountId", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionInstance_accountId_appId_identifier_containerId_a_key" ON "public"."PermissionInstance"("accountId", "appId", "identifier", "containerId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "App_token_key" ON "public"."App"("token");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_subject_fkey" FOREIGN KEY ("subject") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionInstance" ADD CONSTRAINT "PermissionInstance_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionInstance" ADD CONSTRAINT "PermissionInstance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionInstance" ADD CONSTRAINT "PermissionInstance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionInstance" ADD CONSTRAINT "PermissionInstance_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "public"."Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."AssetType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
