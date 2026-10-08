import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER = {
  uid: "guest-visionary-uid",
  displayName: "Visionary Guest",
  email: "visionary@vyronix.ai",
  photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Visionary",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<any>(GUEST_USER);
  const [loading] = useState(false);

  const login = async () => {
    return;
  };

  const logout = async () => {
    return;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
