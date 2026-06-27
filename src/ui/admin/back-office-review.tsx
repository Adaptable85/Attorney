import Link from "next/link";
import type { ReactNode } from "react";

import {
  accessPermissionLabels,
  accessReviewPrompts,
  auditReviewPrompts,
  billingReviewPrompts,
  demoAccessRoles,
  disabledAccessFutureActions,
  disabledAuditFutureActions,
  disabledBillingFutureActions,
  disabledLexproFutureActions,
  lexproReviewPrompts,
  type AccessPermissionKey,
  type DemoAuditTimelineRecord,
  type DemoBillingReviewRecord,
  type DemoLexproBoundaryItem
} from "./back-office-review-data";

function DemoSafetyBanner({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="client-safety-banner" role="note">
      <strong>Demo only. Read-only review.</strong>
      {children}
    </div>
  );
}

function DisabledActionList({
  actions,
  note
}: Readonly<{ actions: readonly string[]; note: string }>) {
  return (
    <article className="client-review-card">
      <h2>Future actions disabled</h2>
      <ul className="client-disabled-actions">
        {actions.map((action) => (
          <li key={action} data-disabled="true">
            {action}
          </li>
        ))}
      </ul>
      <p className="client-review-note">{note}</p>
    </article>
  );
}

function ReviewPromptList({
  prompts
}: Readonly<{ prompts: readonly string[] }>) {
  return (
    <section className="client-review-card" aria-labelledby="review-prompts-title">
      <h2 id="review-prompts-title">Questions for Stephanie</h2>
      <ol className="client-review-list">
        {prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ol>
    </section>
  );
}

export function BillingReview({
  records
}: Readonly<{ records: readonly DemoBillingReviewRecord[] }>) {
  return (
    <section className="client-review" aria-labelledby="billing-review-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Back-office read-only review</p>
          <h1 id="billing-review-title">Billing Review</h1>
          <p>
            Review future draft invoice and statement boundaries before official
            numbers, approval workflows, client sending or collection features exist.
          </p>
        </div>
        <span>Read-only review mode</span>
      </div>

      <DemoSafetyBanner>
        <span>No real invoices.</span>
        <span>No real statements.</span>
        <span>No payment collection.</span>
        <span>No write path.</span>
        <span>Lexpro remains the source of truth where applicable.</span>
      </DemoSafetyBanner>

      <div className="client-review__summary" aria-label="Billing review summary">
        <article>
          <span>Demo billing records</span>
          <strong>{records.length}</strong>
        </article>
        <article>
          <span>Official numbering</span>
          <strong>Disabled</strong>
        </article>
        <article>
          <span>Client sending</span>
          <strong>Disabled</strong>
        </article>
      </div>

      <div className="client-review__grid">
        {records.map((record) => (
          <article key={record.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{record.title}</h2>
              <span>Demo only</span>
            </div>
            <p>{record.reviewNote}</p>
            <dl>
              <div>
                <dt>Linked client</dt>
                <dd>
                  <Link href={`/admin/clients/${record.linkedClientSlug}`}>
                    {record.linkedClient}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Linked matter</dt>
                <dd>
                  <Link href={`/admin/matters/${record.linkedMatterSlug}`}>
                    {record.linkedMatter}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Record type</dt>
                <dd>{record.recordType}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{record.status}</dd>
              </div>
              <div>
                <dt>Amount placeholder</dt>
                <dd>{record.amountPlaceholder}</dd>
              </div>
              <div>
                <dt>Date placeholder</dt>
                <dd>{record.datePlaceholder}</dd>
              </div>
              <div>
                <dt>Approval state placeholder</dt>
                <dd>{record.approvalStatePlaceholder}</dd>
              </div>
              <div>
                <dt>Data label</dt>
                <dd>Demo only</dd>
              </div>
            </dl>
            <p>{record.lexproBoundaryNote}</p>
            <Link className="read-card__link" href={`/admin/billing/${record.slug}`}>
              Review demo billing item
            </Link>
          </article>
        ))}
      </div>

      <ReviewPromptList prompts={billingReviewPrompts} />

      <DisabledActionList
        actions={disabledBillingFutureActions}
        note="These labels are review prompts only. There is no form submission, no official numbering, no PDF generation, no client send action and no real invoice workflow in this phase."
      />
    </section>
  );
}

export function BillingDetailPreview({
  record
}: Readonly<{ record: DemoBillingReviewRecord }>) {
  return (
    <section className="client-review" aria-labelledby="billing-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo billing preview</p>
          <h1 id="billing-detail-title">{record.title}</h1>
          <p>
            Read-only draft billing preview. No official invoice number, statement
            generation, client send action or write path is enabled.
          </p>
        </div>
        <span>Demo only</span>
      </div>

      <DemoSafetyBanner>
        <span>Billing metadata is placeholder-only.</span>
        <span>No real client billing data is shown.</span>
        <span>No approval or collection action is active.</span>
      </DemoSafetyBanner>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Draft billing metadata</h2>
          <dl>
            <div>
              <dt>Linked client</dt>
              <dd>
                <Link href={`/admin/clients/${record.linkedClientSlug}`}>
                  {record.linkedClient}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Linked matter</dt>
              <dd>
                <Link href={`/admin/matters/${record.linkedMatterSlug}`}>
                  {record.linkedMatter}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Record type</dt>
              <dd>{record.recordType}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{record.status}</dd>
            </div>
            <div>
              <dt>Amount placeholder</dt>
              <dd>{record.amountPlaceholder}</dd>
            </div>
            <div>
              <dt>Approval boundary</dt>
              <dd>{record.approvalStatePlaceholder}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Proposed line-item summary</h2>
          <ul className="client-review-list">
            {record.lineItemSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{record.lexproBoundaryNote}</p>
          <p>{record.auditNote}</p>
        </article>
      </div>

      <DisabledActionList
        actions={disabledBillingFutureActions}
        note="All future billing labels are inert. No create, edit, generate, send, approval, posting, paid-status, PDF or audit-history action is active."
      />

      <Link className="read-card__link" href="/admin/billing">
        Back to Billing Review
      </Link>
    </section>
  );
}

export function LexproBoundaryReview({
  items
}: Readonly<{ items: readonly DemoLexproBoundaryItem[] }>) {
  return (
    <section className="client-review" aria-labelledby="lexpro-review-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Source-of-truth boundary review</p>
          <h1 id="lexpro-review-title">Lexpro Boundary Review</h1>
          <p>
            Review where the Burgess platform may later display operational summaries
            while Lexpro remains authoritative for legal accounting, trust accounting,
            reconciled payments, compliance records and official outputs.
          </p>
        </div>
        <span>Read-only review mode</span>
      </div>

      <DemoSafetyBanner>
        <span>No live Lexpro integration.</span>
        <span>No API calls.</span>
        <span>No sync.</span>
        <span>No import or export.</span>
        <span>No credentials.</span>
        <span>No write-back.</span>
      </DemoSafetyBanner>

      <div className="client-review__grid">
        {items.map((item) => (
          <article key={item.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{item.boundaryArea}</h2>
              <span>{item.riskLevel} risk</span>
            </div>
            <p>{item.reviewNote}</p>
            <dl>
              <div>
                <dt>Current system of record</dt>
                <dd>{item.currentSystemOfRecord}</dd>
              </div>
              <div>
                <dt>Burgess platform future role</dt>
                <dd>{item.burgessFutureRole}</dd>
              </div>
              <div>
                <dt>Required approval before integration</dt>
                <dd>{item.requiredApproval}</dd>
              </div>
              <div>
                <dt>Data label</dt>
                <dd>Demo only</dd>
              </div>
            </dl>
            <Link className="read-card__link" href={`/admin/lexpro/${item.slug}`}>
              Review boundary detail
            </Link>
          </article>
        ))}
      </div>

      <ReviewPromptList prompts={lexproReviewPrompts} />

      <DisabledActionList
        actions={disabledLexproFutureActions}
        note="These labels are review prompts only. There is no Lexpro connection, import, export, sync, credential setup or write-back."
      />
    </section>
  );
}

export function LexproBoundaryDetail({
  item
}: Readonly<{ item: DemoLexproBoundaryItem }>) {
  return (
    <section className="client-review" aria-labelledby="lexpro-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo Lexpro boundary detail</p>
          <h1 id="lexpro-detail-title">{item.boundaryArea}</h1>
          <p>
            Read-only boundary detail. Any future Lexpro connection requires separate
            security review, data mapping, approval process and rollback plan.
          </p>
        </div>
        <span>{item.riskLevel} risk</span>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Boundary summary</h2>
          <dl>
            <div>
              <dt>Source of truth</dt>
              <dd>{item.currentSystemOfRecord}</dd>
            </div>
            <div>
              <dt>Future Burgess role</dt>
              <dd>{item.burgessFutureRole}</dd>
            </div>
            <div>
              <dt>Approval required</dt>
              <dd>{item.requiredApproval}</dd>
            </div>
            <div>
              <dt>Audit considerations</dt>
              <dd>{item.auditConsiderations}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Data boundary</h2>
          <h3>Allowed to display later</h3>
          <ul className="client-review-list">
            {item.allowedDisplayLater.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <h3>Not allowed without approval</h3>
          <ul className="client-review-list">
            {item.notAllowedWithoutApproval.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </article>
      </div>

      <DisabledActionList
        actions={disabledLexproFutureActions}
        note="All Lexpro integration labels are disabled. No connection, import, export, sync, update, credential or reconciliation action is active."
      />

      <Link className="read-card__link" href="/admin/lexpro">
        Back to Lexpro Boundary Review
      </Link>
    </section>
  );
}

export function AuditTrailReview({
  records
}: Readonly<{ records: readonly DemoAuditTimelineRecord[] }>) {
  return (
    <section className="client-review" aria-labelledby="audit-review-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Sensitive-action visibility review</p>
          <h1 id="audit-review-title">Audit Trail Review</h1>
          <p>
            Review the future audit trail shape. Future audit logging should record
            who did what, when, from which role and why.
          </p>
        </div>
        <span>Read-only review mode</span>
      </div>

      <DemoSafetyBanner>
        <span>No real audit events.</span>
        <span>No production audit writes.</span>
        <span>No export or delete action.</span>
      </DemoSafetyBanner>

      <div className="client-review__grid">
        {records.map((record) => (
          <article key={record.slug} className="client-review-card">
            <div className="read-card__title-row">
              <h2>{record.actionType}</h2>
              <span>Demo only</span>
            </div>
            <p>{record.reviewNote}</p>
            <dl>
              <div>
                <dt>Timestamp placeholder</dt>
                <dd>{record.timestampPlaceholder}</dd>
              </div>
              <div>
                <dt>Actor placeholder</dt>
                <dd>{record.actorPlaceholder}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{record.role}</dd>
              </div>
              <div>
                <dt>Section</dt>
                <dd>{record.section}</dd>
              </div>
              <div>
                <dt>Linked record</dt>
                <dd>{record.linkedRecord}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{record.result}</dd>
              </div>
              <div>
                <dt>Risk/sensitivity marker</dt>
                <dd>{record.sensitivity}</dd>
              </div>
              <div>
                <dt>Data label</dt>
                <dd>Demo only</dd>
              </div>
            </dl>
            <Link className="read-card__link" href={`/admin/audit/${record.slug}`}>
              Review audit event
            </Link>
          </article>
        ))}
      </div>

      <ReviewPromptList prompts={auditReviewPrompts} />

      <DisabledActionList
        actions={disabledAuditFutureActions}
        note="Audit labels are review prompts only. No export, evidence download, resolution, comment, escalation or deletion action is active."
      />
    </section>
  );
}

export function AuditEventDetail({
  record
}: Readonly<{ record: DemoAuditTimelineRecord }>) {
  return (
    <section className="client-review" aria-labelledby="audit-detail-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Demo audit event detail</p>
          <h1 id="audit-detail-title">{record.actionType}</h1>
          <p>
            Read-only audit event preview. This is demo-only and cannot be resolved,
            edited, exported or deleted.
          </p>
        </div>
        <span>Demo only</span>
      </div>

      <div className="client-review__grid">
        <article className="client-review-card">
          <h2>Event metadata</h2>
          <dl>
            <div>
              <dt>Actor</dt>
              <dd>{record.actorPlaceholder}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{record.role}</dd>
            </div>
            <div>
              <dt>Timestamp</dt>
              <dd>{record.timestampPlaceholder}</dd>
            </div>
            <div>
              <dt>Action</dt>
              <dd>{record.actionType}</dd>
            </div>
            <div>
              <dt>Linked record</dt>
              <dd>{record.linkedRecord}</dd>
            </div>
            <div>
              <dt>Sensitivity</dt>
              <dd>{record.sensitivity}</dd>
            </div>
          </dl>
        </article>

        <article className="client-review-card">
          <h2>Review notes</h2>
          <p>{record.beforeAfterPlaceholder}</p>
          <p>{record.retentionNote}</p>
          <p>{record.reviewNote}</p>
        </article>
      </div>

      <DisabledActionList
        actions={disabledAuditFutureActions}
        note="All audit event labels are disabled. No export, download, resolve, comment, escalation or deletion action is active."
      />

      <Link className="read-card__link" href="/admin/audit">
        Back to Audit Trail Review
      </Link>
    </section>
  );
}

export function AccessControlReview() {
  const permissionKeys = Object.keys(accessPermissionLabels) as AccessPermissionKey[];

  return (
    <section className="client-review" aria-labelledby="access-review-title">
      <div className="client-review__hero">
        <div>
          <p className="review-hero__eyebrow">Role and access proposal review</p>
          <h1 id="access-review-title">Access Control Review</h1>
          <p>
            Review the proposed role matrix. Staging password access is active for
            read-only review only; Microsoft Entra is not live and production auth is
            not enabled.
          </p>
        </div>
        <span>Proposal-only matrix</span>
      </div>

      <DemoSafetyBanner>
        <span>No role changes enabled.</span>
        <span>No user management.</span>
        <span>No invites.</span>
        <span>No password display.</span>
        <span>No secrets.</span>
      </DemoSafetyBanner>

      <article className="client-review-card">
        <h2>Future role matrix</h2>
        <p>
          Every permission below is proposal-only. The current staging role remains
          Read-Only Reviewer.
        </p>
        <div className="access-matrix" role="table" aria-label="Proposed access matrix">
          <div className="access-matrix__header" role="row">
            <span role="columnheader">Role</span>
            {permissionKeys.map((key) => (
              <span key={key} role="columnheader">
                {accessPermissionLabels[key]}
              </span>
            ))}
          </div>
          {demoAccessRoles.map((role) => (
            <div className="access-matrix__row" role="row" key={role.role}>
              <span role="cell">
                <strong>{role.role}</strong>
                <small>{role.summary}</small>
              </span>
              {permissionKeys.map((key) => (
                <span role="cell" key={key}>
                  {role.permissions[key]}
                </span>
              ))}
            </div>
          ))}
        </div>
      </article>

      <ReviewPromptList prompts={accessReviewPrompts} />

      <DisabledActionList
        actions={disabledAccessFutureActions}
        note="Access labels are review prompts only. No invite, role change, user removal, Microsoft login enablement, reset, SSO configuration or secret view is active."
      />
    </section>
  );
}
