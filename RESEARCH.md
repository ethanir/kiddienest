> **Historical note (July 2026):** this file predates the rename to **KiddieNest** and is kept for reference. "CareLoop" was the working name; the product shipped as KiddieNest at kiddienestapp.com. Do not treat anything here as current.

# CareLoop Product Research Notes

CareLoop is not trying to copy one specific app or one specific GitHub repository. The goal is to study existing childcare, school, attendance, messaging, and business workflow systems, then build a clean product that fits a real daycare.

## Inspiration categories

### Childcare platforms
Useful for parent communication, child profiles, pickup people, allergies, attendance, incident reports, and daily notes.

Examples to study:
- Brightwheel
- Procare
- Famly
- Kinderloop
- Storypark
- BloomNest
- DayCarePro / CarePro
- NannyBill

### School management systems
Useful for role permissions, student/guardian data models, attendance records, portals, and reporting.

Examples to study:
- Frappe Education
- Gibbon
- openSIS
- ERPNext education modules

### General workflow apps
Useful for UI flows, messaging, notifications, and operations dashboards.

Examples to study:
- CRMs
- field service apps
- appointment apps
- attendance systems
- team inbox products
- form/signature apps

## Product rules

1. Parent screens must be extremely simple.
2. Staff screens must be fast, with large buttons and minimal typing.
3. Admin screens must show what needs attention first.
4. Child data must never be public.
5. Photos/videos must be private and linked to the correct child.
6. Attendance needs a clear visual state: waiting, checked in, checked out, absent.
7. Authorized pickup should eventually include photo, relationship, phone, PIN, and signature.
8. Incident reports need parent signature, staff signature, photo attachments, PDF export, and child profile history.
9. Billing is later, not version 1.
10. Every major feature should eventually have audit logs.

## What we are taking from research

- From childcare apps: daily feed, private photos, parent messaging, check-in/out, incident reports.
- From school systems: student/guardian records, attendance tables, role-based portals.
- From workflow apps: dashboard alerts, task states, forms, search, and filters.
- From business apps: clean onboarding, strong permissions, and printable records.

## What we are not doing

- We are not copying Brightwheel branding.
- We are not copying GPL code into this repo.
- We are not switching to a huge school ERP backend.
- We are not building billing until the core parent/staff workflow is stable.
