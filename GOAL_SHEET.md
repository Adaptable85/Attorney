# Burgess Attorneys Goal Sheet

Date: 2026-06-08
Status: Client review draft

## Primary Goal

Build a secure administration and automation platform that helps Burgess Attorneys reduce manual admin work, prepare invoices and statements faster, manage client files more clearly, improve client communication, rebuild the website, and run controlled marketing and outreach workflows.

The platform must protect client confidentiality and keep the owner in control of sensitive decisions.

## Guiding Principle

The system should not be an uncontrolled legal AI bot.

It should be a controlled legal administration platform where the agent prepares drafts, asks for clarification, reminds the owner, researches information and routes work, while the owner approves all sensitive actions before anything is sent, published or finalised.

## Business Outcomes

## 1. Reduce Invoice And Statement Admin Time

Outcome:

- The owner can capture billing work quickly and convert it into structured draft invoice line items.

Success criteria:

- Owner can add line items manually.
- Owner can send WhatsApp voice notes that become draft line items.
- Drafts are matched to client files.
- Uncertain matches trigger clarification.
- Owner can approve, edit or reject each draft line item.
- Draft invoices and statements are generated for review.
- No invoice or statement is sent without approval.

## 2. Improve Client File Visibility

Outcome:

- The owner can see open matters, balances, invoice status, payment status and recent communication in one admin dashboard.

Success criteria:

- Open client files are listed clearly.
- Search works by name, account number, matter type and status.
- Filters show unpaid balances and drafts awaiting approval.
- Each client file has a timeline of notes, documents, invoices, statements, payments and communications.
- Staff access can be limited by role.

## 3. Keep Lexpro As Accounting Source Of Truth

Outcome:

- The new system supports admin and operational visibility while Lexpro remains the accounting record unless a future integration decision changes this.

Success criteria:

- Lexpro integration options are investigated.
- Payment and balance updates are pulled, imported or manually captured depending on what Lexpro allows.
- Imported payments are matched to client account numbers.
- Unmatched items are flagged for review.
- Approved financial records are not overwritten without correction history.
- Every sync/import/manual payment update is logged.

## 4. Add Controlled Agent Assistance

Outcome:

- The OpenClaw agent helps with admin, drafting, reminders, marketing and research while staying inside strict permissions.

Success criteria:

- Agent has its own email and WhatsApp setup.
- Agent can draft invoice line items from voice notes.
- Agent can draft emails and WhatsApp replies.
- Agent can draft marketing calendars and posts.
- Agent can research referral leads.
- Agent can prepare weekly reports.
- Agent cannot send invoices, statements, marketing posts or outreach without approval.
- Agent actions are recorded in an audit log.

## 5. Rebuild The Website

Outcome:

- Burgess Attorneys has a professional website that explains services clearly and captures enquiries.

Success criteria:

- Website has service pages for family law and commercial law.
- Website includes pages for maintenance, divorce, care and custody, financial distress, contracts and business rescue proceedings.
- Contact forms and WhatsApp contact are available.
- Website includes legal disclaimer wording.
- Website is mobile-first, fast and SEO-friendly.
- Leads can be captured and routed to the backend where practical.
- Analytics are installed.

## 6. Create A Marketing Approval System

Outcome:

- The firm can plan and approve consistent marketing without unapproved publishing.

Success criteria:

- Agent can draft a 30-day content calendar.
- Owner can review, edit, approve, reject or request changes.
- Posts are tracked by channel, audience, topic and status.
- Approved posts can be scheduled where integrations allow.
- Posted history and basic performance data are visible.
- Content remains professional, careful and non-aggressive.

## 7. Support Ethical Lead Research And Outreach

Outcome:

- The firm can build referral lists and outreach campaigns around family law and commercial law in a respectful, privacy-conscious way.

Success criteria:

