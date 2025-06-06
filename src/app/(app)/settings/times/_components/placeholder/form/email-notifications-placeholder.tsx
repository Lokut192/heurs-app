import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type EmailNotificationsFormPlaceholderProps = object;

function EmailNotificationsFormPlaceholder(
  _props: EmailNotificationsFormPlaceholderProps,
): React.ReactNode {
  return (
    <div className="md:col-span-2">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-transparent">
              <div className="w-full animate-pulse bg-gray-200">
                Monthly times statistics report (First day of the month at 9am)
              </div>
            </legend>

            <input
              type="text"
              name="monthly"
              id="monthly"
              className="toggle"
              defaultChecked
              readOnly
            />
          </fieldset>
        </div>
        <div className="col-span-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-transparent">
              <div className="w-full animate-pulse bg-gray-200">
                Weekly times statistics report (First day of the week at 9am)
              </div>
            </legend>

            <input
              type="text"
              name="weekly"
              id="weekly"
              className="toggle"
              defaultChecked
              readOnly
            />
          </fieldset>
        </div>

        <div className="col-span-full flex items-center justify-end gap-2 sm:gap-4">
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

export default EmailNotificationsFormPlaceholder as React.FC<EmailNotificationsFormPlaceholderProps>;
