# Email my card to me: Power Automate setup

The card page sends the participant's email address and the card image to a
Power Automate flow. The flow emails the card from your IMD mailbox, writes the
address to an Excel table in your OneDrive, and tells the page it worked.

Email addresses never go to Firestore (the cards collection there is publicly
readable). They live only in your Excel file.

Time needed: about 30 minutes.

## 1. Make the Excel file

1. In OneDrive (IMD account), create a workbook called `LTAIS card emails.xlsx`.
2. In row 1, type these headers: `Timestamp`, `Email`, `Name`, `Statement`, `QuoteOK`, `ContactOK`, `CardId`.
3. Select A1:G1, then Insert > Table, tick "My table has headers".
4. Table Design > Table Name: `Emails`.

## 2. Build the flow

Go to make.powerautomate.com > Create > Instant cloud flow > Skip.

### Trigger: When an HTTP request is received

- Who can trigger the flow: **Anyone**
- Method (under advanced parameters): **POST**
- Request Body JSON Schema, paste:

```json
{
  "type": "object",
  "properties": {
    "email":     { "type": "string" },
    "name":      { "type": "string" },
    "statement": { "type": "string" },
    "quoteOk":   { "type": "boolean" },
    "contactOk": { "type": "boolean" },
    "cardId":    { "type": "string" },
    "image":     { "type": "string" }
  },
  "required": ["email", "image"]
}
```

### Step 2: Condition (blocks misuse)

Add a Condition with **And** and these two rows. Each left side is an
expression (click the fx button):

| Left (expression) | Operator | Right |
|---|---|---|
| `length(triggerBody()?['image'])` | is less than | `4000000` |
| `length(triggerBody()?['statement'])` | is less than | `400` |

Enter the numbers on the right as expressions too (type `/`, Insert expression,
type the number, Add). Typed straight into the box, they are saved as text and
the Condition fails.

Put steps 3 to 5 inside **True**, with the **Response** (step 5) at the top of
the True branch so the page gets its answer at once. Leave **False** empty.

### Step 3: Send an email (V2), Office 365 Outlook

- **To:** dynamic content `email`
- **Subject:** `Your leadership card`
- **Body:** in the normal view (not `</>`), type `Hi `, then insert this
  expression (type `/`, choose Insert expression):

  ```
  if(empty(triggerBody()?['name']), 'there', replace(replace(triggerBody()?['name'], '<', '&lt;'), '>', '&gt;'))
  ```

  then type `,`, press Enter, and type `Your card is attached.`
  The `replace(...)` parts stop anyone from slipping HTML or links into an
  email sent from your address.

- **Attachments** (under advanced parameters):
  - Name: `my-leadership-card.png`
  - Content (expression): `base64ToBinary(triggerBody()?['image'])`

To send from a shared mailbox (for example `ai-sprint@imd.org`) instead of your
own, use **Send an email from a shared mailbox (V2)** with the same fields.
You need "Send as" rights on that mailbox.

### Step 4: Add a row into a table, Excel Online (Business)

- Location: OneDrive for Business
- Document Library: OneDrive
- File: `LTAIS card emails.xlsx`
- Table: `Emails`
- Timestamp (expression): `utcNow()`
- Email, Name, Statement, CardId: the matching dynamic content
- QuoteOK (expression): `if(equals(triggerBody()?['quoteOk'], true), 'yes', 'no')`
- ContactOK (expression): `if(equals(triggerBody()?['contactOk'], true), 'yes', 'no')`

### Step 5: Response

- Status Code: `200`
- Headers: `Access-Control-Allow-Origin` = `*`
- Body: `{"ok": true}`

### Retries (for large groups)

One mailbox can send about 30 emails a minute, and Excel takes about 100 new
rows a minute. On the **Send an email** and **Add a row into a table** steps,
open **Settings** > **Retry policy**: Exponential interval, Count `10`,
Interval `PT1M`. Emails that hit the limit then wait and go out later.

## 3. Save and copy the URL

Save the flow. Open the trigger again; it now shows **HTTP URL**. Copy it and
send it to Claude (or paste it into `EMAIL_FLOW_URL` in `index.html`). The
"Email my card to me" item appears in the menu as soon as that line is set.

## Good habits

- **Opt-outs:** when someone replies "remove", delete their row in the Excel
  file. Only email people with `ContactOK = yes` about programs, and give every
  such email an unsubscribe line.
- **Quoting cards:** quote only cards whose row says `QuoteOK = yes`, and leave
  the name off. Match a row to its card in the facilitator view through `CardId`.
- **Between cohorts:** turn the flow off (My flows > ... > Turn off). The menu
  item stays visible but sending fails politely and points people to Download.
- **If the URL ever leaks into misuse:** delete the trigger and add it again.
  That creates a new URL; update `EMAIL_FLOW_URL` with it.
