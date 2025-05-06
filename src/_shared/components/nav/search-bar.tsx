import { faSidebar, faSignOut } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SignOutButton from '@/modules/auth/components/sign-out-button';

export default function SearchBar(): React.ReactNode {
  return (
    <div className="border-base-300 bg-base-100 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-2 sm:gap-x-6 sm:px-4">
      {/* Search bar content */}
      <button
        type="button"
        className="btn btn-ghost flex cursor-pointer items-center justify-center"
      >
        <FontAwesomeIcon icon={faSidebar} className="fa-fw fa-lg" />
      </button>

      <SignOutButton className="btn btn-ghost group flex items-center justify-center">
        <FontAwesomeIcon
          icon={faSignOut}
          className="fa-fw fa-lg group-hover:text-error"
        />
      </SignOutButton>
    </div>
  );
}
