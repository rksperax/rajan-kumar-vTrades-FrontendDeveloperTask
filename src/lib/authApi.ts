/**
 * Thin client for the auth endpoints. Every screen goes through these calls —
 * the JSON database is only ever touched by the route handlers on the server.
 */

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  message: string;
  data?: T;
}

async function post<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      message: data.message ?? 'Something went wrong. Please try again.',
      data: data as T,
    };
  } catch {
    // Network-level failure: the request never reached the route handler.
    return { ok: false, status: 0, message: 'Something went wrong. Please try again.' };
  }
}

export const signInRequest = (email: string, password: string, rememberMe = false) =>
  post('/api/auth/signin', { email, password, rememberMe });

export const signUpRequest = (email: string, password: string) =>
  post('/api/auth/signup', { email, password });

export const verifyOtpRequest = (email: string, password: string, otp: string) =>
  post('/api/auth/verify-otp', { email, password, otp });

export const signOutRequest = () => post('/api/auth/signout', {});

export const forgotPasswordRequest = (email: string) =>
  post('/api/auth/forgot-password', { email });

export const verifyResetOtpRequest = (email: string, otp: string) =>
  post('/api/auth/forgot-password/verify', { email, otp });

export const createPasswordRequest = (email: string, newPassword: string) =>
  post('/api/auth/password-create', { email, newPassword });
