# 07 — Accounts & Access

← [Playbook index](README.md)

Which systems exist, what each is for, and how to get into them.

> **No names, emails, phone numbers or credentials appear in this chapter.** This
> repository is public. Who holds what belongs in the **private companion
> document** in the DDA's Google Drive. See [the handover section](#handover)
> below for what that document must contain.

---

## The systems

| System | What it holds | Who administers it |
| --- | --- | --- |
| **Firebase / Google Cloud** — project `senoiaporchfest` | Hosting, Firestore, Cloud Functions, Auth. Blaze (pay-as-you-go) plan. | The site maintainer |
| **GitHub** — `jermdw/porchfest` (public) | All code, print generators, this playbook | The site maintainer |
| **Namecheap** | DNS for `senoiaporchfest.org` | The site maintainer |
| **Ticket Tailor** | VIP tickets and sponsorship checkout | **The DDA** |
| **Resend** | Volunteer confirmation emails | The site maintainer |
| **Google Tag Manager / GA4** | Site analytics | The site maintainer |
| **Google Drive** | Source artwork, sponsor logos, rosters, the private companion | The DDA |

The **sister site** is the Senoia Car Show (`jermdw/senoia-car-show`, project
`senoiacar`, senoiacar.show) — same architecture. Fixes that apply to both should
usually be ported across.

---

## Operational conventions

### One account for everything

All Firebase and Google Cloud work for this project runs through a **single
designated operations Google account**. The other login available on this machine
has a broken gcloud token, and its default can silently flip back after
re-authentication.

Guard against that:

```bash
npx firebase-tools login:use <ops-account>          # pin per directory
gcloud auth print-access-token --account <ops-account>   # always pass --account
```

The Firebase Hosting REST API additionally needs an
`x-goog-user-project: senoiaporchfest` header.

### CI has its own identity

GitHub Actions authenticates by **Workload Identity Federation** — GitHub's OIDC
token is exchanged for a `github-deploy` service account. There is **no
service-account key in this repository**, and there should never be one.

One-time GCP setup is `scripts/setup-ci-deploy.sh`. It is idempotent — re-run it
after granting a new role. (2nd-generation function deploys needed
`roles/run.admin` added this way.)

### Emulator writes

Local emulator REST writes need `Authorization: Bearer owner` to bypass rules.

---

## Granting a new organizer access

Both allowlists are **Firestore documents**, not code. No deploy is needed, and
changes take effect immediately.

**Full admin** — create a document in `admins/` whose ID is the person's
lowercase email address. They get the full `/admin` dashboard, including
volunteer contact details.

**Scoped, read-only organizer** — create a document in `organizers/` whose ID is
their lowercase email, with a `categories: string[]` field naming the shift
categories they may see. They get a read-only roster for those categories only.

Then confirm they can actually sign in — see
[04 — Admin sign-in](04-volunteer-system.md#admin-sign-in). Google accounts use
the popup; every other address uses the email magic link.

> **Remove departing organizers.** Deleting the document revokes access
> immediately. Make this part of the post-event close-out.

---

## Cost

The Firebase project is on the **Blaze** plan, which is pay-as-you-go with a free
tier. At this event's scale the site costs effectively nothing, but Blaze means
there is a **billing account attached** and no hard spending cap by default.

Worth doing once: set a **budget alert** in Google Cloud Billing so an unexpected
bill is noticed early. Ticket Tailor and Resend have their own billing, owned by
the DDA and the maintainer respectively.

---

## Handover

The single biggest continuity risk is not the code — it is that access and
context sit with one person. Before handing this off, make sure the **private
companion document** in the DDA's Drive contains:

1. **Who holds each account above**, with the email address used.
2. **The current `admins/` and `organizers/` rosters** — names and emails.
3. **Billing owners** for Firebase, Ticket Tailor and Resend.
4. **Domain registrar login ownership** for senoiaporchfest.org.
5. **Sponsor and vendor contacts**, and **porch host contacts** — never in this
   repository.
6. **A named second person** with Firebase project Owner and GitHub admin, so a
   single unavailable person cannot block the festival.

Then link that document from the DDA's own files — not from here.

> **Do not commit that document, or any part of it, to this repository.** If
> something in it needs to be referenced from the code, reference the *role*
> ("the ops account") and keep the identity in Drive.
