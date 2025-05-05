import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Metadata } from 'next';

// #region Types

type TimesStatisticsIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: TimesStatisticsIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Statistics',
  };
};

// #endregion Metadata

export default async function TimesStatisticsIndex(
  _props: TimesStatisticsIndexProps,
): Promise<React.ReactNode> {
  /* Render */
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Times statistics</h1>

      <div role="alert" className="alert alert-info mt-10 text-white">
        <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
        <span>Coming soon...</span>
      </div>
    </>
  );
}
