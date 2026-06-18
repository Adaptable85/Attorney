# Codex Planning Instruction: Burgess Attorneys Admin, Invoicing, Agent, Website and Marketing Platform

## 1. Project Name

Burgess Attorneys Admin Automation Platform

## 2. Primary Goal

Plan a secure web-based administration and automation platform for Burgess Attorneys that reduces the time spent on invoices, statements, client-file administration, payment updates, client communication, and marketing.

The platform must combine:

1. Attorney admin dashboard.
2. Client file management.
3. Draft invoice and statement automation.
4. WhatsApp voice-note capture for invoice line items.
5. Approval workflow before anything is sent to clients.
6. Lexpro payment/accounting integration, subject to API availability.
7. OpenClaw agent with its own email and WhatsApp.
8. Website rebuild.
9. Marketing calendar and social posting approval system.
10. Lead research and direct outreach support for family law and commercial law.

This first Codex task is planning only. Do not start building the production system yet. Produce a detailed technical plan, architecture, user flows, data model, integration plan, risk list, and phased build roadmap.

---

## 3. Business Context

Burgess Attorneys is an attorney firm that needs less manual admin work and stronger digital marketing.

The firm’s legal focus areas are:

### Family Law

- Maintenance matters.
- Divorce.
- Care and custody disputes.

### Commercial Law

- Financial distress.
- Contracts.
- Business rescue proceedings.

The system must support sensitive attorney-client data, legal accounting workflows, draft review, audit history, and strict approval controls.

---

## 4. Core Business Problems to Solve

### 4.1 Invoicing and Statements

Current invoicing and statements are too time-intensive.

The owner must be able to add work items quickly, preferably by WhatsApp voice note, and the system must convert those notes into structured draft invoice line items.

No invoice or statement may be sent without owner approval.

### 4.2 Client File Access

The owner must be able to log into an admin section, open client files, and view all active/open files in a clear list.

Each open file must show at minimum:

- Account number.
- Client name.
- Matter name or description.
- Matter type.
- Responsible attorney/user.
- Status.
- Latest invoice status.
- Latest statement balance.
- Last client communication date.
- Payment status.

### 4.3 Payments and Accounting

Current accounting is in Lexpro.

The new platform must not replace Lexpro immediately. It should become an admin and automation layer that syncs with Lexpro where possible.

Codex must investigate and document whether Lexpro provides:

- Public API.
- Private API.
- Export function.
- Scheduled reports.
- Webhooks.
- Database access.
- CSV/XLS import/export.
- Email-based statement/invoice reports.

Preferred model:

- Lexpro remains the accounting source of truth.
- Payments are reconciled inside Lexpro.
- The new platform pulls reconciled payments from Lexpro automatically if API access exists.
- If API access does not exist, plan an interim CSV/XLS upload or email-parser workflow.
- Do not design direct write-back to Lexpro until API rights and legal/accounting controls are confirmed.

### 4.4 Agent Communication

The platform must have an OpenClaw agent with its own:

- Email address.
- WhatsApp number/session.
- Admin dashboard access.
- Marketing workflow access.
- Client communication workflow access.

The agent may assist, draft, prepare, research, remind and route work, but must not send invoices, statements, legal advice, or marketing posts without owner approval.

### 4.5 Website Rebuild

The Burgess Attorneys website must be rebuilt as a professional conversion-focused legal services website.

The site must support:

- Clear service pages.
- Family law landing page.
- Maintenance landing page.
- Divorce landing page.
- Care and custody disputes landing page.
- Commercial law landing page.
- Financial distress landing page.
- Contracts landing page.
- Business rescue proceedings landing page.
- Contact forms.
- WhatsApp contact.
- Lead capture.
- Blog/articles/updates.
- SEO structure.
- Basic analytics.
- Fast, mobile-first design.
- Clear disclaimers that website content is general information and not legal advice.

### 4.6 Marketing System

In the same backend, include a marketing section for:

