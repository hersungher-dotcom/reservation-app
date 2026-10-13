export type User = {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at?: string;
};

export type Session = {
  access_token: string;
  expires_at: number;
  refresh_token: string;
  token_type: string;
  user: User;
};