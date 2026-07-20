# Intto Automated Certification

Web app for running events and handing out certificates without doing it all by hand. An admin sets up an event, builds a certificate template, and the app takes care of generating QR codes, collecting attendee responses, and issuing certificates once someone shows up and checks in.

Built with Vue 3, Firebase, and Konva for the certificate canvas.

## What it does

- Admin logs in and creates an event through a step by step wizard (event details, certificate template, canvas preview, survey/response setup)
- Certificate templates are designed on a canvas using Konva, so text and placeholders can be dragged and placed visually
- Each event gets a QR code for check in
- Participants and their survey responses are tracked per event
- Dashboard shows active events, all events, and participant lists

## Tech stack

- Vue 3 + Vite
- Vue Router
- Pinia for state
- Firebase (auth, Firestore, hosting)
- Konva / vue-konva for the certificate canvas editor
- Tailwind CSS

## Getting started

You'll need Node `^20.19.0` or `>=22.12.0`.

```sh
npm install
```

Copy your Firebase project config into `src/service/firebase-config.js` (or set it up through environment variables, depending on how your instance is configured). Without this the app won't be able to talk to Firestore or auth.

### Run it locally

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

### Preview a production build

```sh
npm run preview
```

## Project layout

```
src/
  components/
    admin/          admin dashboard, event calendar, event creation steps
      steps/        the 4 step event/certificate builder (details, template, canvas preview, responses)
    user/           attendee facing views
  service/          firebase config, auth, firestore helpers
  stores/           pinia stores
  router.js         app routes
```

## Firebase

`firestore.rules` and `firestore.indexes.json` are in the repo root, `firebase.json` handles hosting/deploy config. Deploy rules and indexes with the Firebase CLI when they change:

```sh
firebase deploy --only firestore:rules,firestore:indexes
```

## Known issues

Step 4 of the event builder (the survey/response step) currently throws on load, missing imports need to get sorted out. See open issues for details.
