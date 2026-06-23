# nuxt-contact-form

A reusable, accessible, and secure contact form for **Nuxt 3 / Nuxt 4**.

It ships with sensible default styling and is built to be dropped into any Nuxt
project: copy a few files, set your environment variables, and you have a
working contact form with client- and server-side validation, spam protection,
rate limiting, and transactional email via [Resend](https://resend.com).

## Features

- **Three fields** — name, email, message — all required.
- **Client-side validation** with instant, per-field feedback (errors clear as
  you type) and a live character counter.
- **Server-side re-validation** — the client is never trusted.
- **Anti-spam honeypot** — a hidden field that traps bots without bothering
  real users or screen readers.
- **Rate limiting** — 5 requests/hour per IP via Upstash Redis, with a
  **fail-open** strategy (a Redis outage will not break your form).
- **HTML-escaped email body** to prevent injection.
- **`reply-to`** set to the visitor, so you can reply with one click.
- **Optional confirmation email** to the visitor (off by default,
  enable with `NUXT_CONTACT_SEND_CONFIRMATION=true`).
- **Accessible** — linked labels, `aria-required`, `aria-describedby`,
  `role="status"`/`role="alert"` messages, required-field markers.
- **Themeable with CSS variables** — no external CSS framework, easy to
  override.
- **Single source of truth** — validation rules shared between client and
  server.

## Tech stack

Nuxt 3 / Nuxt 4 · Vue 3 `<script setup>` · TypeScript · Resend · Upstash Redis.

## How it works

```
shared/contact-form.ts         Validation rules (regex + length limits).
                               Imported by BOTH client and server.

app/components/ContactForm.vue The client component (form UI + UX + styling).

server/api/contact.post.ts     The API endpoint:
                               honeypot -> rate limit -> validation ->
                               HTML escape -> send email.
```

## Installation

This project is meant to be **copied into your own Nuxt app** (it is not yet a
published npm package).

1. **Copy the files** into your Nuxt project, keeping the same paths:
   - `shared/contact-form.ts`
   - `app/components/ContactForm.vue`
   - `server/api/contact.post.ts`

2. **Install the dependencies:**

   ```bash
   npm install resend @upstash/ratelimit @upstash/redis
   ```

3. **Add the runtime config** to your `nuxt.config.ts`:

   ```ts
   export default defineNuxtConfig({
     runtimeConfig: {
       resendApiKey: "",
       contactRecipientEmail: "",
       contactFromEmail: "",
       upstashRedisRestUrl: "",
       upstashRedisRestToken: "",
       contactSendConfirmation: false,
     },
   });
   ```

4. **Create a `.env`** file (copy `.env.example`) and fill in your values.

5. **Use the component** anywhere:

   ```vue
   <template>
     <ContactForm />
   </template>
   ```

## Environment variables

Set these in `.env` (local) or your hosting provider (production). The `NUXT_`
prefix lets Nuxt map them onto `runtimeConfig` automatically.

| Variable                        | Description                                               |
| ------------------------------- | -------------------------------------------------------- |
| `NUXT_RESEND_API_KEY`           | Resend API key.                                          |
| `NUXT_CONTACT_RECIPIENT_EMAIL`  | Address that receives the messages (your inbox).         |
| `NUXT_CONTACT_FROM_EMAIL`       | Sender address (e.g. `onboarding@resend.dev` for tests). |
| `NUXT_UPSTASH_REDIS_REST_URL`   | Upstash Redis REST URL.                                  |
| `NUXT_UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token.                                |
| `NUXT_CONTACT_SEND_CONFIRMATION`| Set to `true` to also email a confirmation to the visitor (default: off). |

> **Rate limiting is optional and fails open.** If the Upstash variables are
> missing or unreachable, submissions still go through — the form keeps working.

> **Confirmation email is optional and off by default.** When enabled, a
> confirmation is sent to the visitor's address. It requires a verified sender
> domain in Resend, and a failure to send it never fails the submission (the
> message to you has already been delivered).

## Theming

Override any of these CSS custom properties from your own stylesheet — no need
to edit the component:

```css
.contact-form {
  --cf-color-focus: #2563eb;
  --cf-radius: 0;
}
```

| Variable                 | Default   | Controls                         |
| ------------------------ | --------- | -------------------------------- |
| `--cf-font`              | `inherit` | Font family.                     |
| `--cf-color-text`        | `#1a1a1a` | Main text color.                 |
| `--cf-color-label`       | `#333333` | Labels and counter color.        |
| `--cf-color-border`      | `#cccccc` | Input borders.                   |
| `--cf-color-focus`       | `#2563eb` | Focused input outline/border.    |
| `--cf-color-error`       | `#d33333` | Error text and required markers. |
| `--cf-color-button-bg`   | `#1a1a1a` | Submit button background.        |
| `--cf-color-button-text` | `#ffffff` | Submit button text.              |
| `--cf-spacing`           | `1rem`    | Gap between fields.              |
| `--cf-radius`            | `6px`     | Border radius.                   |
| `--cf-max-width`         | `32rem`   | Form max width.                  |

For deeper changes, every element has a predictable class name
(`.contact-form__input`, `.contact-form__button--submit`,
`.contact-form__error`, …) you can target directly.

## Customization

- **Contact email shown on failure:** edit the `contactEmail` constant in
  `ContactForm.vue` (the address users are told to write to if sending fails).
- **Field limits / email regex:** edit `shared/contact-form.ts` — the change
  applies to both client and server automatically.
- **Rate limit:** change `Ratelimit.slidingWindow(5, "1 h")` in
  `server/api/contact.post.ts`.

## License

MIT
