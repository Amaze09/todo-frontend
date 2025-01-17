This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

We have a env file as well where we need to put the api url of our backend application, so the frontend can make api calls.

## About the App

It's a simple 4 page application for task management in Nextjs. SignUp, Login, Home and Ai suggestion page with user authentication using next-auth. Here user can add tasks, edit tasks, complete them and delete them. Users need to give task tile, description, priority 1 (most urgent) - 10 (least urgent) and a deadline before which they want to complete the task.

On AI suggestion page user can get suggestions on how to prioritize his/her tasks and AI would also create sub tasks for the user.

## Enhancements / Improvements
1.) The first and most important thing that can be improved here is styling and UI/UX.

2.) Since we had a different page for Ai suggestions, we can create a chat section where users can interact with Ai.

3.) There should be some info provided to the user, that we have smart contracts integrated in the backend. On frontend, users have no idea if they are interacting with any smart contract.

4.) For login we can use different providers like github or google. It would be better if we use any web3 provider like [Web3Auth](https://web3auth.io/index.html)
    
