import React, { useContext } from 'react';

export const UserProvider = React.createContext<gg.User>(null!);

export function useUser() { return useContext(UserProvider); }