- Lead database stores source, relevance, category and outreach status.
- Family law referral sources can be researched.
- Commercial law referral sources can be researched.
- Owner approves lead lists before outreach.
- Owner approves message copy before outreach.
- Outreach includes opt-out wording.
- Communication history is logged.
- The system avoids spam and avoids exploiting vulnerable people.

## MVP Goals

## MVP Goal 1: Admin Core

Build:

- Login.
- Client files.
- Matter records.
- Notes.
- Documents.
- Timeline.
- Basic audit logging.

Why it matters:

- This creates the foundation for all future automation.

## MVP Goal 2: Draft Billing Workflow

Build:

- Manual line item capture.
- Draft invoices.
- Draft statements.
- Approval queue.
- PDF generation.
- Approved sending workflow.

Why it matters:

- This addresses the immediate time problem around invoices and statements.

## MVP Goal 3: WhatsApp Voice Note Capture

Build:

- Voice note capture.
- Transcription.
- Billing field extraction.
- Client-file matching.
- Clarification process.
- Draft line item creation.

Why it matters:

- This lets the owner record work naturally and quickly while still keeping financial control.

## MVP Goal 4: Lexpro Discovery And Payment Import

Build or plan after discovery:

- API sync if available.
- CSV/XLS upload if export is available.
- Email-parser import if reports are available.
- Manual payment capture if no integration is practical.

Why it matters:

- Payment and balance visibility is essential, but Lexpro must remain protected as the accounting source of truth.

## MVP Goal 5: Website Rebuild Foundation

Build:

- Core public pages.
- Contact form.
- WhatsApp contact.
- SEO basics.
- Analytics.
- Privacy and disclaimer pages.

Why it matters:

- This improves client acquisition and creates a public-facing base for future content.

## Stretch Goals After MVP

## Marketing Automation

- 30-day calendar generator.
- Multi-channel post drafts.
- Approval workflow.
- Scheduling integrations.
- Campaign history and performance tracking.

## Lead Research And Outreach

- Referral source database.
- Research assistant workflow.
- Outreach template drafts.
- Approval workflow.
- Follow-up reminders.

## Deeper Lexpro Automation

- Scheduled payment sync.
- Reconciliation exception queue.
- More advanced reporting.

## Advanced Reporting

- Weekly admin summary.
- Outstanding balances report.
- Pending approval report.
- Open matter report.
- Marketing activity report.

## Approval Rules

These rules should be treated as non-negotiable unless Burgess Attorneys later approves a change in writing.

- No invoice is sent without owner approval.
- No statement is sent without owner approval.
- No marketing post is published without owner approval.
- No direct outreach campaign is sent without owner approval.
- No agent response should provide final legal advice.
- No approved financial record should be changed without correction history.
- No client record should be deleted by the agent.
- Every sensitive action should be logged.

## Measures Of Success

The project will be successful if:

- The owner spends less time preparing invoices and statements.
- Client files are easier to find, review and update.
- Draft line items from WhatsApp voice notes are accurate enough to save time.
- The owner has a clear queue of items needing approval.
- Payments and balances are easier to monitor through Lexpro sync/import/manual updates.
- The website looks professional and captures enquiries.
- Marketing content can be prepared consistently without losing approval control.
- Referral outreach is ethical, traceable and useful.
- The system protects confidential client information.

## Discovery Goals Before Build

Before development starts, confirm:

- Official firm name and branding.
- Website URL and hosting setup.
- Email and WhatsApp setup.
- Lexpro version and integration/export options.
- Invoice and statement examples.
- VAT and billing rules.
- Required user roles.
- Marketing channels.
- Target geography.
- Language requirements.
- POPIA/privacy expectations.

## Review Checklist For Client

Please review and confirm:

- The project purpose is correct.
- The platform modules are correct.
- The MVP order is correct.
- The owner approval rules are correct.
- Lexpro should remain the accounting source of truth initially.
- The website pages are correct.
- The marketing channels are correct.
- The lead categories are acceptable.
- The agent permissions and restrictions are acceptable.
- Any missing legal, financial, operational or brand requirements.

