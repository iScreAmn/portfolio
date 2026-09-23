"use client";

import { createContext, useContext } from 'react';

/**
 * Вошедший пользователь, добытый один раз в AdminLayout. Через контекст, а не
 * пропсами: между layout и страницей в App Router лежит граница, пропсы туда
 * не проходят, а /admin/analytics нужен и email, и роль, и isDev бэкенда.
 */
const AdminSessionContext = createContext(null);

export const AdminSessionProvider = AdminSessionContext.Provider;

export const useAdminSession = () => useContext(AdminSessionContext);

export default AdminSessionContext;
