import { cookies } from 'next/headers';

async function getUserData() {
  // 1. Await the cookies() function first
  const cookieStore = await cookies(); 
  
  // 2. Access the value synchronously from the store
  const accessToken = cookieStore.get('access_token')?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function SettingsPage() {
  const user = await getUserData();

  if (!user) {
    return <div>Please log in</div>;
  }

  return <div>Settings for {user.email}</div>;
}