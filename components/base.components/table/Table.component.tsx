/* eslint-disable @next/next/no-img-element */
import {
  faArrowDownZA,
  faArrowUpAZ,
  faChevronLeft,
  faChevronRight,
  faEyeLowVision,
  faMagnifyingGlass,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { IconButtonComponent } from '../button';
import {
  InputCheckboxComponent,
  InputComponent,
  SelectComponent,
} from '../input';
import { BoxShadowComponent } from './BoxShadow.component';
import PaginateComponent from './Paginate.component';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './table.module.css';
import { tableProps } from './table.props';
import { useLazySearch } from '../../../helpers';
import FilterColumnComponent from './FilterColumn.component';

export function TableComponent({
  columns,
  data,
  pagination,
  sortBy,
  onChangeSortBy,
  search,
  excludeSearch,
  onChangeSearch,
  searchColumn,
  searchableColumn,
  onChangeSearchColumn,
  filter,
  onChangeFilter,
  loading,
  topBar,
  onRowClick,
  onRefresh,
}: tableProps) {
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [floatingAction, setFloatingAction] = useState(false);
  const [floatingActionActive, setFloatingActionActive] = useState<
    false | number
  >(false);
  const [floatingDisplay, setFloatingDisplay] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [keywordSearch] = useLazySearch(keyword);

  useEffect(() => {
    if (columns) {
      setDisplayColumns([...columns.map((column) => column.selector)]);
    }
  }, [columns]);

  useEffect(() => {
    setKeyword(search || '');
  }, [search]);

  useEffect(() => {
    if (keywordSearch) {
      onChangeSearch?.(keywordSearch);
    } else {
      onChangeSearch?.('');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordSearch]);

  return (
    <>
      {topBar && (
        <div className="p-2 rounded-lg bg-white shadow-sm">{topBar}</div>
      )}

      <div className="flex items-center justify-between my-4">
        {
          // =========================>
          // ## Input Paginate
          // =========================>
        }
        <div className="relative z-20">
          {pagination && (
            <>
              <div className="bg-white p-1.5 rounded-md w-24">
                <SelectComponent
                  name="paginate"
                  options={[
                    {
                      value: 10,
                      label: '10',
                    },
                    {
                      value: 20,
                      label: '20',
                    },
                    {
                      value: 30,
                      label: '30',
                    },
                    {
                      value: 50,
                      label: '50',
                    },
                  ]}
                  size="sm"
                  value={pagination.paginate}
                  onChange={(e) => {
                    pagination.onChange?.(
                      pagination.totalRow,
                      Number(e),
                      pagination.page
                    );
                  }}
                />
              </div>
            </>
          )}
        </div>

        {!excludeSearch && (
          <div className="w-1/2 flex gap-2 justify-end">
            {
              // =========================>
              // ## Display column
              // =========================>
            }
            <div className="bg-white p-1.5 rounded-md relative">
              <IconButtonComponent
                icon={faEyeLowVision}
                customPaint={{
                  bg: 'base',
                  border: 'slate-300 ',
                  color: 'slate-400',
                }}
                onClick={() => {
                  setFloatingDisplay(!floatingDisplay);
                }}
                size="sm"
              />
              <OutsideClickHandler
                onOutsideClick={() => {
                  setFloatingDisplay(false);
                }}
              >
                <div
                  className={`
                absolute -bottom-1 bg-white translate-y-full right-0 p-3 w-[220px] z-20 rounded-lg shadow
                ${!floatingDisplay && 'scale-y-0 top-0 opacity-0'}
              `}
                >
                  <label className="text-sm font-semibold mb-2">
                    Kolom Ditampilkan
                  </label>
                  <InputCheckboxComponent
                    vertical
                    name="show_column"
                    options={columns?.map((column) => {
                      return {
                        label: column.label,
                        value: column.selector,
                      };
                    })}
                    onChange={(e) => {
                      setDisplayColumns(
                        Array()
                          .concat(e)
                          .map((val) => String(val))
                      );
                    }}
                    size="sm"
                    value={displayColumns}
                  />
                </div>
              </OutsideClickHandler>
            </div>

            <div className="bg-white p-1.5 rounded-md flex gap-1.5 w-[350px]">
              {
                // =========================>
                // ## Search column
                // =========================>
              }
              {searchableColumn && searchableColumn?.length > 0 && (
                <div className="w-36">
                  <SelectComponent
                    name="searchableColumn"
                    options={[
                      { label: 'Semua', value: 'all' },
                      ...columns
                        .filter((column) =>
                          searchableColumn.includes(column.selector)
                        )
                        .map((column) => {
                          return {
                            label: column.label,
                            value: column.selector,
                          };
                        }),
                    ]}
                    size="sm"
                    value={searchColumn || 'all'}
                    onChange={(e) => onChangeSearchColumn?.(String(e))}
                  />
                </div>
              )}

              {
                // =========================>
                // ## Input search
                // =========================>
              }
              <div className="w-full">
                <InputComponent
                  name="search"
                  size="sm"
                  placeholder="Cari disini..."
                  rightIcon={faMagnifyingGlass}
                  value={keyword}
                  onChange={(e) => setKeyword(e)}
                />
              </div>
            </div>
            <div className="bg-white p-1.5 rounded-md relative">
              <IconButtonComponent
                icon={faRefresh}
                customPaint={{
                  bg: 'base',
                  border: 'slate-300 ',
                  color: 'slate-400',
                }}
                onClick={() => {
                  onRefresh?.();
                }}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full">
        <BoxShadowComponent
          onScroll={(e) =>
            setFloatingAction(
              e.target.scrollLeft + e.target.offsetWidth <=
                e.target.scrollWidth - 200
            )
          }
        >
          {
            // =========================>
            // ## When Loading
            // =========================>
          }
          {loading ? (
            <>
              <div className="w-max min-w-full">
                {
                  // =========================>
                  // ## Head Column
                  // =========================>
                }
                <div className="flex gap-4 mb-2 px-3 py-2">
                  <div className="w-16 px-4 py-2.5 font-bold skeleton__loading"></div>
                  {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                    return (
                      <div
                        key={key}
                        className={`px-6 py-3 font-bold skeleton__loading`}
                        style={{
                          width: '200px',
                        }}
                      ></div>
                    );
                  })}
                </div>

                {
                  // =========================>
                  // ## Body Column
                  // =========================>
                }
                <div className="flex flex-col gap-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, key) => {
                    return (
                      <div
                        className="flex items-center gap-4 bg-white rounded-lg shadow-sm relative p-2.5"
                        key={key}
                      >
                        <div className="w-16 px-4 py-2.5 font-medium skeleton__loading"></div>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, key) => {
                          return (
                            <div
                              key={key}
                              className="px-4 py-2.5 text-lg font-medium skeleton__loading"
                              style={{
                                width: '200px',
                              }}
                            ></div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {!data || !data.length ? (
                <div className="flex justify-center p-5">
                  {
                    // =========================>
                    // ## When Empty
                    // =========================>
                  }
                  <div className="flex flex-col items-center justify-center gap-8 p-5">
                    <img src="/204.svg" width={'200px'} alt="server error" />
                    <h1 className="text-2xl font-bold">Data Kosong</h1>
                  </div>
                </div>
              ) : (
                <div className="w-max min-w-full">
                  {
                    // =========================>
                    // ## Head Column
                    // =========================>
                  }
                  <div className="flex gap-4 mb-2">
                    <div className="w-8 px-4 py-2.5 font-bold">#</div>
                    {columns &&
                      columns
                        .filter((column) =>
                          displayColumns.includes(column.selector)
                        )
                        .map((column, key) => {
                          return (
                            <div
                              key={key}
                              className={`px-4 py-2.5 font-bold`}
                              style={{
                                width: column.width ? column.width : '200px',
                              }}
                            >
                              <div className="flex justify-between gap-2 items-center">
                                <div
                                  className={`
                              w-full
                              ${column.sortable ? 'cursor-pointer' : ''}
                            `}
                                  onClick={() => {
                                    if (column.sortable && onChangeSortBy) {
                                      onChangeSortBy(
                                        column.selector,
                                        sortBy &&
                                          sortBy?.column != column.selector &&
                                          sortBy?.direction == 'asc'
                                          ? 'desc'
                                          : 'asc'
                                      );
                                    }
                                  }}
                                >
                                  {column.label}
                                </div>

                                <div className="relative flex gap-4">
                                  {sortBy &&
                                    sortBy.column == column.selector && (
                                      <div
                                        className={`${
                                          column.sortable
                                            ? 'cursor-pointer'
                                            : ''
                                        }`}
                                        onClick={() => {
                                          if (
                                            column.sortable &&
                                            onChangeSortBy
                                          ) {
                                            onChangeSortBy(
                                              column.selector,
                                              sortBy &&
                                                sortBy?.column !=
                                                  column.selector &&
                                                sortBy?.direction == 'asc'
                                                ? 'desc'
                                                : 'asc'
                                            );
                                          }
                                        }}
                                      >
                                        {sortBy.direction == 'desc' ? (
                                          <FontAwesomeIcon
                                            icon={faArrowDownZA}
                                            className="text-slate-400"
                                          />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faArrowUpAZ}
                                            className="text-slate-400"
                                          />
                                        )}
                                      </div>
                                    )}

                                  {column.filter && (
                                    <FilterColumnComponent
                                      columnLabel={column.label}
                                      options={column.filter?.options || []}
                                      type={column.filter?.type || 'select'}
                                      onChange={(e) => {
                                        const newFilter: any = filter || {};
                                        newFilter[
                                          column.selector as keyof object
                                        ] = e;
                                        onChangeFilter?.(newFilter);
                                      }}
                                      value={
                                        filter &&
                                        filter[column.selector as keyof object]
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>

                  {
                    // =========================>
                    // ## Body Column
                    // =========================>
                  }
                  <div className={`flex flex-col gap-y-2`}>
                    {data &&
                      data.map((item: object, key) => {
                        return (
                          <div
                            className={`
                              flex items-center gap-4 rounded-lg shadow-sm relative
                              ${key % 2 ? 'bg-cyan-50' : 'bg-white'}
                              ${onRowClick && 'cursor-pointer hover:bg-sky-100'}
                              ${styles.table__row}
                            `}
                            key={key}
                            onClick={() => {
                              onRowClick?.(item, key);
                            }}
                          >
                            <div className="w-8 px-4 py-2.5 font-medium">
                              {pagination && pagination?.page != 1
                                ? pagination?.paginate *
                                    (pagination?.page - 1) +
                                  key +
                                  1
                                : key + 1}
                            </div>
                            {columns &&
                              columns
                                .filter((column) =>
                                  displayColumns.includes(column.selector)
                                )
                                .map((column, key) => {
                                  return (
                                    <div
                                      key={key}
                                      className="px-4 py-2.5 font-medium"
                                      style={{
                                        width: column.width || '200px',
                                      }}
                                    >
                                      {item[column.selector as keyof object] ||
                                        '-'}
                                    </div>
                                  );
                                })}
                            <div
                              className={`flex-1 flex justify-end gap-2 px-4 py-2.5 ${styles.table__action}`}
                            >
                              {item['action' as keyof object]}
                            </div>

                            {item['action' as keyof object] &&
                              floatingAction && (
                                <div
                                  className="sticky hover:-right-2 bg-base -right-5 z-30 cursor-pointer flex items-center shadow rounded-l-lg"
                                  onClick={() =>
                                    floatingActionActive !== false &&
                                    floatingActionActive == key
                                      ? setFloatingActionActive(false)
                                      : setFloatingActionActive(key)
                                  }
                                >
                                  <div className=" pl-4 pr-7 py-2">
                                    <FontAwesomeIcon
                                      icon={
                                        floatingActionActive === false ||
                                        floatingActionActive != key
                                          ? faChevronLeft
                                          : faChevronRight
                                      }
                                      className="text__primary"
                                    />
                                  </div>

                                  <div
                                    className={`py-1 flex gap-2 ${
                                      floatingActionActive !== false &&
                                      floatingActionActive == key
                                        ? 'w-max pl-2 pr-8'
                                        : 'w-0'
                                    }`}
                                  >
                                    {item['action' as keyof object]}
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </BoxShadowComponent>
      </div>

      {pagination && (
        <div className="mt-2">
          <PaginateComponent {...pagination} />
        </div>
      )}
    </>
  );
}
