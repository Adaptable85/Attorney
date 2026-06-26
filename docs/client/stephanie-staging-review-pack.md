# Burgess Attorneys App — Staging Review Pack

Prepared for: Stephanie Burgess

Prepared on: 2026-06-26

## Current Staging Link

https://attorney-web-production.up.railway.app

This is a staging/testing link only. It is not the final production system. No real client data should be entered.

## What Is Live Now

- The Railway staging app is online.
- The health endpoint is responding.
- The public landing page and admin routes load.
- Admin routes safely block access for unauthenticated users.
- Create client and create matter routes are not active for unauthenticated users.
- Live Microsoft login is disabled.
- UI save/write actions are disabled.
- Production writes are blocked.

## What You Can Safely Review

- General app loading.
- Basic structure and navigation feel.
- Safe blocked admin state.
- Whether the app direction makes sense visually and operationally.
- Whether the planned client, matter and admin structure aligns with Burgess Attorneys' workflow.

## What You Must Not Do Yet

- Do not enter real client information.
- Do not test real matters.
- Do not try to create invoices.
- Do not use it as a live system.
- Do not share it publicly.
- Do not treat the Railway URL as the final production domain.

## What Is Intentionally Disabled

- Microsoft Entra live login.
- Client creation.
- Matter creation.
- Invoice and statement workflows.
- UI saves.
- Production writes.
- WhatsApp.
- Email automation.
- Lexpro integration.
- Real data entry.

## What Has Been Completed So Far

- Technical foundation.
- Role and access model.
- Client, matter and billing foundation.
- Railway staging hosting.
- Railway Postgres provisioned.
- Railway app service deployed.
- Safe/off environment gates configured.
- Read-only staging review completed.
- Automated test suite passing.

## What Is Not Completed Yet

- Live Microsoft login.
- Real user access.
- Real client and matter data entry.
- Staging database migration, only if later needed.
- Invoice and statement workflow completion.
- Lexpro integration.
- WhatsApp and email workflows.
- Production domain.
- Production launch.

## Decisions Needed From You

- Confirm the Microsoft 365 tenant/admin access route.
- Confirm who should be the Principal Attorney/Owner user.
- Confirm who else needs access.
- Confirm initial client and matter fields.
- Confirm invoice and statement format expectations.
- Confirm whether the Lexpro workflow should be manual, export-based or automated later.
- Confirm the preferred production domain when ready.
- Confirm whether you would like a guided review call before enabling login.

## Recommended Next Steps

- Review the staging URL visually.
- Collect comments and questions.
- Prepare Microsoft Entra setup.
- Prepare controlled login enablement.
- Only after login and security review, consider controlled staging data flow.

## Safety Note

Keeping writes disabled is intentional and correct for a legal platform at this stage. Authentication, permissions and audit controls must be reviewed before real client data, live saves or production workflows are enabled.
