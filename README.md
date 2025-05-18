# Clean Tender Genie

## Project info

This repository contains a React + TypeScript application generated with [Lovable](https://lovable.dev/).  It is bootstrapped with [Vite](https://vitejs.dev/) and uses [Tailwind CSS](https://tailwindcss.com/) together with [shadcn-ui](https://ui.shadcn.com/) components.

**URL**: https://lovable.dev/projects/66fb8ab6-99df-4403-9a8c-5c58290178fc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/66fb8ab6-99df-4403-9a8c-5c58290178fc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js (version 20 or newer) and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

# Step 5: Run lint checks and tests (optional).
npm run lint
npm run test
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

Core stack:

- [Vite](https://vitejs.dev/) for building and serving the app
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with [shadcn-ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) with edge functions located in `supabase/functions`

Key runtime packages (see `package.json` for full list):

- `react` `18.3.x`
- `@supabase/supabase-js` `2.49.x`
- `@genkit-ai/ai` `1.9.x`
- `zustand` `5.x`

### Testing

To execute the unit tests and run the linter:

```sh
npm run lint
npm run test
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/66fb8ab6-99df-4403-9a8c-5c58290178fc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Serverless environment variables

The Supabase functions rely on a Google service account JSON key. Provide it via the `GOOGLE_SERVICE_ACCOUNT` environment variable. The Vertex AI review function also respects an optional `VERTEX_LOCATION` variable to override the Google Cloud region (defaults to `us-central1`).
