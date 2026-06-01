# KiddieNest — Domain & Deployment Notes

## Domain
- Production domain: kiddienestapp.com  (registrar: GoDaddy)
- Note: bare kiddienest.com was taken, so we use kiddienestapp.com.

## Current DNS (GoDaddy)
- A      @                -> GoDaddy "WebsiteBuilder Site" (placeholder; repoint to Vercel at deploy)
- CNAME  www              -> kiddienestapp.com
- CNAME  email            -> mailgun.org                 (email)
- CNAME  pay              -> paylinks.commerce.godaddy.com (GoDaddy commerce, unused)
- CNAME  _domainconnect   -> _domainconnect.gd.domaincontrol.com
- NS     @                -> ns69.domaincontrol.com, ns70.domaincontrol.com
- SOA    @                -> ns69.domaincontrol.com
- MX     @                -> mxa.mailgun.org, mxb.mailgun.org (priority 60)  (email)
- TXT    @                -> v=spf1 include:mailgun.org ~all                 (SPF)
- TXT    smtp._domainkey  -> k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsm79qBMFVtUK1dRldPfY8c2wKB0kKNTHZVK3E4VXFy9FYbFFeHRKEPL9NJgG3Hg/6D2hxx0tLTtGZ/xPtrIFX11nxfRzzhKsCGCHTZbKMb8Txa1BrKRgidqFhzs82UEmGp4APNuOuXwdzMyq+Qtdc0BgYne1K/VXsBrjXd2dojQIDAQAB  (DKIM)
- TXT    _dmarc           -> v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;  (DMARC)

Email is already configured via Mailgun (MX + SPF + DKIM + DMARC), so we can send
transactional email from @kiddienestapp.com (parent invites, confirmations, notifications).

## When we deploy (planned)
1. Host: Vercel (Next.js).
2. Import the repo into Vercel; set the same env vars from .env.local (Supabase URL +
   anon key, and the service-role key as a server-only secret).
3. Point the domain at Vercel: add kiddienestapp.com (and www) in Vercel, then update
   GoDaddy DNS to the exact values Vercel shows — change the A @ record off "WebsiteBuilder"
   to Vercel's target and point www to Vercel. Leave the Mailgun MX/TXT records untouched.
4. Supabase auth emails: point Supabase SMTP at Mailgun so confirmation/invite/reset
   emails come from @kiddienestapp.com.
5. Add https://kiddienestapp.com to Supabase Auth URL configuration (Site URL + redirects).
6. PWA / "Add to Home Screen" so it installs like an app before any app store.

## Before public launch
- Turn email confirmation back ON (off for testing).
- Decide: open sign-up (anyone can make a parent account but sees nothing until invited)
  vs fully invite-only.
- Verify the name once more: domain (owned), USPTO trademark, App Store + Play.
