# Burgess Attorneys Project Sheet

Date: 2026-06-08
Status: Client review draft

## Project Name

Burgess Attorneys Admin Automation Platform

## Purpose

This project is to plan and then build a secure web-based administration, invoicing, agent, website and marketing platform for Burgess Attorneys.

The platform should reduce manual administration, improve invoice and statement workflows, keep better client-file visibility, support controlled client communication, rebuild the public website, and help the firm manage marketing and referral outreach in a professional way.

This document is for review before development starts.

## Executive Summary

Burgess Attorneys needs a controlled operating system for legal administration and digital growth.

The most important requirement is not simply "AI automation". The value is a reliable workflow where instructions are captured quickly, converted into structured drafts, checked against client files, approved by the owner or principal attorney, sent only when authorised, and logged for audit purposes.

The first version should focus on:

- Client file visibility.
- Draft invoice and statement workflows.
- WhatsApp voice-note capture for billing items.
- Owner approval before invoices, statements, marketing posts or outreach are sent.
- Lexpro payment/accounting sync or import, depending on what Lexpro allows.
- A professional website rebuild.
- A marketing calendar and post-approval process.
- Ethical lead research and referral outreach support.

## Business Context

Burgess Attorneys works in sensitive legal areas where trust, confidentiality, accuracy and audit history matter.

Primary practice areas:

- Family law.
- Maintenance matters.
- Divorce.
- Care and custody disputes.
- Commercial law.
- Financial distress.
- Contracts.
- Business rescue proceedings.

The system must support attorney-client confidentiality, financial controls, careful communication, and legal marketing that is professional and ethical.

## Main Problems To Solve

## 1. Manual Invoicing And Statements

Current invoicing and statement preparation takes too much time.

The proposed system should let the owner quickly add work items, including by WhatsApp voice note. The platform should convert those notes into draft invoice line items that can be reviewed, edited, approved or rejected.

No invoice or statement may be sent to a client without owner approval.

## 2. Client File Visibility

The owner and approved staff need a clear dashboard of open files.

Each file should show:

- Account number.
- Client name.
- Matter name or description.
- Matter type.
- Responsible attorney or user.
- Status.
- Latest invoice status.
- Latest statement balance.
- Last client communication date.
- Payment status.

## 3. Lexpro Accounting Dependency

Lexpro remains the accounting source of truth unless confirmed otherwise.

The new platform should act as an administration and automation layer. It should pull or import payment and balance data from Lexpro where possible, without replacing Lexpro immediately.

## 4. Controlled Agent Assistance

An OpenClaw agent can assist with drafting, capturing, matching, preparing, reminding, researching and reporting.

The agent must not make final decisions, send invoices, send statements, publish marketing, send outreach, or provide legal advice without approval.

## 5. Website And Lead Generation

Burgess Attorneys needs a professional, conversion-focused website with service pages, lead capture, WhatsApp contact, SEO structure, analytics and legal disclaimers.

The website should support the firm as a trusted legal service provider, not as an aggressive sales funnel.

## 6. Marketing And Referral Outreach

The platform should support a 30-day marketing calendar, social post drafts, email campaign drafts, and lead/referral research.

All marketing and outreach must be reviewed and approved before sending or publishing.

## Proposed Platform Modules

## 1. Admin Dashboard

Purpose:

- Give the owner a single place to see active matters, draft invoices, pending approvals, outstanding balances, recent communications and important reminders.

Core features:

- Login and role-based access.
- Open files list.
- Pending approval queue.
- Search and filters.
- Recent activity.
- Weekly admin report.

## 2. Client File Management

Purpose:

- Keep operational client-file information accessible and organised.

Core features:

- Client and matter records.
- Matter status tracking.
- Assigned attorney/admin user.
- Notes.
- Documents.
- Timeline of invoices, statements, payments, emails, WhatsApps and agent actions.
- Audit history.

Important file fields:

- Client ID.
- Account number.
- Client name.
- Contact person.
- Email.
- Phone.
- WhatsApp number.
- Matter type.
- Matter description.
- Status.
- Billing status.
- Current balance.
- Last invoice date.
- Last statement date.
- Last payment date.
- Assigned attorney.
- Assigned admin person.
- Notes.
- Documents.
- Communication history.
- Audit history.

