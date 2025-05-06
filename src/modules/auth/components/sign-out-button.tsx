'use client';

import { signOut } from 'next-auth/react';

// export default function SignOutButton() {
//   return (
//     <button
//       type="button"
//       className="btn btn-ghost group flex items-center justify-center"
//       onClick={() => {
//         signOut({ callbackUrl: '/auth/sign-in' });
//       }}
//     >
//       <FontAwesomeIcon
//         icon={faSignOut}
//         className="fa-fw fa-lg group-hover:text-error"
//       />
//     </button>
//   );
// }

const SignOutButton: React.FC<
  React.ComponentPropsWithoutRef<'button'> & {
    callbackUrl?: string | undefined;
  }
> = ({ callbackUrl = '/auth/sign-in', children, ...props }) => (
  <button
    type="button"
    {...props}
    // className="btn btn-ghost group flex items-center justify-center"
    onClick={(ev) => {
      props.onClick?.(ev);
      signOut({ callbackUrl });
    }}
  >
    {children}
  </button>
);

export default SignOutButton;
