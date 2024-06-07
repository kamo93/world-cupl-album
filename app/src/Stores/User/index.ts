import create from "zustand";

export interface User {
  email: string;
  avatar: string;
}

export interface UserState {
  user: User | "idle" | null;
  addUser: (user: User) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: "idle",
  addUser: (user: User) => set(() => ({ user })),
}));
