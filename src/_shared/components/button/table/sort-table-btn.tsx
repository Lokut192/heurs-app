import type { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import {
  faArrowDownArrowUp,
  faArrowDownWideShort,
  faArrowUpWideShort,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

export type SortTableButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  order: 'asc' | 'desc' | null;
  orderby: string | null;
  propName: string;
  icons?:
    | {
        asc?: IconDefinition | undefined;
        desc?: IconDefinition | undefined;
        default?: IconDefinition | undefined;
      }
    | undefined;
  onChangeOrder?: (value: {
    order: 'asc' | 'desc' | null;
    orderby: string | null;
  }) => void | undefined;
};

export const SortTableButton: React.FC<SortTableButtonProps> = ({
  order,
  orderby,
  propName,
  onChangeOrder,
  icons: {
    asc: ascIcon = faArrowUpWideShort,
    desc: descIcon = faArrowDownWideShort,
    default: defaultIcon = faArrowDownArrowUp,
  } = {
    asc: faArrowUpWideShort,
    desc: faArrowDownWideShort,
    default: faArrowDownArrowUp,
  },
  ...props
}) => {
  // Define icon
  const icon = useMemo(() => {
    if (orderby === propName) {
      if (order === 'asc') {
        return ascIcon;
      }

      return descIcon;
    }

    return defaultIcon;
  }, [order, orderby, ascIcon, descIcon, defaultIcon]);
  // Define next order
  const nextOrder = useMemo(() => {
    switch (true) {
      case order === 'asc' && orderby === propName:
        return 'desc';

      case order === 'desc' && orderby === propName:
        return null;

      default:
        return 'asc';
    }
  }, [order, orderby]);
  // Define next orderby
  const nextOrderby = useMemo(() => {
    switch (true) {
      case order === 'desc' && orderby === propName:
        return null;

      case order === 'asc' && orderby === propName:
      default:
        return propName;
    }
  }, [order, orderby]);
  // Define dataset to help on button styling
  const btnDataset = useMemo(() => {
    const dataset: Record<string, any> = {};
    if (orderby === propName) {
      dataset['data-selected'] = true;
      if (order === 'asc') {
        dataset['data-order'] = 'asc';
      } else if (order === 'desc') {
        dataset['data-order'] = 'desc';
      }
    }
    return dataset;
  }, [order, orderby]);

  /* Render */
  return (
    <button
      type="button"
      {...props}
      {...btnDataset}
      className={twMerge(
        'data-[selected]:text-accent text-base-content cursor-pointer px-2 focus-visible:outline-none',
        // 'data-[order=asc]:bg-red-500 data-[order=desc]:bg-blue-500',
        props.className ?? '',
      )}
      onClick={(ev) => {
        props?.onClick?.(ev);
        onChangeOrder?.({
          order: nextOrder,
          orderby: nextOrderby,
        });
      }}
    >
      <FontAwesomeIcon icon={icon} className="fa-fw fa-sm" />
    </button>
  );
};