- Facebook.
- Instagram.
- LinkedIn.
- Email campaigns.
- WhatsApp community/client updates where appropriate.

The agent must generate a 30-day marketing calendar for approval.

The owner must be able to:

- Review each post.
- Edit each post.
- Approve each post.
- Reject each post.
- Request changes.
- Schedule approved posts.
- See posted history.
- See basic campaign performance.

The agent must not post directly without owner approval.

### 4.7 Lead Research and Outreach

The system must support lead research and direct email campaigns around Burgess Attorneys’ specialisations.

Potential referral sources include:

- Pastors and church leaders.
- Social workers.
- Counsellors.
- Community leaders.
- Schools and family-support networks, where appropriate.
- Accountants.
- Business consultants.
- Debt advisers.
- Financial advisers.
- Business owners.
- HR consultants.
- Business rescue practitioners.
- Commercial property managers.

The agent must help build referral lists and draft respectful outreach.

Important: Outreach must be ethical, professional, privacy-conscious, and must not exploit vulnerable people. It must position Burgess Attorneys as a trusted legal support option, not as an aggressive sales operation.

---

## 5. Required Planning Output From Codex

Create a planning pack with the following files:

1. 01_PROJECT_OVERVIEW.md
2. 02_USER_ROLES_AND_PERMISSIONS.md
3. 03_CORE_WORKFLOWS.md
4. 04_DATA_MODEL.md
5. 05_LEXPRO_INTEGRATION_DISCOVERY.md
6. 06_OPENCLAW_AGENT_DESIGN.md
7. 07_WEBSITE_REBUILD_PLAN.md
8. 08_MARKETING_AUTOMATION_PLAN.md
9. 09_LEAD_RESEARCH_AND_OUTREACH_PLAN.md
10. 10_SECURITY_PRIVACY_AND_AUDIT_PLAN.md
11. 11_HOSTING_AND_DEPLOYMENT_PLAN.md
12. 12_BUILD_PHASES_AND_BACKLOG.md
13. 13_DISCOVERY_QUESTIONS_FOR_OWNER.md

Do not produce generic content. Make the planning specific to Burgess Attorneys and the workflows described in this instruction.

---

## 6. User Roles

Plan at least the following roles:

### 6.1 Owner / Principal Attorney

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

### 6.2 Admin Staff

Limited access.

Can:

- View assigned client files.
- Upload documents.
- Prepare draft line items.
- Prepare draft invoices.
- Record notes.
- View payment status if permitted.
- Cannot approve invoices/statements unless explicitly allowed.
- Cannot approve marketing unless explicitly allowed.

### 6.3 OpenClaw Agent

Controlled automation user.

Can:

- Draft line items from WhatsApp voice notes.
- Draft invoice updates.
- Draft statement updates.
- Draft emails.
- Draft WhatsApp replies.
- Draft marketing content.
- Build marketing calendars.
- Research leads.
- Prepare outreach lists.
- Prepare reports.

Cannot:

- Send invoices without approval.
- Send statements without approval.
- Post marketing content without approval.
- Send direct outreach without approval.
- Give legal advice as if it is an attorney.
- Delete client records.
- Override payment or accounting data.
- Change approved financial records without creating a correction record.

### 6.4 Read-Only Reviewer

Optional.

Can view reports and selected files but cannot edit.

---

## 7. Core Workflow: Client Files

Plan the client-file admin section.

Required fields:

- Client ID.
- Account number.
- Client name.
- Contact person.
- Email.
- Phone.
- WhatsApp number.
- Matter type.
- Matter description.
- Status: open, pending, awaiting client, awaiting court, closed, archived.
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

Required UI:

- Dashboard with open files.
- Search by name, account number, matter type, status.
- Filter by matter type.
- Filter by unpaid balances.
- Filter by draft invoices awaiting approval.
- Open client file detail page.
- Timeline view for notes, invoices, statements, payments, emails and WhatsApps.
- Upload area for documents.

---

## 8. Core Workflow: WhatsApp Voice Note to Invoice Line Item

