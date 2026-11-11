# ICE Lab booking system: setup

Two small Google Apps Script projects and one Google Sheet. Free, no server to run.

| Piece | Who runs it | What it does |
|---|---|---|
| **Bookings sheet** (Google Sheet) | owned by the lab account | the database: `Requests`, `Equipment`, `Config` tabs |
| **Intake** (`intake/Code.gs`, bound to the sheet) | runs as the lab account | receives requests from the website, emails the supervisor (Approve / Decline), the student and the lab, serves equipment status to the website |
| **Dashboard** (`dashboard/Code.gs` + `Dashboard.html`, standalone) | runs as the person viewing it | analysis, filters and export for the dean and doctors; editing for admins |

## Who can see what

- **Admins** (you): listed on the `Config` sheet, cell **B2** (comma-separated emails), and shared on the sheet as **Editor**. In the dashboard they can change request status (Confirmed by lab, Completed, No-show, Cancelled…), add lab notes and set equipment to *Under maintenance* / *Out of service*. They can also edit anything directly in the sheet.
- **Viewers** (dean, chair, doctors): share the sheet with their email as **Viewer**. They can open the dashboard, filter by date, lab, machine, course code, supervisor, department and request type, see all the analysis and export CSV. They cannot change anything; Google enforces this, not just the page.
- **Anyone else** sees "You do not have access".

To give or remove access later, use the sheet's **Share** button. Nothing else to change.

## 1. Sheet and intake (once)

1. Create a Google Sheet in the lab account, e.g. **ICE Lab bookings**.
2. **Extensions → Apps Script**. Replace the code with `intake/Code.gs`. On its first line put the lab email. Save.
3. Choose the function **setup** in the toolbar and press **Run** (allow the permissions). It creates the `Requests`, `Equipment` (all 63 items, status Operational) and `Config` tabs, and puts you in Config B2 as admin.
4. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone**. Deploy, copy the URL (ends in `/exec`).
5. Put that URL in the website's `config.js`:
   `window.ICE_CONFIG={"labEmail":"the lab email","endpoint":"the /exec URL"};`
   The website then accepts bookings, and refuses items that the dashboard marks out of service.

## 2. Dashboard (once)

1. Go to **script.google.com → New project**, name it **ICE Lab dashboard**.
2. Paste `dashboard/Code.gs` into `Code.gs`. Put the sheet's id on the first line (the long part of the sheet URL between `/d/` and `/edit`).
3. **File → New → HTML**, name it **Dashboard**, paste `dashboard/Dashboard.html`.
4. **Deploy → New deployment → Web app**: Execute as **User accessing the web app**, Who has access **Anyone with Google account** (or your university domain if it uses Google Workspace). Deploy and copy the URL.
5. Share the sheet as Viewer with the dean and doctors, and send them the dashboard URL. The first time, Google asks each person to allow the dashboard to read the sheet.

## What the dashboard shows

- **Overview**: requests, approval rate, lab hours, borrow days, students, courses, supervisors; requests per week; lab hours by machine; request type mix; busiest weekday and hour; top courses; departments.
- **Machines**: per machine: requests, lab hours, borrow days, **how many courses it serves and which**, students, supervisors, last used, status.
- **Courses**: per course code: requests, hours, students, **which machines it uses**, supervisors.
- **Supervisors**: per doctor: requests supervised, approval %, hours, students, courses, machines, **their own bookings as staff**.
- **Departments**, **Requests** (searchable list), **Equipment** (status).
- Click any machine, course, supervisor or department to filter the whole dashboard to it. Every table exports to CSV; **Export report** writes one CSV with the summary and every breakdown for the current filters.
