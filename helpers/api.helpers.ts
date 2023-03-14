import { useEffect, useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { token_cookie_name, loginPath, basePath } from './middleware.helpers';
import fileDownload from 'js-file-download';

// =========================>
// ## type of filter params
// =========================>
export type getFilterParams = {
  type?: 'equal' | 'notEqual' | 'in' | 'notIn' | 'range';
  column?: string;
  value?: string | string[];
};

// =========================>
// ## type of get params
// =========================>
export type getParams = {
  paginate?: number;
  page?: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
  filter?: getFilterParams[];
};

// =========================>
// ## type of get props
// =========================>
export type getProps = {
  path?: string;
  url?: string;
  params?: getParams;
  includeParams?: object;
  includeHeaders?: object;
  bearer?: string;
};

// =========================>
// ## get function
// =========================>
export const get = async ({
  path,
  url,
  params,
  includeParams,
  includeHeaders,
  bearer,
}: getProps) => {
  const fetchUrl = url
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}/${path || ''}`;
  const fetchHeaders: any = includeHeaders || {};

  if (!fetchHeaders.Authorization) {
    if (bearer) {
      fetchHeaders.Authorization = `bearer ${bearer}`;
    } else if (Cookies.get(token_cookie_name)) {
      fetchHeaders.Authorization = `bearer ${Cookies.get(token_cookie_name)}`;
    }
  }

  const fetch = await axios.get(fetchUrl, {
    headers: fetchHeaders,
    params: {
      ...params,
      ...includeParams,
    },
  });

  if (fetch.status == 401) {
    Router.push(loginPath);
  } else if (fetch.status == 403) {
    Router.push(basePath);
  } else {
    return fetch;
  }
};

// =========================>
// ## get hook function
// =========================>
export const useGet = (props: getProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [code, setCode] = useState<number | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      const response = await get(props);

      if (response?.status) {
        setLoading(false);
        setCode(response?.status);
        setData(response?.data);
      }
    };

    if (props.path || props.url) {
      fetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.path,
    props.url,
    props.params?.paginate,
    props.params?.page,
    props.params?.search,
    props.params?.sortBy,
    props.params?.sortDirection,
    props.params?.filter,
    props.includeParams,
    props.includeHeaders,
    props.bearer,
    refresh,
  ]);

  const reset = () => setRefresh(!refresh);

  return [loading, code, data, reset];
};

// =========================>
// ## type of post props
// =========================>
export type postProps = {
  path?: string;
  url?: string;
  params?: object;
  body?: object;
  includeHeaders?: object;
  bearer?: string;
  contentType?: 'application/json' | 'multipart/form-data';
};

// =========================>
// ## post function
// =========================>
export const post = async ({
  path,
  url,
  params,
  body,
  includeHeaders,
  bearer,
  contentType,
}: postProps) => {
  const fetchUrl = url
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}/${path || ''}`;
  const fetchHeaders: any = includeHeaders || {};

  if (!fetchHeaders.Authorization) {
    if (bearer) {
      fetchHeaders.Authorization = `bearer ${bearer}`;
    } else if (Cookies.get(token_cookie_name)) {
      fetchHeaders.Authorization = `bearer ${Cookies.get(token_cookie_name)}`;
    }
  }

  if (!fetchHeaders['Content-Type']) {
    fetchHeaders['Content-Type'] = contentType
      ? contentType
      : 'application/json';
  }

  await axios.get(process.env.NEXT_PUBLIC_CSRF_URL || '');
  const fetch = await axios
    .post(fetchUrl, body, {
      headers: fetchHeaders,
      params: {
        ...params,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);

  if (fetch.status == 401) {
    Router.push(loginPath);
  } else if (fetch.status == 403) {
    Router.push(basePath);
  } else {
    return fetch;
  }
};

// =========================>
// ## post hook function
// =========================>
// export const usePost = (props: postProps) => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [code, setCode] = useState<number | null>(null);
//   const [data, setData] = useState<any | null>(null);

//   const onSubmit: () => void = () => {
//     setLoading(true);

//     const fetch = async () => {
//       const response = await post(props);

//       if (response?.status) {
//         setCode(response?.status);
//         setData(response?.data);
//       }
//     };

//     if (props.path || props.url) {
//       fetch();
//     }
//   };

//   return [onSubmit, loading, code, data];
// };

// =========================>
// ## type of patch props
// =========================>
export type patchProps = {
  path?: string;
  url?: string;
  params?: object;
  body?: object;
  includeHeaders?: object;
  bearer?: string;
  contentType?: 'application/json' | 'multipart/form-data';
};

// =========================>
// ## patch function
// =========================>
export const patch = async ({
  path,
  url,
  params,
  body,
  includeHeaders,
  bearer,
  contentType,
}: patchProps) => {
  const fetchUrl = url
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}/${path || ''}`;
  const fetchHeaders: any = includeHeaders || {};

  if (!fetchHeaders.Authorization) {
    if (bearer) {
      fetchHeaders.Authorization = `bearer ${bearer}`;
    } else if (Cookies.get(token_cookie_name)) {
      fetchHeaders.Authorization = `bearer ${Cookies.get(token_cookie_name)}`;
    }
  }

  if (!fetchHeaders['Content-Type']) {
    fetchHeaders['Content-Type'] = contentType
      ? contentType
      : 'application/json';
  }

  await axios.get(process.env.NEXT_PUBLIC_CSRF_URL || '');
  const fetch = await axios.patch(fetchUrl, body, {
    headers: fetchHeaders,
    params: {
      ...params,
    },
  });

  if (fetch.status == 401) {
    Router.push(loginPath);
  } else if (fetch.status == 403) {
    Router.push(basePath);
  } else {
    return fetch;
  }
};

// =========================>
// ## patch hook function
// =========================>
// export const usePatch = (props: patchProps) => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [code, setCode] = useState<number | null>(null);
//   const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     setLoading(true);

//     const fetch = async () => {
//       const response = await patch(props);

//       if (response?.status) {
//         setCode(response?.status);
//         setData(response?.data);
//       }
//     };

//     if (props.path || props.url) {
//       fetch();
//     }
//   }, [
//     props,
//     props.path,
//     props.url,
//     props.params,
//     props.body,
//     props.includeHeaders,
//     props.bearer,
//     props.contentType,
//   ]);

//   return [loading, code, data];
// };

// =========================>
// ## type of destroy props
// =========================>
export type destroyProps = {
  path?: string;
  url?: string;
  params?: object;
  includeHeaders?: object;
  bearer?: string;
};

// =========================>
// ## destroy function
// =========================>
export const destroy = async ({
  path,
  url,
  params,
  includeHeaders,
  bearer,
}: destroyProps) => {
  const fetchUrl = url
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}/${path || ''}`;
  const fetchHeaders: any = includeHeaders || {};

  if (!fetchHeaders.Authorization) {
    if (bearer) {
      fetchHeaders.Authorization = `bearer ${bearer}`;
    } else if (Cookies.get(token_cookie_name)) {
      fetchHeaders.Authorization = `bearer ${Cookies.get(token_cookie_name)}`;
    }
  }

  const fetch = await axios.delete(fetchUrl, {
    headers: fetchHeaders,
    params: {
      ...params,
    },
  });

  if (fetch.status == 401) {
    Router.push(loginPath);
  } else if (fetch.status == 403) {
    Router.push(basePath);
  } else {
    return fetch;
  }
};

// =========================>
// ## destroy hook function
// =========================>
export const useDestroy = (props: destroyProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<number | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      const response = await destroy(props);

      if (response?.status) {
        setCode(response?.status);
        setData(response?.data);
      }
    };

    if (props.path || props.url) {
      fetch();
    }
  }, [
    props,
    props.path,
    props.url,
    props.params,
    props.includeHeaders,
    props.bearer,
  ]);

  return [loading, code, data];
};

