# TTC - Tech Teacher's Companion

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
