export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const signupUser = async (data: SignupData): Promise<SignupResponse> => {
  const response = await fetch('http://localhost:3000/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during signup',
    }));
    throw new Error(error.message || 'Signup failed');
  }

  return response.json();
};