// =========================>
// ## type of download props
// =========================>
export type downloadProps = {
  path?: string;
  url?: string;
  params?: object;
  includeHeaders?: object;
  bearer?: string;
  fileName: string;
  onDownloadProgress: (e: AxiosProgressEvent) => void;
};

// =========================>
// ## download function
// =========================>
export const download = async ({
  path,
  url,
  params,
  includeHeaders,
  bearer,
  fileName,
  onDownloadProgress,
}: downloadProps) => {
  const fetchUrl = url
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}/${path || ''}`;
  const fetchHeaders: any = includeHeaders || {};

  if (!fetchHeaders.Authorization) {
    if (bearer) {
      fetchHeaders.Authorization = `bearer ${bearer}`;
    } else if (Cookies.get(token_cookie_name)) {
      fetchHeaders.Authorization = `bearer ${Cookies.get(token_cookie_name)}`;
    }
  }

  if (!fetchHeaders.responseType) {
    fetchHeaders.responseType = 'blob';
  }

  const fetch = await axios.get(fetchUrl, {
    headers: fetchHeaders,
    params: {
      ...params,
    },
    onDownloadProgress: onDownloadProgress,
  });

  if (fetch.status == 401) {
    Router.push(loginPath);
  } else if (fetch.status == 403) {
    Router.push(basePath);
  } else {
    fileDownload(fetch.data, fileName);
    return fetch.data;
  }
};

// =========================>
// ## patch hook function
// =========================>
export const useDownload = (props: downloadProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      const response = await download({
        ...props,
        onDownloadProgress: (e) => {
          setProgress(e.progress || 0);
        },
      });

      if (response?.status) {
        setCode(response?.status);
        setProgress(100);
      }
    };

    if (props.path || props.url) {
      fetch();
    }
  }, [
    props,
    props.path,
    props.url,
    props.params,
    props.includeHeaders,
    props.bearer,
  ]);

  return [loading, code, progress];
};
