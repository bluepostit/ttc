# TTC - Tech Teacher's Companion

## Install

1. Clone the source code
1. `git submodule set-url data <URL of data repository>`
1. `git submodule update --init --recursive`
1. `npm install`
1. Add a `.env` file in the project root with the necessary key-value pairs. (You can see the list of required pairs by trying to run the app; it will perform configuration validation.)
    1. `USER_EMAIL` - used to authenticate your access.
    2. `USER_PASSWORD` - as above.
    3. `SESSION_SECRET` - a string of mixed characters for session security.
    4. `MODULE_MANIFEST_PATH` - path to the manifest/'index' file for the content data.
    5. `MODULE_DATA_PATH` - root directory of the content data tree.
1. See more details for config options in `src/plugins/config.plugin.js`

## Develop

- `npm run dev`
- See `package.json` for more details

## Deploy

- Deploy to a production server (eg. via `git push`).
- `npm run build` and `npm run start`.
