-- CreateEnum
CREATE TYPE "RoleKey" AS ENUM ('OWNER_PRINCIPAL', 'SUPPORT_ADMIN', 'AGENT_SERVICE', 'READ_ONLY_REVIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "AuthProviderKind" AS ENUM ('LOCAL_DEV_PLACEHOLDER', 'FUTURE_PROVIDER');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('LOGIN', 'FAILED_LOGIN', 'PERMISSION_CHANGE', 'CLIENT_CREATED', 'CLIENT_EDITED', 'CLIENT_RECORD_ACCESSED', 'MATTER_CREATED', 'MATTER_EDITED', 'MATTER_RECORD_ACCESSED', 'MATTER_NOTE_ADDED', 'DOCUMENT_ACCESSED', 'DRAFT_CREATED', 'BILLING_LINE_ITEM_CREATED', 'BILLING_LINE_ITEM_EDITED', 'INVOICE_CREATED', 'INVOICE_SUBMITTED_FOR_APPROVAL', 'INVOICE_APPROVED', 'INVOICE_NUMBER_ASSIGNED', 'INVOICE_SENT', 'INVOICE_CANCELLED', 'INVOICE_CORRECTED', 'STATEMENT_SNAPSHOT_CREATED', 'STATEMENT_SUBMITTED_FOR_APPROVAL', 'STATEMENT_APPROVED', 'STATEMENT_SENT', 'STATEMENT_CORRECTED', 'PAYMENT_IMPORT_CHANGED', 'FINANCIAL_CORRECTION_CREATED', 'VAT_TREATMENT_OVERRIDDEN', 'AGENT_ACTION', 'DOCUMENT_METADATA_CREATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DOWNLOADED', 'TIMELINE_EVENT_CREATED', 'MARKETING_APPROVED', 'OUTREACH_APPROVED');

-- CreateEnum
CREATE TYPE "AgentActionStatus" AS ENUM ('DRAFT', 'NEEDS_REVIEW', 'APPROVED_BY_OWNER', 'REJECTED');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PRIMARY', 'BILLING', 'LEGAL_CONTACT', 'OTHER');

-- CreateEnum
CREATE TYPE "MatterType" AS ENUM ('FAMILY_LAW', 'MAINTENANCE', 'DIVORCE', 'CARE_AND_CUSTODY', 'COMMERCIAL_LAW', 'FINANCIAL_DISTRESS', 'CONTRACTS', 'BUSINESS_RESCUE', 'CIVIL_LITIGATION', 'OTHER');

-- CreateEnum
CREATE TYPE "MatterStatus" AS ENUM ('OPEN', 'PENDING', 'WAITING_ON_CLIENT', 'WAITING_ON_COURT', 'WAITING_ON_PAYMENT', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MatterAssignmentRole" AS ENUM ('RESPONSIBLE_ATTORNEY', 'SUPPORT_USER', 'VIEWER');

-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('PRIVATE', 'INTERNAL');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('ACTIVE', 'SUPERSEDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TimelineEventType" AS ENUM ('CLIENT_CREATED', 'CLIENT_EDITED', 'MATTER_CREATED', 'MATTER_EDITED', 'MATTER_NOTE_ADDED', 'DOCUMENT_METADATA_CREATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_ACCESSED', 'AUDIT_EVENT_RECORDED');

-- CreateEnum
CREATE TYPE "BillingLineItemStatus" AS ENUM ('DRAFT', 'AWAITING_REVIEW', 'APPROVED_FOR_INVOICE', 'REJECTED', 'INVOICED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "BillingCategory" AS ENUM ('TIME', 'FOLIO', 'PAGE', 'FIXED_TARIFF', 'DISBURSEMENT', 'ADJUSTMENT', 'CORRECTION');

-- CreateEnum
CREATE TYPE "VatTreatment" AS ENUM ('VAT_ON_FEES', 'NO_VAT', 'VAT_EXEMPT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'AWAITING_OWNER_APPROVAL', 'APPROVED', 'SENT', 'CANCELLED', 'CORRECTED', 'PAID', 'PART_PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "StatementStatus" AS ENUM ('DRAFT', 'AWAITING_OWNER_APPROVAL', 'APPROVED', 'SENT', 'UPDATED_AFTER_PAYMENT', 'CLOSED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "FinancialCorrectionType" AS ENUM ('LINE_ITEM_CORRECTION', 'INVOICE_CORRECTION', 'STATEMENT_CORRECTION', 'VAT_CORRECTION', 'ADMIN_CORRECTION');

-- CreateEnum
CREATE TYPE "FinancialRecordSource" AS ENUM ('MANUAL', 'AGENT_DRAFT', 'SYSTEM', 'CORRECTION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "authProvider" "AuthProviderKind" NOT NULL DEFAULT 'LOCAL_DEV_PLACEHOLDER',
    "externalSubject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "key" "RoleKey" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "actorId" TEXT,
    "targetType" TEXT,
    "targetId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "sensitive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentAction" (
    "id" TEXT NOT NULL,
    "agentUserId" TEXT,
    "actionType" TEXT NOT NULL,
    "sourceChannel" TEXT,
    "sourceReference" TEXT,
    "draftTargetType" TEXT,
    "draftTargetId" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "status" "AgentActionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "normalizedSearch" TEXT NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "primaryContactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "whatsappNumber" TEXT,
    "type" "ContactType" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matter" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "normalizedSearch" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MatterType" NOT NULL,
    "status" "MatterStatus" NOT NULL DEFAULT 'OPEN',
    "responsibleAttorneyId" TEXT,
    "supportUserId" TEXT,
    "nextStepDueDate" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatterAssignment" (
    "id" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MatterAssignmentRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatterAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatterNote" (
    "id" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "internal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatterNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRecord" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "matterId" TEXT,
    "storageKey" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'PRIVATE',
    "status" "DocumentStatus" NOT NULL DEFAULT 'ACTIVE',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "eventType" "TimelineEventType" NOT NULL,
    "actorId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "clientId" TEXT,
    "matterId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingLineItem" (
    "id" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "BillingCategory" NOT NULL,
    "status" "BillingLineItemStatus" NOT NULL DEFAULT 'DRAFT',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitAmountCents" INTEGER NOT NULL,
    "totalAmountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "vatTreatment" "VatTreatment" NOT NULL,
    "vatAmountCents" INTEGER NOT NULL DEFAULT 0,
    "source" "FinancialRecordSource" NOT NULL DEFAULT 'MANUAL',
    "sourceReference" TEXT,
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "internalDraftReference" TEXT NOT NULL,
    "officialInvoiceNumber" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotalCents" INTEGER NOT NULL,
    "vatAmountCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "source" "FinancialRecordSource" NOT NULL DEFAULT 'MANUAL',
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "invoiceNumberAssignedById" TEXT,
    "invoiceNumberAssignedAt" TIMESTAMP(3),
    "invoiceNumberSequenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "billingLineItemId" TEXT,
    "description" TEXT NOT NULL,
    "category" "BillingCategory" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitAmountCents" INTEGER NOT NULL,
    "totalAmountCents" INTEGER NOT NULL,
    "vatTreatment" "VatTreatment" NOT NULL,
    "vatAmountCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceApproval" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "InvoiceApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceNumberSequence" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "nextNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceNumberSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatementSnapshot" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "matterId" TEXT,
    "status" "StatementStatus" NOT NULL DEFAULT 'DRAFT',
    "statementPeriodStart" TIMESTAMP(3),
    "statementPeriodEnd" TIMESTAMP(3),
    "openingBalanceCents" INTEGER NOT NULL DEFAULT 0,
    "closingBalanceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatementSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatementLine" (
    "id" TEXT NOT NULL,
    "statementSnapshotId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "description" TEXT NOT NULL,
    "lineDate" TIMESTAMP(3),
    "debitCents" INTEGER NOT NULL DEFAULT 0,
    "creditCents" INTEGER NOT NULL DEFAULT 0,
    "balanceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatementLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatementApproval" (
    "id" TEXT NOT NULL,
    "statementSnapshotId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "StatementApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialCorrectionRecord" (
    "id" TEXT NOT NULL,
    "correctionType" "FinancialCorrectionType" NOT NULL,
    "targetRecordType" TEXT NOT NULL,
    "targetRecordId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "amountDeltaCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialCorrectionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "AuditLog_eventType_idx" ON "AuditLog"("eventType");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AgentAction_agentUserId_idx" ON "AgentAction"("agentUserId");

-- CreateIndex
CREATE INDEX "AgentAction_status_idx" ON "AgentAction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Client_accountNumber_key" ON "Client"("accountNumber");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE INDEX "Client_normalizedSearch_idx" ON "Client"("normalizedSearch");

-- CreateIndex
CREATE INDEX "Contact_clientId_idx" ON "Contact"("clientId");

-- CreateIndex
CREATE INDEX "Contact_type_idx" ON "Contact"("type");

-- CreateIndex
CREATE INDEX "Matter_clientId_idx" ON "Matter"("clientId");

-- CreateIndex
CREATE INDEX "Matter_accountNumber_idx" ON "Matter"("accountNumber");

-- CreateIndex
CREATE INDEX "Matter_type_idx" ON "Matter"("type");

-- CreateIndex
CREATE INDEX "Matter_status_idx" ON "Matter"("status");

-- CreateIndex
CREATE INDEX "Matter_nextStepDueDate_idx" ON "Matter"("nextStepDueDate");

-- CreateIndex
CREATE INDEX "Matter_normalizedSearch_idx" ON "Matter"("normalizedSearch");

-- CreateIndex
CREATE INDEX "MatterAssignment_userId_idx" ON "MatterAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatterAssignment_matterId_userId_role_key" ON "MatterAssignment"("matterId", "userId", "role");

-- CreateIndex
CREATE INDEX "MatterNote_matterId_idx" ON "MatterNote"("matterId");

-- CreateIndex
CREATE INDEX "MatterNote_authorId_idx" ON "MatterNote"("authorId");

-- CreateIndex
CREATE INDEX "DocumentRecord_clientId_idx" ON "DocumentRecord"("clientId");

-- CreateIndex
CREATE INDEX "DocumentRecord_matterId_idx" ON "DocumentRecord"("matterId");

-- CreateIndex
CREATE INDEX "DocumentRecord_visibility_idx" ON "DocumentRecord"("visibility");

-- CreateIndex
CREATE INDEX "DocumentRecord_status_idx" ON "DocumentRecord"("status");

-- CreateIndex
CREATE INDEX "TimelineEvent_eventType_idx" ON "TimelineEvent"("eventType");

-- CreateIndex
CREATE INDEX "TimelineEvent_actorId_idx" ON "TimelineEvent"("actorId");

-- CreateIndex
CREATE INDEX "TimelineEvent_subjectType_subjectId_idx" ON "TimelineEvent"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "TimelineEvent_clientId_idx" ON "TimelineEvent"("clientId");

-- CreateIndex
CREATE INDEX "TimelineEvent_matterId_idx" ON "TimelineEvent"("matterId");

-- CreateIndex
CREATE INDEX "BillingLineItem_matterId_idx" ON "BillingLineItem"("matterId");

-- CreateIndex
CREATE INDEX "BillingLineItem_status_idx" ON "BillingLineItem"("status");

-- CreateIndex
CREATE INDEX "BillingLineItem_category_idx" ON "BillingLineItem"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_internalDraftReference_key" ON "Invoice"("internalDraftReference");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_officialInvoiceNumber_key" ON "Invoice"("officialInvoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE INDEX "Invoice_matterId_idx" ON "Invoice"("matterId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_approvedAt_idx" ON "Invoice"("approvedAt");

-- CreateIndex
CREATE INDEX "InvoiceLine_invoiceId_idx" ON "InvoiceLine"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceLine_billingLineItemId_idx" ON "InvoiceLine"("billingLineItemId");

-- CreateIndex
CREATE INDEX "InvoiceApproval_invoiceId_idx" ON "InvoiceApproval"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceApproval_approverId_idx" ON "InvoiceApproval"("approverId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceNumberSequence_scope_key" ON "InvoiceNumberSequence"("scope");

-- CreateIndex
CREATE INDEX "StatementSnapshot_clientId_idx" ON "StatementSnapshot"("clientId");

-- CreateIndex
CREATE INDEX "StatementSnapshot_matterId_idx" ON "StatementSnapshot"("matterId");

-- CreateIndex
CREATE INDEX "StatementSnapshot_status_idx" ON "StatementSnapshot"("status");

-- CreateIndex
CREATE INDEX "StatementLine_statementSnapshotId_idx" ON "StatementLine"("statementSnapshotId");

-- CreateIndex
CREATE INDEX "StatementLine_invoiceId_idx" ON "StatementLine"("invoiceId");

-- CreateIndex
CREATE INDEX "StatementApproval_statementSnapshotId_idx" ON "StatementApproval"("statementSnapshotId");

-- CreateIndex
CREATE INDEX "StatementApproval_approverId_idx" ON "StatementApproval"("approverId");

-- CreateIndex
CREATE INDEX "FinancialCorrectionRecord_targetRecordType_targetRecordId_idx" ON "FinancialCorrectionRecord"("targetRecordType", "targetRecordId");

-- CreateIndex
CREATE INDEX "FinancialCorrectionRecord_actorId_idx" ON "FinancialCorrectionRecord"("actorId");

-- CreateIndex
CREATE INDEX "FinancialCorrectionRecord_correctionType_idx" ON "FinancialCorrectionRecord"("correctionType");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentAction" ADD CONSTRAINT "AgentAction_agentUserId_fkey" FOREIGN KEY ("agentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_primaryContactId_fkey" FOREIGN KEY ("primaryContactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_responsibleAttorneyId_fkey" FOREIGN KEY ("responsibleAttorneyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_supportUserId_fkey" FOREIGN KEY ("supportUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterAssignment" ADD CONSTRAINT "MatterAssignment_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterAssignment" ADD CONSTRAINT "MatterAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterNote" ADD CONSTRAINT "MatterNote_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatterNote" ADD CONSTRAINT "MatterNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecord" ADD CONSTRAINT "DocumentRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecord" ADD CONSTRAINT "DocumentRecord_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecord" ADD CONSTRAINT "DocumentRecord_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingLineItem" ADD CONSTRAINT "BillingLineItem_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingLineItem" ADD CONSTRAINT "BillingLineItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_invoiceNumberAssignedById_fkey" FOREIGN KEY ("invoiceNumberAssignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_invoiceNumberSequenceId_fkey" FOREIGN KEY ("invoiceNumberSequenceId") REFERENCES "InvoiceNumberSequence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_billingLineItemId_fkey" FOREIGN KEY ("billingLineItemId") REFERENCES "BillingLineItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceApproval" ADD CONSTRAINT "InvoiceApproval_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceApproval" ADD CONSTRAINT "InvoiceApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementSnapshot" ADD CONSTRAINT "StatementSnapshot_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementSnapshot" ADD CONSTRAINT "StatementSnapshot_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementSnapshot" ADD CONSTRAINT "StatementSnapshot_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementSnapshot" ADD CONSTRAINT "StatementSnapshot_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementLine" ADD CONSTRAINT "StatementLine_statementSnapshotId_fkey" FOREIGN KEY ("statementSnapshotId") REFERENCES "StatementSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementLine" ADD CONSTRAINT "StatementLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementApproval" ADD CONSTRAINT "StatementApproval_statementSnapshotId_fkey" FOREIGN KEY ("statementSnapshotId") REFERENCES "StatementSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatementApproval" ADD CONSTRAINT "StatementApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialCorrectionRecord" ADD CONSTRAINT "FinancialCorrectionRecord_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
