# Choretell

tl;dr: It's Google Tasks, but hosted locally for multiple users

Choretell was made for three reasons:

- I want to schedule each chore on an arbitrary cadence, like you can with Google Tasks.
- You can't share Google Tasks lists with other people, but I share chores with my wife.
- Honestly, I just wanted to dip my toes into backend development. I'm aware other apps already exist out there that solve this problem and likely do it better.
  - OK on that note, bonus reason, it's nice to keep this data local to my network.

## Tech Stack

- Frontend: Vite + [SoLit](https://github.com/duncsully/solit) - For now, a Vite SPA suffices. I'm toying around with my own rendering library, SoLit.
- Components: [Ionic](https://ionicframework.com/docs/components) - I didn't want to spend time creating my own component library yet, and web components work well with SoLit.
- Backend: [PocketBase](https://pocketbase.io/) - A simple BaaS I can host locally and extend easily, allowing me to dip my toes.

## Running locally

While Choretell was intended to meet my own needs, I've attempted designing it to be portable so conceivably you could run your own instance. Docker is not yet supported, but may be in the future.

Requirements:

- Node.js
- PocketBase executable for your OS and architecture if not windows/arm64 or linux/arm64

On your host machine:

1. Clone the repo
2. `cd` into the repo and run `npm install`
3. Set the environment variable `VITE_POCKETBASE_URL` (you can also do this in a .env file) to the host address you'll be accessing the app from (e.g. http://raspberrypi.local)
4. Run `npm run build` to bundle the frontend with Vite
5. If using your own PocketBase executable, place it in the `server` directory
6. `cd server` and run `./yourPocketBaseExecutable serve` e.g. `./pocketbase serve` to start the PocketBase server. Refer to the [PocketBase documentation](https://pocketbase.io/docs/) for more information. Note that you'll need to specify the host address if you want to access Choretell from other devices.
