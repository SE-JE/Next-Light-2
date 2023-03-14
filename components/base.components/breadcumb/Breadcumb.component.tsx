import React from 'react';

import Link from 'next/link';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { breadcumbItemProps } from './breadcumb.props';

export function BreadcumbComponent({ items }: { items: breadcumbItemProps[] }) {
  return (
    <nav className="w-full overflow-auto rounded bg-grey-light whitespace-nowrap">
      <ol className="flex list-reset text-grey-dark">
        {items.map((item, key) => {
          let active = key + 1 == items.length;

          return (
            <>
              <li>
                <Link
                  href={item.link}
                  className={`font-medium capitalize ${
                    active ? 'text-primary' : ''
                  } `}
                >
                  {item.label}
                </Link>
              </li>
              {!active && (
                <li>
                  <span className="mx-3">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </span>
                </li>
              )}
            </>
          );
        })}
      </ol>
    </nav>
  );
}
