-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'staff', 'member');

-- CreateEnum
CREATE TYPE "Persona" AS ENUM ('citizen', 'journalist', 'researcher', 'organization', 'volunteer', 'other');

-- CreateEnum
CREATE TYPE "OrgMemberRole" AS ENUM ('owner', 'admin', 'editor', 'member');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('page', 'tab', 'action');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('protest', 'disaster', 'accident', 'gathering', 'humanitarian', 'other');

-- CreateEnum
CREATE TYPE "EventLifecycle" AS ENUM ('draft', 'live', 'ongoing', 'under_review', 'archived');

-- CreateEnum
CREATE TYPE "ConfidenceStatus" AS ENUM ('unverified', 'pending', 'verified');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'restricted');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'audio', 'document', 'text');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('pending', 'under_review', 'verified', 'rejected', 'hidden');

-- CreateEnum
CREATE TYPE "ReviewLayer" AS ENUM ('community', 'expert', 'organization', 'technical', 'ai_assist');

-- CreateEnum
CREATE TYPE "ReviewAction" AS ENUM ('approve', 'reject', 'skip', 'request_info');

-- CreateEnum
CREATE TYPE "ReportKind" AS ENUM ('community', 'official');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('draft', 'under_review', 'published');

-- CreateEnum
CREATE TYPE "OrganizationCategory" AS ENUM ('human_rights', 'independent_media', 'ngo', 'advocacy', 'free_speech', 'other');

