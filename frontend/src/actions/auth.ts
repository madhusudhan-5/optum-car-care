'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = 'http://127.0.0.1:8000/api';

export async function login(formData: FormData) {
  const username = formData.get('username')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  console.log('--- LOGIN SUBMITTED ---');
  console.log(`Username: "${username}"`);
  console.log(`Password length: ${password.length}`);
  console.log(`Target URL: ${API_URL}/auth/token/`);

  try {
    const res = await fetch(`${API_URL}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log(`Response Status: ${res.status}`);
    console.log(`Response OK: ${res.ok}`);

    if (res.ok) {
      const data = await res.json();
      console.log('Token successfully obtained!');
      const cookieStore = await cookies();
      cookieStore.set('access_token', data.access, {
        httpOnly: true,
        secure: false, // Insecure flag set to false to allow testing on 127.0.0.1, custom local IPs, and HTTP environments without browser rejection
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      cookieStore.set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: false, // Same for refresh token
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return { success: true };
    }
    const errText = await res.text();
    console.log(`Token error response: ${errText}`);
    return { error: 'Invalid credentials' };
  } catch (error) {
    console.error('Connection error occurred in Server Action:', error);
    return { error: 'Failed to connect to the server' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  redirect('/admin-dashboard/login');
}