## 3. Invoice And Statement Workflow

Purpose:

- Make invoice and statement preparation faster while keeping strict approval controls.

Invoice statuses:

- Draft.
- Awaiting owner approval.
- Approved.
- Sent.
- Cancelled.
- Corrected.
- Paid.
- Part-paid.
- Overdue.

Statement statuses:

- Draft.
- Awaiting owner approval.
- Approved.
- Sent.
- Updated after payment.
- Closed.

Workflow:

1. Work item is captured manually or from WhatsApp voice note.
2. System creates a draft line item.
3. Owner reviews the line item.
4. Approved line items are added to a draft invoice.
5. Owner reviews the draft invoice.
6. System generates invoice PDF after approval.
7. Statement is prepared or updated.
8. Owner approves the statement.
9. Agent sends approved invoice/statement by approved channel.
10. Communication and audit records are saved.

## 4. WhatsApp Voice Note To Draft Line Item

Purpose:

- Let the owner capture billing instructions quickly without sitting down to prepare invoice lines manually.

Example instruction:

“Add to account 1024, Smith divorce matter, consultation with client and review of settlement proposal, one hour, R1,850.”

Workflow:

1. Owner sends WhatsApp voice note to the agent number.
2. Voice note is transcribed.
3. Agent extracts account number, client, matter, date, description, time, rate, amount and VAT treatment if supplied.
4. Agent matches the item to an open file.
5. If uncertain, agent asks a clarification question.
6. Draft invoice line item is created.
7. Owner approves, edits or rejects.
8. Source voice note, transcript and timestamp are linked for audit purposes.

Control rule:

- Voice notes create drafts only. They do not create final invoices or send anything to clients.

## 5. Lexpro Integration Or Import

Purpose:

- Keep the new platform aligned with payment and accounting data without replacing Lexpro before proper discovery.

Discovery options:

- Lexpro API available: secure scheduled sync.
- Lexpro export available: CSV/XLS import workflow.
- Lexpro email reports available: dedicated mailbox parser.
- No integration available: manual payment update screen with audit controls.

Preferred model:

- Lexpro remains source of truth for accounting.
- The platform pulls or imports reconciled payment data.
- Approved financial records are not overwritten without correction records.
- Unmatched payments go into an exception queue.

## 6. OpenClaw Agent

Suggested name:

Burgess Admin Agent

Purpose:

- Assist the firm with admin, drafting, reminders, marketing preparation and lead research.

Agent can:

- Monitor WhatsApp and email.
- Capture voice-note invoice instructions.
- Ask clarification questions.
- Draft invoice line items.
- Prepare draft invoices and statements.
- Draft emails and WhatsApp replies.
- Draft marketing calendars and posts.
- Research referral leads.
- Prepare weekly reports.

Agent cannot:

- Give final legal advice.
- Send invoices without approval.
- Send statements without approval.
- Publish marketing without approval.
- Send outreach without approval.
- Delete client records.
- Override accounting data.
- Change approved financial records without a correction record.

## 7. Website Rebuild

Purpose:

- Rebuild the public website as a professional legal services website that builds trust and captures qualified enquiries.

Proposed pages:

- Home.
- About.
- Family Law.
- Maintenance.
- Divorce.
- Care and Custody Disputes.
- Commercial Law.
- Financial Distress.
- Contracts.
- Business Rescue Proceedings.
- Articles / Legal Updates.
- Contact.
- Privacy Policy.
- Terms / Disclaimer.

Website requirements:

- Mobile-first.
- Fast loading.
- Clear service pages.
- WhatsApp and email contact.
- Lead forms.
- SEO-friendly structure.
- Analytics.
- Spam protection.
- HTTPS.
- Professional legal design.
- Clear disclaimer that website content is general information and not legal advice.

## 8. Marketing Approval System

Purpose:

- Help the firm produce consistent, professional marketing content without allowing unapproved publishing.

Core features:

- 30-day content calendar.
- Channel selection: Facebook, Instagram, LinkedIn, email, WhatsApp updates.
- Draft post copy.
- Creative brief.
- Target audience.
- Service category.
- Owner comments.
- Revision history.
- Approval workflow.
- Scheduling where channel APIs allow it.
- Posted history and basic performance tracking.

