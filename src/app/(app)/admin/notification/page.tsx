import { faCode, faPaperPlaneTop } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Metadata } from 'next';
import type { User } from 'next-auth';

import type { PageAccessConfig } from '@/modules/auth/types/page-access-config.type';

import { MessageTypeSelect } from './_components/select/message-type-select';
import { UsersSelect } from './_components/select/users-select';
import { AdminNotificationFormProvider } from './_providers/admin-notification-form.prov';

// #region Access

export const pageAccess: PageAccessConfig = {
  grants: ['p_Role.SUPER_ADMIN', 'p_Role.ADMIN'],
  mode: 'any',
};

// #endregion Access

// #region Types

type AdminNotificationIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: AdminNotificationIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Notification',
  };
};

// #endregion Metadata

export default async function AdminNotificationIndex(
  _props: User,
): Promise<React.ReactNode> {
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Notification</h1>

      <p className="text-base-content/50 mt-3 text-base/6 font-medium">
        Send notification to your users
      </p>

      <div className="alert mt-3 border-purple-300 bg-purple-300 text-purple-800">
        <FontAwesomeIcon icon={faCode} className="" size="xl" />
        <div>
          <h3 className="font-bold">Feature in progress</h3>
          <p>This feature is not yet finished to be developed</p>
        </div>
      </div>

      <AdminNotificationFormProvider>
        <div className="mt-5">
          {/* Message type */}
          {/* <fieldset className="fieldset">
          <legend className="fieldset-legend">Message Type</legend>
          <label htmlFor="messageType" className="select select-neutral w-full">
            <MessageTypeSelect name="messageType" className="" required />
          </label>
        </fieldset> */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Message Type</legend>
            <MessageTypeSelect name="messageType" className="" required />
          </fieldset>

          {/* Users */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Select Recipient(s)</legend>

            <UsersSelect className="" />
          </fieldset>

          {/* Title */}
          {/* <fieldset className="fieldset">
          <legend className="fieldset-legend">Title</legend>
          <label htmlFor="messageType" className="input input-neutral w-full">
            <input
              type="text"
              name="title"
              id="title"
              className="placeholder:italic"
              placeholder="Title here"
              required
            />
          </label>
        </fieldset> */}

          {/* Content */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Message</legend>
            <label
              htmlFor="message"
              className="textarea textarea-neutral w-full"
            >
              <textarea
                name="message"
                id="message"
                className="size-full placeholder:italic"
                placeholder="Message here"
                required
              />
            </label>
          </fieldset>

          <div className="mt-5 flex w-full flex-col justify-between gap-2 sm:flex-row sm:justify-end sm:gap-4">
            <button
              type="submit"
              className="btn btn-primary flex w-full items-center justify-between gap-x-2 sm:mr-0 sm:w-fit"
            >
              <FontAwesomeIcon icon={faPaperPlaneTop} className="" size="sm" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </AdminNotificationFormProvider>
    </>
  );
}
