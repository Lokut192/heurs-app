import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type PersonalInformationsFormPlaceholderProps = object;

function PersonalInformationsFormPlaceholder(
  _props: PersonalInformationsFormPlaceholderProps,
): React.ReactNode {
  return (
    <div className="md:col-span-2">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend w-1/3 text-transparent">
              <div className="w-full animate-pulse bg-gray-200">Username</div>
            </legend>

            <label
              htmlFor="username"
              className="input w-full animate-pulse border-none bg-gray-200"
            >
              <input
                type="text"
                name="username"
                id="username"
                className="w-full"
                readOnly
              />
            </label>
          </fieldset>
        </div>

        <div className="sm:col-span-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend w-1/3 text-transparent">
              <div className="w-full animate-pulse bg-gray-200">Email</div>
            </legend>

            <label
              htmlFor="email"
              className="input w-full animate-pulse border-none bg-gray-200"
            >
              <input
                type="email"
                name="email"
                id="email"
                className="w-full"
                readOnly
              />
            </label>
          </fieldset>
        </div>

        <div className="col-span-full flex items-center justify-end gap-2 sm:gap-4">
          <button
            type="button"
            disabled
            className="btn animate-pulse bg-gray-200 text-transparent"
          >
            Change password
          </button>
          <button
            type="submit"
            disabled
            className="btn animate-pulse bg-gray-300 text-transparent"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="fa-fw fa-md" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInformationsFormPlaceholder as React.FC<PersonalInformationsFormPlaceholderProps>;
