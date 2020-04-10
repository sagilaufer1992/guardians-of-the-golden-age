import React from 'react';

const UserProvider = React.createContext<gg.User | null>(null);

export default UserProvider;