This is a critical workflow.

The owner sends a WhatsApp voice note to the OpenClaw agent, for example:

“Add to account 1024, Smith divorce matter, consultation with client and review of settlement proposal, one hour, R1,850.”

System process:

1. WhatsApp receives voice note.
2. Agent transcribes the voice note.
3. Agent extracts structured billing data:
   - Account number.
   - Client name if mentioned.
   - Matter.
   - Date of work.
   - Description.
   - Quantity/time.
   - Rate.
   - Amount.
   - VAT treatment if applicable.
   - Confidence score.
4. Agent matches the item to an open client file.
5. If account number is missing, agent asks a clarification question.
6. If client match is uncertain, agent asks for confirmation.
7. Agent creates draft invoice line item.
8. Owner sees draft line item in the admin dashboard.
9. Owner can approve, edit or reject.
10. Once approved, the line item is added to the draft invoice.
11. Invoice remains in draft until the full invoice is approved.
12. Only after final approval may the agent send the invoice and updated statement.

Important:

- Do not allow automatic final invoice sending.
- Every agent-created line item must have a source record linking back to the WhatsApp message, transcript and timestamp.
- Keep the original transcript for audit purposes.
- Allow corrections.

---

## 9. Core Workflow: Invoice and Statement Approval

Required invoice statuses:

- Draft.
- Awaiting owner approval.
- Approved.
- Sent.
- Cancelled.
- Corrected.
- Paid.
- Part-paid.
- Overdue.

Required statement statuses:

- Draft.
- Awaiting owner approval.
- Approved.
- Sent.
- Updated after payment.
- Closed.

Workflow:

1. Draft invoice is built from approved line items.
2. Owner reviews draft invoice.
3. Owner can edit line items.
4. Owner approves invoice.
5. System generates invoice PDF.
6. System updates the client statement.
7. Statement remains draft until approved.
8. Owner approves statement.
9. Agent sends invoice and statement to client by approved channel:
   - Email.
   - WhatsApp.
   - Both.
10. Communication is logged on the client file.
11. Client file balance is updated.
12. Payment is later pulled from Lexpro or uploaded manually.
13. Statement is updated after payment.

Planning must include PDF layout, invoice numbering logic, statement numbering/versioning, and correction notes.

---

## 10. Lexpro Integration Planning

Codex must not assume Lexpro has a usable API.

Create an integration discovery plan with these options:

### Option A: Lexpro API Available

Plan:

- Secure API credentials.
- Pull client accounts.
- Pull matters/files.
- Pull invoices if needed.
- Pull reconciled payments.
- Pull statement balances.
- Store external Lexpro IDs.
- Do not duplicate accounting source-of-truth logic.
- Use scheduled sync.
- Use idempotent import.
- Add sync logs and error handling.

### Option B: Lexpro Export Available But No API

Plan:

- Scheduled CSV/XLS export from Lexpro.
- Upload/import screen.
- Parse payments and balances.
- Match to client account numbers.
- Store import batches.
- Show unmatched payments for manual review.

### Option C: Email Reports Available

Plan:

- Create mailbox parser.
- Lexpro sends reports to a dedicated email.
- Agent reads attachment.
- Parser imports payment updates.
- Owner reviews unmatched items.

### Option D: No Practical Integration

Plan:

- Manual payment capture screen.
- Require admin/owner approval.
- Treat manual entries as operational updates only.
- Accounting source of truth remains Lexpro.

For all options:

- Keep audit trail.
- Do not overwrite approved financial records without version history.
- Build reconciliation exception queue.
- Add “last synced from Lexpro” timestamp.

---

## 11. Website Rebuild Planning

Create a website plan for Burgess Attorneys.

Pages:

1. Home.
2. About.
3. Family Law.
4. Maintenance.
5. Divorce.
6. Care and Custody Disputes.
7. Commercial Law.
8. Financial Distress.
9. Contracts.
10. Business Rescue Proceedings.
11. Articles / Legal Updates.
12. Contact.
13. Privacy Policy.
14. Terms / Disclaimer.

