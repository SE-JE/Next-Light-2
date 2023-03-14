import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  BreadcumbComponent,
  HeadbarComponent,
  SidebarComponent,
} from '../base.components';
import { breadcumbItemProps } from '../base.components/breadcumb/breadcumb.props';

export function Layout({ children }: { children: any }) {
  const router = useRouter();
  const [breadcumbs, setBreadcumbs] = useState<breadcumbItemProps[]>([]);

  useEffect(() => {
    let paths = router.asPath.split('/');
    let newBreadcumbs: breadcumbItemProps[] = [];

    newBreadcumbs.push({
      link: '/',
      label: 'Dashboard',
    });

    paths.map((path, key) => {
      let link = '';

      paths
        .filter((_, linkKey) => linkKey <= key)
        .map((pathLink) => {
          if (pathLink) link += '/' + pathLink;
        });

      if (path) {
        newBreadcumbs.push({
          link: link,
          label: path.replace('-', ' '),
        });
      }
    });

    setBreadcumbs(newBreadcumbs);
  }, [router]);

  return (
    <>
      <div className="container mx-auto">
        <HeadbarComponent>
          <BreadcumbComponent items={breadcumbs} />
        </HeadbarComponent>
        <div className="px-4">
          <SidebarComponent basePath="/layout" items={[]}>
            {children}
          </SidebarComponent>
        </div>
      </div>
    </>
  );
}
