This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### .env File Setup

Copy the `/.env.template` file and rename it to `.env`. You will need a Google project configured with an oAuth Client ID and Secret and those values will need to be populated in the `.env` file.

The `NEXT_PUBLIC_APPLICATION_TITLE` setting is used to help set the page titles.

The `IGNORED_CALENDARS` setting applies a server-side exclude on calendars retrieved from the Google Calendar API.

### Running the app locally

_We're using the `--experimental-https` flag to run the local server on `https` to help work with some of the Google oAuth requirements._

First, run the development server:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.


