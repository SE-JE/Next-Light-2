/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sidebarProps } from './sidebar.props';

export function SidebarComponent({
  items,
  basePath,
  minimize,
  children,
  onChange,
  hasAccess,
}: sidebarProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState<number[]>([]);
  const [showChild, setShowChild] = useState<string[]>([]);

  useEffect(() => {
    const activePath = router.asPath?.split('?')?.at(0);

    items?.map((menu_head, menu_head_key) => {
      {
        menu_head.items?.map((menu, menu_key) => {
          if (
            menu.items?.find(
              (val) =>
                (basePath || '') + (val.path ? '/' + val.path : '') ==
                activePath
            )
          ) {
            if (!showChild?.find((sc) => sc == menu_head_key + '|' + menu_key))
              setShowChild([...showChild, menu_head_key + '|' + menu_key]);
            if (!showMenu?.find((sm) => sm == menu_key))
              setShowMenu([...showMenu, menu_key]);
          }

          if (
            !menu.items?.length &&
            (basePath || '') + (menu.path ? '/' + menu.path : '') == activePath
          ) {
            if (!showMenu?.find((sm) => sm == menu_head_key))
              setShowMenu([...showMenu, menu_head_key]);
          }

          // if (menu.items && menu.items.length) {
          //   menu.items?.map((child) => {
          //     if (
          //       (basePath || '') + child.path &&
          //       router.asPath == (basePath || '') + child.path
          //     ) {
          //       onChange?.([menu_head, menu, child]);
          //     }
          //   });
          // } else {
          //   if (
          //     (basePath || '') + menu.path &&
          //     router.asPath == (basePath || '') + menu.path
          //   ) {
          //     onChange?.([menu_head, menu]);
          //   }
          // }
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, items, basePath, onChange]);

  return (
    <>
      <div className="grid h-[calc(100vh-80px)] grid-cols-7 lg:grid-cols-10 gap-6">
        <div
          className={`
            ${
              minimize
                ? 'fixed container mx-auto left-0 px-4 z-50 md:scale-x-0 md:-translate-x-full'
                : 'scale-100 lg:col-span-2 hidden md:block'
            }
          `}
        >
          <div className="flex flex-col h-full w-full bg-white rounded-b-xl overflow-hidden shadow">
            <div className="h-full py-3 px-3 overflow-y-auto max-h-[calc(100vh-70px)] scroll_control shadow__scrolly select-none intro__fade__down">
              {items?.map((menu_head, menu_head_key) => {
                let countAvailableMenu = 0;

                menu_head?.items?.map(
                  (item) =>
                    (!item?.key ||
                      hasAccess?.find((access) => access == item?.key)) &&
                    countAvailableMenu++
                );

                if (countAvailableMenu) {
                  return (
                    <React.Fragment key={menu_head_key}>
                      <div
                        className="px-3 pt-4 pb-2 flex justify-between items-center cursor-pointer"
                        onClick={() => {
                          if (menu_head.collapse) {
                            if (!showMenu?.find((sm) => sm == menu_head_key)) {
                              setShowMenu([...showMenu, menu_head_key]);
                            } else {
                              setShowMenu(
                                showMenu.filter((val) => val != menu_head_key)
                              );
                            }
                          }
                        }}
                      >
                        <h6 className="text-sm text-slate-500 font-semibold dark:text-slate-300 block md:hidden lg:block">
                          {menu_head.label}
                        </h6>
                        <div className="h-1 hidden md:block lg:hidden"></div>
                        {menu_head.collapse && (
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`
                            text-slate-500 dark:text-slate-300 block md:hidden lg:block
                            ${
                              showMenu?.find((sm) => sm == menu_head_key) &&
                              'rotate-180'
                            }
                          `}
                          />
                        )}
                      </div>

                      <div
                        className={`
                        intro__y
                        ${
                          !menu_head.collapse ||
                          showMenu.find((sm) => sm == menu_head_key) ||
                          'hidden md:block lg:hidden'
                        }
                      `}
                      >
                        {menu_head?.items?.map((menu, menu_key) => {
                          const menuPath =
                            (basePath || '') +
                            (menu.path ? '/' + menu.path : '');
                          const menuActive =
                            !menu.items?.length &&
                            router.asPath?.split('?')?.at(0) == menuPath;

                          let countAvailableChild = 0;

                          menu?.items?.map(
                            (item) =>
                              (!item?.key ||
                                hasAccess?.find(
                                  (access) => access == item?.key
                                )) &&
                              countAvailableChild++
                          );

                          if (
                            menu?.items?.length
                              ? countAvailableChild
                              : !menu?.key ||
                                hasAccess?.find((access) => access == menu?.key)
                          ) {
                            return (
                              <React.Fragment key={menu_key}>
                                <a
                                  className={`
                                  flex items-center duration-150 justify-between gap-4 py-3 my-1 cursor-pointer rounded-lg mx-3 px-4 overflow-hidden
                                  ${
                                    menuActive
                                      ? 'text-white bg-primary'
                                      : 'text-slate-400 dark:text-slate-200 hover:text-primary hover:bg-background'
                                  }
                                `}
                                  onClick={() => {
                                    if (!menuActive && !menu.items?.length) {
                                      router.push(menuPath);
                                      onChange?.();
                                    } else {
                                      if (
                                        !showChild?.find(
                                          (sc) =>
                                            sc == menu_head_key + '|' + menu_key
                                        )
                                      ) {
                                        setShowChild([
                                          ...showChild,
                                          menu_head_key + '|' + menu_key,
                                        ]);
                                      } else {
                                        setShowChild(
                                          showChild.filter(
                                            (val) =>
                                              val !=
                                              menu_head_key + '|' + menu_key
                                          )
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-start md:justify-center lg:justify-start w-full gap-3">
                                    {menu.icon && (
                                      <FontAwesomeIcon
                                        icon={menu.icon}
                                        className=""
                                      />
                                    )}
                                    <h6 className="block md:hidden lg:block w-full">
                                      {menu.label}
                                    </h6>
                                    {menu.right_content && menu.right_content}
                                  </div>

                                  {menu?.items?.length && (
                                    <FontAwesomeIcon
                                      icon={faChevronUp}
                                      className={`text-slate-400 block md:hidden lg:block ${
                                        showChild?.find(
                                          (sc) =>
                                            sc == menu_head_key + '|' + menu_key
                                        ) || 'rotate-180'
                                      }`}
                                    />
                                  )}
                                </a>

                                {menu.items && menu.items[0] && (
                                  <div
                                    className={`
                                    shadow-inner mx-3 md:mx-0 lg:mx-3 lg:py-1 px-1 lg:px-2 rounded-lg bg-background intro__y overflow-hidden
                                    ${
                                      showChild?.find(
                                        (sc) =>
                                          sc == menu_head_key + '|' + menu_key
                                      ) || 'hidden'
                                    }`}
                                  >
                                    {menu.items.map((child, child_key) => {
                                      let childPath =
                                        (basePath || '') + '/' + child.path;

                                      if (
                                        !child?.key ||
                                        hasAccess?.find(
                                          (access) => access == child?.key
                                        )
                                      ) {
                                        return (
                                          <Link
                                            href={childPath}
                                            key={child_key}
                                          >
                                            <div
                                              onClick={() => {
                                                onChange?.();
                                              }}
                                              className={`
                                              flex items-center gap-3 justify-start px-3 md:px-0 lg:px-3 rounded-md pt-2 pb-1.5 my-1 lg:my-1.5 overflow-hidden
                                              ${
                                                router.asPath
                                                  ?.split('?')
                                                  ?.at(0) == childPath
                                                  ? 'bg-primary text-white'
                                                  : 'text-slate-400 dark:text-slate-300 hover:text-primary hover:bg-white hover:shadow'
                                              }
                                            `}
                                            >
                                              {child.icon && (
                                                <FontAwesomeIcon
                                                  icon={child.icon}
                                                  className=""
                                                />
                                              )}
                                              <h6 className="text-sm md:text-xs lg:text-sm">
                                                {child.label}
                                              </h6>
                                            </div>
                                          </Link>
                                        );
                                      }
                                    })}
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          }
                        })}
                      </div>
                    </React.Fragment>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div
          className={`
            ${
              minimize
                ? 'col-span-10'
                : 'col-span-7 md:col-span-6 lg:col-span-8'
            } 
            py-4 h-full overflow-auto scroll_control intro__fade__up
          `}
        >
          {children}
        </div>
      </div>
    </>
  );
}
