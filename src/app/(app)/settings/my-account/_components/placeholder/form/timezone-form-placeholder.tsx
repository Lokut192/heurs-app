import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type TimezoneFormPlaceholderProps = object;

function TimezoneFormPlaceholder(
  _props: TimezoneFormPlaceholderProps,
): React.ReactNode {
  return (
    <div className="md:col-span-2">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend w-1/3 text-transparent">
              <div className="w-full animate-pulse bg-gray-200">Timezone</div>
            </legend>

            <label
              htmlFor="timezoneName"
              className="select w-full animate-pulse border-none bg-gray-200"
            >
              <select
                name="timezoneName"
                id="timezoneName"
                className="w-full"
              />
            </label>
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

export default TimezoneFormPlaceholder as React.FC<TimezoneFormPlaceholderProps>;
