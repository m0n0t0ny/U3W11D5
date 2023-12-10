export interface Auth {
  accessToken: string;
  user: {
    email: string;
    password: string;
    name: string;
    id: number;
  };
}
