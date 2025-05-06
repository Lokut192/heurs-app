import { useContext } from 'react';

import { LoggedUserContext } from '../contexts/logged-user.ctx';

const useLoggedUser = () => {
  // Get context
  const context = useContext(LoggedUserContext);

  // Check context
  if (!context) {
    throw new Error('useLoggedUser must be used within a LoggedUserProvider');
  }

  // Return user
  return context;
};

export { useLoggedUser };
