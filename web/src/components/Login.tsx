"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Login() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  let loggedIn = user && (
    <div>
      <a href="/api/auth/logout">Logout</a>
    <br />
    <img src={user.picture ?? undefined} alt={user.name ?? undefined} />
  <h2>{user.name}</h2>
  <p>{user.email}</p>
  </div>
);
  return <div>
    {!user && <a href="/api/auth/login">Login</a>}
  {loggedIn}
  </div>;
}