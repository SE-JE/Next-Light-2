import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import {
  faBars,
  // faBell,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import { HeadbarProps } from './headbar.props';
import { token_cookie_name } from '../../../helpers';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export function HeadbarComponent({ children, onMenuClick }: HeadbarProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(false);

  return (
    <div className="p-2.5 flex items-center justify-between bg-white rounded-b-[20px] relative shadow-sm z-30 select-none intro__fade__down">
      <div className="grid grid-cols-9 items-center w-full">
        <div className="flex lg:hidden justify-center pl-2">
          <div
            className="w-8 aspect-square flex justify-center items-center hover:text-primary rounded-md"
            onClick={onMenuClick}
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </div>
        </div>
        <div className="col-span-8 lg:col-span-3 xl:col-span-2 px-3 lg:px-6 pl-10 py-2">
          <h1 className="text-lg font-semibold text-primary whitespace-nowrap">
            Next Light
          </h1>
          <p className="text-xs -mt-1 font-semibold text-slate-400">
            The Starter Template
          </p>
        </div>
        <div className="col-span-6 hidden lg:block">
          <div className="px-4">{children}</div>
        </div>
      </div>

      <div className="flex gap-4 w-max items-center">
        {/* <div className="p-3">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
        </div> */}
        <div
          className="flex items-center gap-5 px-4 cursor-pointer mr-2 lg:mr-4"
          onClick={() => setProfile(!profile)}
        >
          <div className="h-10 bg-background rounded-full aspect-square overflow-hidden">
            <Image src="/avatar.jpg" width={150} height={150} alt="avatar" />
          </div>

          <div className="hidden lg:block w-[110px]">
            <h6 className="font-semibold limit__line__1">Jhon Duck</h6>
            <h6 className="-mt-1 text-sm font-medium limit__line__1">Admin</h6>
          </div>
        </div>
      </div>

      <OutsideClickHandler
        onOutsideClick={() => {
          setProfile(false);
        }}
      >
        <div
          className={`absolute right-4 top-16 rounded-b-xl shadow-md overflow-hidden bg-white z-30 ${
            profile ? 'scale-y-100' : 'scale-y-0'
          }`}
        >
          <div className="flex items-center gap-6 px-8 py-6 rounded-b-xl shadow-md">
            <div className="h-16 bg-background border-2 border-light-primary rounded-full aspect-square overflow-hidden">
              <Image src="/avatar.jpg" width={150} height={150} alt="avatar" />
            </div>
            <div className="pr-5 w-[160px]">
              <h6 className="text-lg font-bold text-slate-600">Jhon Duck</h6>
              <h6 className="text-sm font-semibold text-gray-600 limit__line__1">
                Admin
              </h6>
            </div>
          </div>

          <div className="py-5">
            {/* <div className="px-8 py-4 flex gap-5 hover:bg-light-primary hover:shadow-md cursor-pointer">
              <FontAwesomeIcon icon={faUserCog} />
              <label className="cursor-pointer font-semibold">
                Edit Profile
              </label>
            </div> */}
            <div
              className="px-8 py-4 flex gap-5 hover:bg-light-danger hover:shadow-md cursor-pointer text-danger"
              onClick={() => {
                Cookies.remove(token_cookie_name);
                router.push('/');
              }}
            >
              <FontAwesomeIcon icon={faPowerOff} />
              <label className="cursor-pointer font-semibold">Sign Out</label>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
}
