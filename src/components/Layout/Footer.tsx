/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {ExternalLink} from 'components/ExternalLink';

export function Footer() {
  return (
    <>
      <div className="self-stretch w-full sm:pl-0 lg:pl-80 sm:pr-0 2xl:pr-80 pl-0 pr-0">
        <div className="mx-auto w-full px-5 sm:px-12 md:px-12 pt-10 md:pt-12 lg:pt-10">
          <hr className="max-w-7xl mx-auto border-border dark:border-border-dark" />
        </div>
        <footer className="text-secondary dark:text-secondary-dark py-12 px-5 sm:px-12 md:px-12 sm:py-12 md:py-16 lg:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8 max-w-7xl mx-auto ">
            <ExternalLink
              href="/"
              className="col-span-2 sm:col-span-1 justify-items-start w-44 text-left">
              <div>
                adriangohjw
              </div>
              <div className="text-xs text-left mt-2 pr-0.5">
                &copy;{new Date().getFullYear()}<br></br>
                <a href="https://github.com/reactjs/reactjs.org">Design forked from React</a>
              </div>
            </ExternalLink>
          </div>
        </footer>
      </div>
    </>
  );
}