Content tone:

- Professional.
- Compassionate.
- Clear.
- Educational.
- No aggressive claims.
- No guaranteed outcomes.
- No legal advice without consultation.

## 9. Lead Research And Outreach

Purpose:

- Build ethical referral and outreach pipelines for family law and commercial law.

Family law referral sources:

- Pastors and church leaders.
- Social workers.
- Counsellors.
- Community leaders.
- Family-support organisations.
- Mediators.
- School counsellors where appropriate.

Commercial law referral sources:

- Accountants.
- Bookkeepers.
- Business consultants.
- Debt advisers.
- Financial advisers.
- HR consultants.
- SME networks.
- Business rescue practitioners.
- Commercial property managers.

Rules:

- Agent may research and draft.
- Owner approves lead lists.
- Owner approves email copy.
- Outreach must include opt-out wording.
- No bulk spam.
- All communication is logged.
- Outreach must not exploit vulnerable people.

## User Roles

## Owner / Principal Attorney

Full access.

Can:

- View all client files.
- Create and edit matters.
- Approve invoices.
- Approve statements.
- Approve marketing posts.
- Approve direct outreach campaigns.
- Send or approve client communication.
- View audit logs.
- Manage staff permissions.
- Manage agent instructions.

## Admin Staff

Limited access.

Can:

- View assigned client files.
- Upload documents.
- Prepare draft line items.
- Prepare draft invoices.
- Record notes.
- View payment status if permitted.

Cannot:

- Approve invoices or statements unless explicitly allowed.
- Approve marketing unless explicitly allowed.
- Change permissions.
- Delete protected records.

## OpenClaw Agent

Controlled automation user.

Can:

- Draft, prepare, remind, research and route work.

Cannot:

- Send, publish, approve or override sensitive actions without owner approval.

## Read-Only Reviewer

Optional role.

Can:

- View selected files or reports.

Cannot:

- Edit, approve, send or publish.

## Suggested Technical Architecture

The final architecture must be confirmed after discovery, especially around Lexpro, WhatsApp and hosting.

Planning assumption:

- Frontend: modern secure web app.
- Backend: API service.
- Database: PostgreSQL or similar relational database.
- File storage: secure object storage or equivalent.
- Agent integration: OpenClaw through controlled API endpoints.
- Email: Microsoft 365 shared mailbox, Graph API, or SMTP depending on Burgess Attorneys setup.
- WhatsApp: OpenClaw WhatsApp session or WhatsApp Business API depending on reliability and compliance.
- Social posting: official Meta and LinkedIn APIs where approved and practical.
- PDF generation: server-side invoice and statement generator.
- Hosting: confirm xneelo hosting product before final decision.

Hosting options to review:

- Website on xneelo, app/API elsewhere.
- Full app on xneelo Cloud or Managed Server if suitable.
- Full app on another managed app platform, with website/domain connected.

## Security, Privacy And Audit

Security must be designed from day one because the platform will handle legal, financial and personal information.

Required controls:

- Authentication.
- Role-based access control.
- Server-side permission checks.
- Strong password rules.
- MFA recommendation.
- Encrypted HTTPS traffic.
- Secure document storage.
- Audit logs for sensitive activity.
- Agent action logs.
- Immutable records for invoice approvals, statement approvals and payment changes.
- Redaction of sensitive data from error logs.
- Secure environment variables.
- No secrets in Git.
- Separate development, staging and production environments.
- Backup and disaster recovery plan.
- POPIA/privacy compliance review checklist.

Critical audit events:

- Login and failed login.
- Client file opened or edited.
- Document uploaded.
- Invoice line item created or edited.
- Invoice approved or sent.
- Statement approved or sent.
- Payment imported or manually captured.
- Marketing post approved or published.
- Outreach email approved or sent.
- Agent action.
- Permission change.

## Proposed Build Phases

## Phase 1: Discovery And Design

Confirm:

- Current website, domain and hosting.
- Email setup.
- Lexpro access method.
- Invoice and statement samples.
- VAT/tax rules.
- Invoice numbering and statement format.
- Matter categories.
- Users and permissions.
- Agent WhatsApp number and email.
- Social media accounts.
- Branding.

