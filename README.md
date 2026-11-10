# Complaint Reply Helper

A small web app that drafts replies to customer complaints. You choose what went wrong, what you are offering and the tone, fill in the customer details, and it produces a draft you can edit and copy.

I wrote it from the kind of replies I handle daily as a customer service supervisor: a consistent structure (greeting, apology, the issue, the outcome, closing) with the wording adjusted to the situation.

## Run it

Needs Node.js 18 or newer.

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Other commands:

```
npm run build   # production build into dist/
npm test        # unit tests for the reply builder
```

## What it does

- Six complaint types: late delivery, missing item, damaged item, unwanted substitution, poor staff service, billing error.
- Five outcomes: refund, replacement, store credit, investigate and follow up, unable to offer a refund.
- Four tones: warm, formal, short and direct, firm but polite.
- Fields for customer name, order number, item, your name and an extra line. Blank fields are handled (for example "Hi there," and "[Your name]").
- The draft is an editable text box, with a word count and a copy button. Editing by hand is kept until you change an option or press Reset draft.
- Your last inputs are remembered in the browser with localStorage. Nothing is sent anywhere.

## Notes

- The refund timeframe (3 to 5 working days) and follow-up time (2 working days) are placeholders in `src/replies.js`. Change them to match your own policy.
- Always check the draft before sending. It does not know what actually happened on a given order.

## Structure

- `src/replies.js`: scenario, tone and outcome text, and `buildReply`.
- `src/replies.test.js`: tests, including a check that every combination builds cleanly.
- `src/App.jsx`: the React interface.
