'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainBlock from '../MainBlock/MainBlock';

const MainBlockWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get('page');
  const initialPage = Math.max(parseInt(pageParam ?? '1', 10), 1);

  return (
    <Suspense fallback={<div>Loading Main Block...</div>}>
      <MainBlock initialPage={initialPage} />
    </Suspense>
  );
};

export default MainBlockWrapper;