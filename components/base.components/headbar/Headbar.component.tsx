import React, { useEffect, useRef, useState } from 'react';

import {
  faBell,
  faPowerOff,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { HeadbarProps } from './headbar.props';

export function HeadbarComponent({ children }: HeadbarProps) {
  const [profile, setProfile] = useState(false);

  const wrapProfile = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (
        wrapProfile.current &&
        !wrapProfile?.current.contains(e.target) &&
        profile
      ) {
        setProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapProfile, profile]);

  return (
    <div className="p-2.5 flex items-center justify-between bg-white rounded-b-[20px] relative shadow-sm z-30">
      <div className="grid grid-cols-8 w-full">
        <div className="col-span-2 px-6">
          <h1 className="text-lg font-semibold text-primary whitespace-nowrap">
            MY PROJECT
          </h1>
        </div>
        <div className="col-span-6 hidden lg:block">
          <div className="px-4">{children}</div>
        </div>
      </div>

      <div className="flex gap-4 w-max">
        <div className="p-3">
          <FontAwesomeIcon icon={faBell} className="text-lg text-white" />
        </div>
        <div
          className="flex items-center gap-5 px-4 cursor-pointer"
          onMouseDown={() => setProfile(!profile)}
        >
          <div className="h-10 bg-base rounded-full aspect-square overflow-hidden">
            <Image src="/avatar.jpg" width={150} height={150} alt="avatar" />
          </div>

          <div>
            <h6 className="font-semibold whitespace-nowrap">Jhon Duck..</h6>
            <h6 className="-mt-1 text-sm font-medium">Admin</h6>
          </div>
        </div>
      </div>

      <div
        className={`absolute right-0 top-14 rounded-xl shadow-md overflow-hidden bg-white z-50 ${
          profile ? 'scale-y-100' : 'scale-y-0'
        }`}
        ref={wrapProfile}
      >
        <div className="flex items-center gap-6 px-8 py-6 rounded-b-xl shadow-md">
          <div className="h-16 bg-base border-4 border__secondary rounded-full aspect-square overflow-hidden">
            <Image src="/avatar.jpg" width={150} height={150} alt="avatar" />
          </div>
          <div className="pr-5">
            <h6 className="text-lg font-extrabold text-gray-800">Jhon Duck</h6>
            <h6 className="text-sm font-medium text-gray-600">Admin</h6>
          </div>
        </div>

        <div className="py-5">
          <div className="px-8 py-4 flex gap-5 text-gray-700 hover__bg__light__primary hover:shadow-md cursor-pointer">
            <FontAwesomeIcon icon={faUserCog} />
            <label className="cursor-pointer font-semibold">Edit Profile</label>
          </div>
          <div
            className="px-8 py-4 flex gap-5 hover__bg__light__primary hover:shadow-md cursor-pointer text__danger"
            onClick={() => {}}
          >
            <FontAwesomeIcon icon={faPowerOff} />
            <label className="cursor-pointer font-semibold">Sign Out</label>
          </div>
        </div>
      </div>
    </div>
  );
}
