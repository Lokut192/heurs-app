'use client';

import {
  faBell,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faSpinnerThird,
  faTriangleExclamation,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Bounce, ToastContainer } from 'react-toastify';

function ClientToastContainerProvider(): React.ReactNode {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      transition={Bounce}
      closeOnClick
      closeButton={false}
      hideProgressBar={false}
      pauseOnFocusLoss
      pauseOnHover
      icon={({ type, isLoading }) => {
        if (isLoading) {
          return (
            <FontAwesomeIcon
              icon={faSpinnerThird}
              className="fa-fw fa-lg text-accent animate-spin"
            />
          );
        }
        switch (type) {
          case 'success':
            return (
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="fa-fw fa-lg text-success"
              />
            );
          case 'error':
            return (
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="fa-fw fa-lg text-error"
              />
            );
          case 'warning':
            return (
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="fa-fw fa-lg text-warning"
              />
            );
          case 'info':
            return (
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="fa-fw fa-lg text-info"
              />
            );
          case 'default':
          default:
            return (
              <FontAwesomeIcon
                icon={faBell}
                className="fa-fw fa-lg text-secondary"
              />
            );
        }
      }}
      draggable
    />
  );
}

export default ClientToastContainerProvider as React.FC;
