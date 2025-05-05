import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { faFileCsv, faFilePdf } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { Metadata } from 'next';

// #region Types

type TimesExportsIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: TimesExportsIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Exports',
  };
};

// #endregion Metadata

export default async function TimesExportsIndex(
  _props: TimesExportsIndexProps,
): Promise<React.ReactNode> {
  /* Render */
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Times exports</h1>

      <p className="mt-5 text-base/6 font-semibold">
        Export your times in{' '}
        <FontAwesomeIcon className="fa-fw fa-lg" icon={faFilePdf} /> or{' '}
        <FontAwesomeIcon className="fa-fw fa-lg" icon={faFileCsv} />.
      </p>

      <TabGroup className="mt-10">
        <TabList as="div" className="tabs tabs-border">
          <Tab className="tab focus-visible:outline-none">By week</Tab>
          <Tab className="tab focus-visible:outline-none">By month</Tab>
        </TabList>

        <TabPanels className="p-3 pt-5">
          <TabPanel className="">
            <div role="alert" className="alert alert-info text-white">
              <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
              <span>Export times by week is coming soon...</span>
            </div>
          </TabPanel>
          <TabPanel className="">
            <div role="alert" className="alert alert-info text-white">
              <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
              <span>Export times by month is coming soon...</span>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
