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
}: sidebarProps) {
  const router = useRouter();
  // const [showSubmenu, setShowSubmenu] = useState([]);
  // const [showMenu, setShowMenu] = useState([]);
  // const [showSetting, setShowSetting] = useState(false);
  const [showMenu, setShowMenu] = useState<number[]>([]);
  const [showChild, setShowChild] = useState<string[]>([]);

  // const wrapSetting = useRef(null);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (
  //       wrapSetting.current &&
  //       !wrapSetting.current.contains(event.target) &&
  //       showSetting
  //     ) {
  //       setShowSetting(false);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [wrapSetting, showSetting]);

  useEffect(() => {
    items.map((menu_head, menu_head_key) => {
      {
        menu_head.items?.map((menu, menu_key) => {
          if (
            menu.items?.find(
              (val) => (basePath || '') + val.path == router.asPath
            )
          ) {
            if (!showChild?.includes(menu_head_key + '|' + menu_key))
              setShowChild([...showChild, menu_head_key + '|' + menu_key]);
            if (!showMenu?.includes(menu_key))
              setShowMenu([...showMenu, menu_key]);
          }

          if ((basePath || '') + menu.path == router.asPath) {
            if (!showMenu?.includes(menu_key))
              setShowMenu([...showMenu, menu_key]);
          }

          if (menu.items && menu.items.length) {
            menu.items?.map((child) => {
              if (
                (basePath || '') + child.path &&
                router.asPath == (basePath || '') + child.path
              ) {
                onChange?.([menu_head, menu, child]);
              }
            });
          } else {
            if (
              (basePath || '') + menu.path &&
              router.asPath == (basePath || '') + menu.path
            ) {
              onChange?.([menu_head, menu]);
            }
          }
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, items, basePath, onChange]);

  return (
    <>
      <div className="grid h-[calc(100vh-80px)] grid-cols-7 lg:grid-cols-9 gap-6">
        <div
          className={`
            ${
              minimize
                ? 'absolute scale-x-0 -translate-x-full'
                : 'lg:col-span-2 scale-100'
            }
          `}
        >
          <div className="flex flex-col h-full bg-white rounded-b-xl overflow-hidden shadow">
            {/* <div className="py-4 px-4 flex justify-center lg:justify-start gap-8 bg-primary rounded-md">
              <h1 className="text-lg font-semibold text-white hidden lg:block">
                MY PROJECT
              <h1 className="text-lg font-semibold text-white block lg:hidden">
                MP
              </h1>
            </div> */}
            <div className="h-full py-3 px-3 overflow-y-auto scroll_control shadow__scrolly">
              {items.map((menu_head, menu_head_key) => {
                return (
                  <React.Fragment key={menu_head_key}>
                    <div
                      className="px-3 pt-4 pb-2 flex justify-between items-center cursor-pointer"
                      onClick={() => {
                        if (menu_head.collapse) {
                          if (!showMenu?.includes(menu_head_key)) {
                            setShowMenu([...showMenu, menu_head_key]);
                          } else {
                            setShowMenu(
                              showMenu.filter((val) => val != menu_head_key)
                            );
                          }
                        }
                      }}
                    >
                      <h6 className="text-sm text-slate-500 font-semibold dark:text-slate-300 hidden lg:block">
                        {menu_head.label}
                      </h6>
                      <div className="h-1 block lg:hidden"></div>
                      {menu_head.collapse && (
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`
                            text-slate-500 dark:text-slate-300 hidden lg:block
                            ${showMenu?.includes(menu_head_key) && 'rotate-180'}
                          `}
                        />
                      )}
                    </div>

                    <div
                      className={`
                        intro__y
                        ${
                          !menu_head.collapse ||
                          showMenu.includes(menu_head_key) ||
                          'lg:hidden'
                        }
                      `}
                    >
                      {menu_head?.items?.map((menu, menu_key) => {
                        const menuPath = (basePath || '') + menu.path;
                        const menuActive = router.asPath == menuPath;

                        return (
                          <React.Fragment key={menu_key}>
                            <a
                              className={`
                                flex items-center duration-150 justify-between gap-4 py-3 my-1 cursor-pointer rounded-lg mx-3 px-4 overflow-hidden
                                ${
                                  menuActive
                                    ? 'text-white bg-primary'
                                    : 'text-slate-400 dark:text-slate-200 hover:text-primary hover:bg-base'
                                }
                              `}
                              onClick={() => {
                                if (!menuActive && !items.length) {
                                  router.push(menuPath);
                                } else {
                                  if (
                                    !showChild?.includes(
                                      menu_head_key + '|' + menu_key
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
                                          val != menu_head_key + '|' + menu_key
                                      )
                                    );
                                  }
                                }
                              }}
                            >
                              <div className="flex items-center justify-center lg:justify-start w-full gap-3">
                                {menu.icon && (
                                  <FontAwesomeIcon
                                    icon={menu.icon}
                                    className=""
                                  />
                                )}
                                <h6 className="hidden lg:block">
                                  {menu.label}
                                </h6>
                              </div>

                              {menu?.items?.length && (
                                <FontAwesomeIcon
                                  icon={faChevronUp}
                                  className={`text-slate-400 hidden lg:block ${
                                    showChild?.includes(
                                      menu_head_key + '|' + menu_key
                                    ) || 'rotate-180'
                                  }`}
                                />
                              )}
                            </a>

                            {menu.items && menu.items[0] && (
                              <div
                                className={`
                                  shadow-inner lg:mx-3 lg:py-1 px-1 lg:px-2 rounded-lg bg-base intro__y  overflow-hidden
                                  ${
                                    showChild?.includes(
                                      menu_head_key + '|' + menu_key
                                    ) || 'hidden'
                                  }`}
                              >
                                {menu.items.map((child, child_key) => {
                                  let childPath = (basePath || '') + child.path;

                                  return (
                                    <Link href={childPath} key={child_key}>
                                      <div
                                        className={`
                                          flex items-center gap-3 justify-center lg:justify-start lg:px-3 rounded-lg py-2 my-1 lg:my-2 overflow-hidden
                                          ${
                                            router.asPath == childPath
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
                                        <h6 className="hidden lg:block">
                                          {child.label}
                                        </h6>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={`
            ${minimize ? 'col-span-9' : 'col-span-6 lg:col-span-7'} 
            py-4 h-full overflow-auto scroll_control
          `}
        >
          {children}
        </div>
      </div>
    </>
  );
}
