/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

function HomepageHero() {
  return (
    <>
      <div className="mt-8 lg:mt-10 mb-0 sm:mt-8 sm:mb-8 lg:mb-6 flex-col sm:flex-row flex flex-grow items-start sm:items-center justify-start mx-auto max-w-4xl">
        <div className="flex flex-wrap">
          <h1 className="text-5xl mr-4 -mt-1 flex wrap font-bold leading-tight text-primary dark:text-primary-dark">
            adriangohjw
          </h1>
          <div className="inline-flex self-center px-2 mt-1 bg-highlight dark:bg-highlight-dark w-auto rounded text-link dark:text-link-dark uppercase font-bold tracking-wide text-base whitespace-nowrap">
            Home
          </div>
        </div>
      </div>
    </>
  );
}

export default HomepageHero;
