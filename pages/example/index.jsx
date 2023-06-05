import React from 'react';
import { Layout } from '../../components/construct.components';

export default function Index() {
  return <></>;
}

Index.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
