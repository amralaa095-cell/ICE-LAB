# Booking backend (Google Sheet + email)

The website sends each booking request to a small Google Apps Script. The script:

- writes the request into a Google Sheet (this sheet is the lab's admin view);
- emails the lab, the student (receipt) and the supervisor (with **Approve** / **Decline** buttons);
- emails the student the supervisor's decision and updates the Status column.

## Setup (about 5 minutes, done once by the lab)

1. Create a new Google Sheet, for example "ICE Lab requests", in the lab's Google account.
2. In the sheet: **Extensions → Apps Script**. Delete what is there and paste the whole of `booking-apps-script.gs`.
3. On the first line, replace `PUT-THE-LAB-EMAIL-HERE` with the lab email. Save.
4. **Deploy → New deployment → Select type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then allow the permissions it asks for (send email, edit this sheet).
5. Copy the **Web app URL** (it ends in `/exec`).
6. Put it in `config.js` on the site: `window.ICE_CONFIG={"labEmail":"lab email","endpoint":"the /exec URL"};`

Without an endpoint the site still works: it opens the student's email app with the request addressed to the lab.
