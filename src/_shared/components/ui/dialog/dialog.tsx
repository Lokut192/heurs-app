/* eslint-disable no-restricted-imports */

'use client';

import {
  Dialog as Dial,
  DialogBackdrop as DialBackDrop,
  DialogPanel as DialPanel,
} from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export const DialogTitle: React.FC<React.ComponentPropsWithoutRef<'h3'>> = ({
  children,
  ...props
}) => {
  return (
    <h3
      {...props}
      className={twMerge('text-lg/7 font-bold', props.className ?? '')}
    >
      {children}
    </h3>
  );
};

export const Dialog: React.FC<{
  children?: React.ReactNode;
  className?: string;
  open?: boolean | undefined;
  onClose: (value: boolean) => void;
}> = ({ children, open, onClose, ...props }) => {
  return (
    <Dial open={open} onClose={onClose} className="relative z-50">
      <DialBackDrop
        transition
        // className="bg-base-100/75 fixed inset-0 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        className="fixed inset-0 bg-gray-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialPanel
            transition
            className={twMerge(
              'bg-base-100 rounded-box relative min-w-sm transform overflow-hidden px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95',
              props.className ?? '',
            )}
          >
            {children}
          </DialPanel>
        </div>
      </div>
    </Dial>
  );
};