-- CreateEnum
CREATE TYPE "EventRegion" AS ENUM ('global', 'asia', 'europe', 'americas', 'africa', 'oceania');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "passwordHash" TEXT,
    "name" TEXT,
    "handle" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "language" TEXT,
    "persona" "Persona" NOT NULL DEFAULT 'citizen',
    "userType" "UserType" NOT NULL DEFAULT 'member',
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "identityVerified" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "activeRoleId" TEXT,
    "sessionId" TEXT,
    "refreshTokenHash" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'member',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "grantedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubModule" (
    "id" TEXT NOT NULL,
    "moduleRefId" TEXT NOT NULL,
    "subKey" TEXT NOT NULL,
    "permissionPath" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "nodeType" "NodeType" NOT NULL DEFAULT 'page',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "SubModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleModuleMapping" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "moduleMatrix" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "RoleModuleMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "tagline" TEXT,
    "bio" TEXT,
    "aboutText" TEXT,
    "category" "OrganizationCategory" NOT NULL DEFAULT 'other',
    "website" TEXT,
    "location" TEXT,
    "region" "EventRegion",
    "coverUrl" TEXT,
    "logoUrl" TEXT,
    "initials" TEXT,
    "accent" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "founded" TEXT,
    "focusAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memberRole" "OrgMemberRole" NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "EventCategory" NOT NULL DEFAULT 'other',
    "lifecycle" "EventLifecycle" NOT NULL DEFAULT 'draft',
    "confidence" "ConfidenceStatus" NOT NULL DEFAULT 'unverified',
    "impact" "ImpactLevel" NOT NULL DEFAULT 'medium',
    "visibility" "Visibility" NOT NULL DEFAULT 'public',
    "city" TEXT,
    "country" TEXT,
    "region" "EventRegion",
    "address" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "thumbnailUrl" TEXT,
    "aiSummary" TEXT,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "organizationId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "hiddenAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "context" TEXT,
    "mediaType" "MediaType" NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'pending',
    "capturedAt" TIMESTAMP(3),
    "city" TEXT,
    "country" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "accuracyMeters" DOUBLE PRECISION,
    "sourceLabel" TEXT,
    "sourceDevice" TEXT,
    "attestOriginal" BOOLEAN NOT NULL DEFAULT false,
    "attestLocation" BOOLEAN NOT NULL DEFAULT false,
    "attestReview" BOOLEAN NOT NULL DEFAULT false,
    "currentVersionId" TEXT,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "hiddenAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceVersion" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT,
    "mimeType" TEXT,
    "sizeBytes" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" DOUBLE PRECISION,
    "sha256" TEXT NOT NULL,
    "checksumAlgo" TEXT NOT NULL DEFAULT 'sha256',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,

    CONSTRAINT "EvidenceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationReview" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "organizationId" TEXT,
    "layer" "ReviewLayer" NOT NULL DEFAULT 'community',
    "action" "ReviewAction" NOT NULL,
    "statusAfter" "EvidenceStatus",
    "notes" TEXT,
    "checklist" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "VerificationReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "kind" "ReportKind" NOT NULL DEFAULT 'community',
    "status" "ReportStatus" NOT NULL DEFAULT 'draft',
    "authorId" TEXT NOT NULL,
    "organizationId" TEXT,
    "eventId" TEXT,
    "thumbnailUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "organizationId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_deleted_idx" ON "User"("deleted");

-- CreateIndex
CREATE INDEX "User_activeRoleId_idx" ON "User"("activeRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- CreateIndex
CREATE INDEX "Role_deleted_idx" ON "Role"("deleted");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Module_moduleKey_key" ON "Module"("moduleKey");

-- CreateIndex
CREATE UNIQUE INDEX "Module_moduleId_key" ON "Module"("moduleId");

-- CreateIndex
CREATE INDEX "Module_deleted_enabled_sortOrder_idx" ON "Module"("deleted", "enabled", "sortOrder");

-- CreateIndex
CREATE INDEX "SubModule_moduleRefId_idx" ON "SubModule"("moduleRefId");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_moduleRefId_subKey_key" ON "SubModule"("moduleRefId", "subKey");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_permissionPath_key" ON "SubModule"("permissionPath");

-- CreateIndex
CREATE UNIQUE INDEX "RoleModuleMapping_roleId_key" ON "RoleModuleMapping"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_deleted_idx" ON "Organization"("deleted");

-- CreateIndex
CREATE INDEX "Organization_verified_idx" ON "Organization"("verified");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Event_deleted_lifecycle_startedAt_idx" ON "Event"("deleted", "lifecycle", "startedAt");

-- CreateIndex
CREATE INDEX "Event_region_category_idx" ON "Event"("region", "category");

-- CreateIndex
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");

-- CreateIndex
CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Evidence_currentVersionId_key" ON "Evidence"("currentVersionId");

-- CreateIndex
CREATE INDEX "Evidence_eventId_deleted_idx" ON "Evidence"("eventId", "deleted");

-- CreateIndex
CREATE INDEX "Evidence_status_createdAt_idx" ON "Evidence"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Evidence_uploadedById_idx" ON "Evidence"("uploadedById");

-- CreateIndex
CREATE INDEX "EvidenceVersion_evidenceId_idx" ON "EvidenceVersion"("evidenceId");

-- CreateIndex
CREATE INDEX "EvidenceVersion_sha256_idx" ON "EvidenceVersion"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceVersion_evidenceId_version_key" ON "EvidenceVersion"("evidenceId", "version");

-- CreateIndex
CREATE INDEX "VerificationReview_evidenceId_createdAt_idx" ON "VerificationReview"("evidenceId", "createdAt");

-- CreateIndex
CREATE INDEX "VerificationReview_reviewerId_idx" ON "VerificationReview"("reviewerId");

-- CreateIndex
CREATE INDEX "Report_status_publishedAt_idx" ON "Report"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Report_authorId_idx" ON "Report"("authorId");

-- CreateIndex
CREATE INDEX "Report_organizationId_idx" ON "Report"("organizationId");

-- CreateIndex
CREATE INDEX "Report_eventId_idx" ON "Report"("eventId");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_resourceId_idx" ON "AuditLog"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeRoleId_fkey" FOREIGN KEY ("activeRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModule" ADD CONSTRAINT "SubModule_moduleRefId_fkey" FOREIGN KEY ("moduleRefId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleModuleMapping" ADD CONSTRAINT "RoleModuleMapping_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "EvidenceVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceVersion" ADD CONSTRAINT "EvidenceVersion_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceVersion" ADD CONSTRAINT "EvidenceVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