Website goals:

- Build trust.
- Generate leads.
- Explain services in simple language.
- Convert visitors to consultations.
- Connect directly to WhatsApp/email.
- Feed lead forms into the admin backend.
- Allow the agent to triage new enquiries.
- Track source of leads.

Website technical requirements:

- Mobile first.
- Fast load speed.
- SEO-friendly page structure.
- Analytics.
- Contact form spam protection.
- HTTPS.
- Admin-editable content if practical.
- Blog/article module if practical.
- Professional legal design: clean, serious, trustworthy.

Hosting:

- Confirm exact xneelo hosting product.
- If it is standard shared hosting, assess whether only static/PHP website hosting should live there while the app/API runs elsewhere.
- If xneelo Cloud or a Managed Server is available, assess whether full app hosting is practical.
- Provide deployment options with pros and cons.

---

## 12. Marketing Backend Planning

Create a marketing module inside the admin platform.

Required sections:

### 12.1 Content Calendar

- 30-day calendar.
- Channel: Facebook, Instagram, LinkedIn, email, WhatsApp.
- Post title.
- Post copy.
- Creative brief.
- Image/video requirement.
- Target audience.
- Legal service category.
- Status: draft, needs review, approved, scheduled, posted, rejected.
- Owner comments.
- Agent revision history.

### 12.2 Approval Workflow

No post may go live without approval.

Workflow:

1. Agent generates 30-day content calendar.
2. Owner reviews calendar.
3. Owner approves or requests changes.
4. Agent drafts posts.
5. Owner approves individual posts.
6. Approved posts are scheduled.
7. System posts directly through official channel APIs where possible.
8. System records post link and performance data.

### 12.3 Content Categories

Family law content:

- Maintenance rights and process.
- Preparing for divorce.
- Co-parenting and care/custody disputes.
- What documents to prepare.
- Myths about family law.
- When to speak to an attorney.

Commercial law content:

- Warning signs of business financial distress.
- Contracts every business should understand.
- Business rescue basics.
- Debt and creditor pressure.
- Director decision-making during distress.
- Reviewing agreements before signing.

Tone:

- Professional.
- Compassionate.
- Clear.
- Educational.
- Never aggressive.
- No guaranteed outcomes.
- No legal advice without consultation.

---

## 13. Lead Research and Outreach Planning

Create a lead research module.

Lead categories:

### 13.1 Family Law Referral Network

Potential sources:

- Pastors.
- Church offices.
- Social workers.
- Counsellors.
- Family-support organisations.
- Community leaders.
- School counsellors where appropriate.
- Mediators.

Outreach angle:

- Burgess Attorneys can be a trusted legal support resource for people dealing with maintenance, divorce, care and custody issues.
- Build relationships with referral partners.
- Offer educational talks, guides or consultation pathways.
- Avoid exploiting vulnerable people.

### 13.2 Commercial Law Referral Network

Potential sources:

- Accountants.
- Bookkeepers.
- Business consultants.
- Financial advisers.
- Debt advisers.
- Business rescue practitioners.
- HR consultants.
- SME networks.
- Chamber of commerce groups.
- Commercial property managers.
- Insurance brokers.

Outreach angle:

- Burgess Attorneys assists businesses with contracts, financial distress, and business rescue proceedings.
- Position the firm as a practical legal partner for SMEs under pressure.

Required lead fields:

- Name.
- Organisation.
- Role.
- Category.
- Email.
- Phone.
- Website.
- LinkedIn URL.
- Location.
- Source URL.
- Reason for relevance.
- Suggested outreach angle.
- Status: researched, approved, contacted, follow-up, replied, converted, rejected.
- Consent/opt-out status.
- Last contact date.
- Next follow-up date.

Rules:

- Agent may research and draft.
- Owner must approve outreach lists before sending.
- Owner must approve email copy before sending.
- Every outreach email must include opt-out wording.
- Do not send bulk spam.
- Keep a communication log.

