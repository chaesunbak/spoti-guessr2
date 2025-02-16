export interface User {
  uid: string;
  email: string;
  nickname: string;
  createdAt: number;
  permission: "ADMIN" | "read-only";
}
