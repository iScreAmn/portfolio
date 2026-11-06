"use client";

import { createContext, useContext } from 'react';

const AdminSessionContext = createContext(null);

export const AdminSessionProvider = AdminSessionContext.Provider;

export const useAdminSession = () => useContext(AdminSessionContext);

export default AdminSessionContext;