---

## 14. OpenClaw Agent Design

Plan an OpenClaw agent called something like “Burgess Admin Agent” or propose a better professional name.

Agent responsibilities:

1. Monitor WhatsApp.
2. Monitor email.
3. Capture voice-note invoice instructions.
4. Ask clarification questions.
5. Draft invoice line items.
6. Prepare draft invoices and statements.
7. Remind owner of pending approvals.
8. Send approved invoices/statements.
9. Update client communication logs.
10. Draft marketing calendars.
11. Draft social posts.
12. Draft direct emails.
13. Research leads.
14. Prepare weekly admin reports.

Agent restrictions:

- Must never give final legal advice.
- Must never send invoice/statement without approval.
- Must never post social content without approval.
- Must never send direct outreach without approval.
- Must never change approved financial data without creating a correction record.
- Must never delete client files.
- Must escalate uncertain client/account matches.
- Must keep audit records of every action.

Agent tone:

- Professional.
- Calm.
- Clear.
- Suitable for a legal practice.
- No jokes in client-facing legal communication.
- No exaggerated marketing claims.

---

## 15. Security, Privacy and Audit Planning

This platform will handle attorney-client information and financial data. Plan security from day one.

Required:

- Authentication.
- Role-based access control.
- Server-side permission checks.
- Strong password rules.
- MFA recommendation.
- Audit log for all sensitive actions.
- Immutable log for invoice approval, statement approval and payment changes.
- Data encryption in transit.
- Secure storage of uploaded documents.
- Clear file access permissions.
- Backup plan.
- Disaster recovery plan.
- Admin activity log.
- Agent action log.
- Redaction of sensitive data from logs.
- Secure environment variable management.
- No secrets committed to Git.
- Separate dev/staging/production environments.
- Database migration plan.
- Error handling that does not expose sensitive data.
- POPIA/privacy compliance review checklist.

Critical audit events:

- Login.
- Failed login.
- File opened.
- File edited.
- Document uploaded.
- Invoice line item created.
- Invoice line item edited.
- Invoice approved.
- Invoice sent.
- Statement approved.
- Statement sent.
- Payment imported.
- Payment manually captured.
- Marketing post approved.
- Marketing post published.
- Outreach email approved.
- Outreach email sent.
- Agent action.
- Permission change.

---

## 16. Suggested Technical Architecture

Codex must propose the best technical architecture.

Preferred planning assumption:

- Frontend: modern web app.
- Backend: API service.
- Database: relational database such as PostgreSQL.
- File storage: secure object storage or equivalent.
- Agent integration: OpenClaw via controlled API endpoints.
- Email: Microsoft 365 or dedicated SMTP/Graph integration, depending on Burgess Attorneys setup.
- WhatsApp: OpenClaw/WhatsApp session or WhatsApp Business API, depending on reliability and compliance.
- Social posting: Meta API for Facebook/Instagram, LinkedIn API for LinkedIn, with approval system first.
- PDF generation: server-side invoice/statement PDF generator.
- Hosting: confirm xneelo product; evaluate whether app should be hosted on xneelo Cloud/Managed Server or external app platform, while website may remain on xneelo.

Do not overcomplicate the first version. The MVP must focus on:

1. Client files.
2. Voice note to draft line item.
3. Draft invoice/statement approval.
4. Sending approved invoices/statements.
5. Basic Lexpro import/sync approach.
6. Website rebuild plan.
7. Marketing calendar approval.

---

## 17. MVP Scope

Plan MVP in phases.

### Phase 1: Discovery and Design

- Confirm current Burgess website/domain/hosting.
- Confirm current email setup.
- Confirm Lexpro access method.
- Confirm invoice/statement examples.
- Confirm VAT/tax rules and invoice format.
- Confirm matter categories.
- Confirm users and permission levels.
- Confirm WhatsApp number/email for agent.
- Confirm social media accounts.
- Confirm branding.

