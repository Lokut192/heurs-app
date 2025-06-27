'use client';

import type { IconDefinition } from '@fortawesome/pro-light-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type PasswordInputProps = React.ComponentPropsWithoutRef<'input'>;

function PasswordInput({ ...props }: PasswordInputProps) {
  /* States */
  const [inputType, setInputType] = useState<'password' | 'text'>('password');
  const [icon, setIcon] = useState<IconDefinition>(faEye);

  /* Refs */
  const inputRef = useRef<HTMLInputElement>(null);

  /* Callbacks */
  const handleToggleInputVisibility: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      if (inputType === 'password') {
        setInputType('text');
        setIcon(faEyeSlash);
      } else {
        setInputType('password');
        setIcon(faEye);
      }

      // Focus to last character in test input field
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    }, [inputType]);

  /* Render */
  return (
    <div className="relative w-full">
      <input
        {...props}
        type={inputType}
        ref={inputRef}
        className={twMerge('pr-10', props.className)}
      />

      <button
        type="button"
        className="absolute top-1/2 right-0 size-8 -translate-y-1/2 cursor-pointer"
        onClick={handleToggleInputVisibility}
      >
        <FontAwesomeIcon icon={icon} className="fa-sw" />
      </button>
    </div>
  );
}

export default PasswordInput as React.FC<PasswordInputProps>;
