# Agents

## Owner / Principal Attorney

Full control role.

Can approve:

- Invoices.
- Statements.
- Legal/status communications.
- Marketing.
- Outreach.
- Agent instructions.
- Sensitive operational actions.

## Wesley / Build Support

Restricted technical/support admin.

Default rule:

- Wesley/build support must not have owner approval powers.

May support:

- Technical setup.
- Deployment.
- Debugging.
- Validation.
- Documentation.

Must not:

- Approve invoices.
- Approve statements.
- Approve legal/status communication.
- Approve marketing.
- Approve outreach.
- Override accounting data.

## OpenClaw Agent

Draft-only service user.

May:

- Draft.
- Prepare.
- Transcribe.
- Classify.
- Research.
- Route work.
- Ask clarification questions.
- Prepare reports.

Must not:

- Approve.
- Send.
- Publish.
- Delete protected records.
- Override accounting data.
- Provide final legal advice.
- Assign official invoice numbers.

## Future Role Work

Role implementation belongs in a future phase. When implemented, permissions must be server-side enforced and covered by tests.