### Phase 2: Admin Core

- Login.
- Client file list.
- Client file detail.
- Manual client/matter creation.
- Document upload.
- Timeline/history.
- Audit logs.

### Phase 3: Invoice and Statement Drafting

- Add line items manually.
- Generate draft invoice.
- Generate draft statement.
- Approval workflow.
- PDF output.
- Email/WhatsApp sending after approval.

### Phase 4: WhatsApp Voice Note Capture

- Receive voice note.
- Transcribe.
- Extract billing fields.
- Match account.
- Ask clarification where required.
- Create draft line item.
- Owner review.

### Phase 5: Lexpro Sync/Import

- Implement selected integration route after discovery.
- Pull/import payments.
- Match to accounts.
- Create reconciliation exception queue.

### Phase 6: Website Rebuild

- Build website pages.
- Add lead forms.
- Connect leads to backend.
- Add analytics and SEO basics.

### Phase 7: Marketing Automation

- 30-day calendar generator.
- Approval workflow.
- Social post drafts.
- Scheduling/posting where API access is approved.
- Campaign history.

### Phase 8: Lead Research and Outreach

- Lead database.
- Research workflow.
- Owner approval.
- Email templates.
- Follow-up reminders.
- Outreach logs.

---

## 18. Key Discovery Questions for Owner

Codex must prepare a discovery-question document covering:

### Business and Firm

1. What is the official firm name?
2. What is the current website URL?
3. What domain is used for email?
4. Who must have access to the platform?
5. Who approves invoices and statements?
6. Who handles client payments now?

### Lexpro

1. Which Lexpro product/module is used?
2. Is Lexpro cloud or desktop?
3. Is there an API?
4. Can Lexpro export CSV/XLS reports?
5. Can reconciled payments be exported automatically?
6. Are invoices currently generated in Lexpro?
7. Are statements currently generated in Lexpro?
8. What must remain inside Lexpro for compliance/accounting reasons?

### Invoicing

1. Provide sample invoice PDF.
2. Provide sample statement PDF.
3. Confirm VAT registration and VAT treatment.
4. Confirm invoice numbering rules.
5. Confirm line item formats.
6. Confirm rate structures.
7. Confirm whether time-based billing, fixed fees, or both are used.
8. Confirm payment terms.
9. Confirm bank details and trust/business account wording.

### WhatsApp and Email

1. Which WhatsApp number will the agent use?
2. Which email address will the agent use?
3. Can the agent send from a shared mailbox?
4. What signature must be used?
5. What messages require attorney approval?

### Website and Marketing

1. Current brand colours/logo.
2. Current social media accounts.
3. Target geographic area.
4. Preferred tone.
5. Services to prioritise.
6. Existing testimonials/reviews.
7. Existing articles/content.
8. Must the site be Afrikaans, English, or both?

### Leads

1. Which areas should lead research target first?
2. Which churches/community groups are already known?
3. Which accountants/business advisers are already known?
4. What outreach tone is acceptable?
5. Who approves outreach?

---

## 19. Important Product Opinion

Do not build this as a “general AI legal bot.”

Build it as a controlled attorney admin and marketing operating system.

The most valuable part is not the AI itself. The value is the workflow:

- Capture instruction quickly.
- Convert to structured draft.
- Match to client file.
- Keep it in draft.
- Get owner approval.
- Send correctly.
- Log everything.
- Update statement.
- Sync payments.
- Keep audit trail.

For a law firm, control and auditability are more important than speed.

---

## 20. Deliverable Format

After planning, Codex must produce:

1. Executive summary.
2. System architecture.
3. Full workflow diagrams in text/mermaid format.
4. Proposed database schema.
5. API endpoint plan.
6. Integration discovery plan.
7. Security model.
8. Agent permission model.
9. MVP build backlog.
10. Estimated phased build sequence.
11. Risks and assumptions.
12. Questions that must be answered before development starts.

Do not start coding until the planning pack is complete and reviewed.