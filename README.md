# TTC - Tech Teacher's Companion

## About
- TTC is a mobile-first app to manage a tree-like hierarchy of teaching notes
- It reads and parses your MarkDown notes into easy-to-read HTML, and presents them to you in an easily navigable structure
- The server is built on NodeJS with Fastify
- The client is built on Vue with Vue Router and Vuex, using SASS and WebPack
- The app caches your rendered notes with LMDB for speed and responsiveness
- It keeps your place in your notes tree, highlighting the path to your last viewed note
- It shows an auto-generated table of contents on each note
- It adds links to help you move to the next note in the current level/series

## Install

1. Clone the source code
2. Choose an email and password to use for authentication.
3. Get a hash of your password by running `bin/hash-password <your password>`
4. `npm install`
5. Create a `.env` file in the project root. You can copy the example to get started: `cp env-example .env`
6. Fill this file with the necessary key-value pairs. (The app checks and validates this configuration when it runs, and displays helpful output when there are problems.)
    1. `USER_EMAIL` - the email address you chose above.
    2. `USER_PASSWORD` - the password you chose above, hashed.
    3. `SESSION_SECRET` - must be a string of mixed characters; for session security.
7.  See more details for the various configuration options in `env-example` and `src/plugins/config.plugin.js`.
8.  Generate a secret key:
    ```bash
    ./node_modules/.bin/secure-session-gen-key > secret-key
    ```
9. Add your own teaching notes, with a manifest file, inside `data`. To get started, you can copy `data-example`:
    ```bash
    cp -rf data-example data
    ```
10. The manifest file has a specific format. Please use the structure of `data-example/manifest.yaml` as a guide.

## Develop

- `npm run dev`
- See `package.json` for more details

## Deploy

- Deploy to a production server (eg. via `git push`).
- `npm run build` and `npm run start`.