Deliverable:

- Final technical specification and approved build plan.

## Phase 2: Admin Core

Build:

- Login.
- Client file list.
- Client file detail.
- Manual client/matter creation.
- Document upload.
- Timeline/history.
- Audit logs.

## Phase 3: Invoice And Statement Drafting

Build:

- Manual line items.
- Draft invoices.
- Draft statements.
- Approval workflow.
- PDF output.
- Approved email/WhatsApp sending.

## Phase 4: WhatsApp Voice Note Capture

Build:

- Voice note receipt.
- Transcription.
- Structured extraction.
- File matching.
- Clarification workflow.
- Draft line item creation.
- Owner review.

## Phase 5: Lexpro Sync Or Import

Build:

- Selected Lexpro integration route.
- Payment import/sync.
- Account matching.
- Reconciliation exception queue.
- Sync logs.

## Phase 6: Website Rebuild

Build:

- Public website.
- Service pages.
- Lead forms.
- WhatsApp/email contact.
- Analytics and SEO basics.
- Legal disclaimers.

## Phase 7: Marketing Automation

Build:

- 30-day content calendar.
- Draft post workflow.
- Approval workflow.
- Scheduling/posting where approved.
- Campaign history.

## Phase 8: Lead Research And Outreach

Build:

- Lead database.
- Referral source research workflow.
- Owner approval.
- Outreach templates.
- Follow-up reminders.
- Outreach logs.

## Key Risks And Assumptions

Risks:

- Lexpro may not provide an API or automated export.
- WhatsApp automation reliability may depend on chosen provider/session model.
- Social posting APIs may require business verification or app approvals.
- Legal and POPIA compliance must be reviewed before production use.
- Invoice and statement rules must be confirmed before any automation sends client-facing documents.
- Client confidentiality requires strict access controls and audit logging.

Assumptions:

- Lexpro remains accounting source of truth initially.
- Owner approval is mandatory for invoices, statements, marketing and outreach.
- The system will start with controlled drafts before deeper automation.
- The first build should prioritise admin and billing workflow before broader marketing automation.

## Discovery Questions For Client Review

Business and firm:

- What is the official firm name to use in the system and website?
- What is the current website URL?
- What domain is used for email?
- Who needs access to the platform?
- Who approves invoices and statements?
- Who currently handles client payments?

Lexpro:

- Which Lexpro product or module is used?
- Is Lexpro cloud or desktop?
- Does Lexpro provide an API?
- Can Lexpro export CSV/XLS reports?
- Can reconciled payments be exported automatically?
- Are invoices currently generated in Lexpro?
- Are statements currently generated in Lexpro?
- What must remain inside Lexpro for compliance or accounting reasons?

Invoicing:

- Can Burgess Attorneys provide sample invoice and statement PDFs?
- Is the firm VAT registered?
- What VAT treatment applies to matters and disbursements?
- What invoice numbering rules must be followed?
- What line item formats are used?
- Are matters billed by time, fixed fee, or both?
- What are the payment terms?
- What bank/trust account wording must appear?

WhatsApp and email:

- Which WhatsApp number should the agent use?
- Which email address should the agent use?
- Can the agent send from a shared mailbox?
- What email signature must be used?
- Which message types require attorney approval?

Website and marketing:

- What are the current brand colours and logo files?
- Which social accounts exist?
- What geographic area should the firm target?
- Which services should be prioritised first?
- Are there existing testimonials, articles or content?
- Should the website be English, Afrikaans, or both?

Leads and outreach:

- Which referral categories should be researched first?
- Which known churches, community groups, accountants or advisers should be included?
- What outreach tone is acceptable?
- Who approves outreach lists and messages?

## Client Review Decisions Needed

Before development starts, Burgess Attorneys should approve:

- Overall project scope.
- MVP phase order.
- User roles and permissions.
- Whether Lexpro remains the accounting source of truth.
- Approval rules for invoices, statements, marketing and outreach.
- Agent name, email and WhatsApp setup.
- Website page list and priority services.
- Marketing channels to include first.
- Hosting direction after xneelo discovery.

