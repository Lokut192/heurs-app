'use client';

import { useForm } from '@tanstack/react-form';

import { AdminNotificationFormContext } from '../_contexts/admin-notification-form.ctx';

export const AdminNotificationFormProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  /* Form */
  const form = useForm({
    defaultValues: {
      type: '',
    },
  });

  /* Render */
  return (
    <AdminNotificationFormContext.Provider value={null!}>
      {children}
    </AdminNotificationFormContext.Provider>
  );
};
