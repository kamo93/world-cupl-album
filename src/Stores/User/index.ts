import create from "zustand";

export interface User {
  email: string;
  avatar: string;
}

export interface UserState {
  user?: User;
  addUser: (user: User) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: undefined,
  addUser: (user: User) => set(() => ({ user }))
}))
