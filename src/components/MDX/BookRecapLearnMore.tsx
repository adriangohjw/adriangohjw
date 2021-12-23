/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import YouWillLearnCard from 'components/MDX/YouWillLearnCard';

function BookRecapLearnMore() {
  return (
    <>
      <section className="my-8 sm:my-10">
        <div className="flex flex-col justify-center">
          I try (yes, try) to read more books.<br></br>
          Might as well use this as a platform to documenent my learnings.
        </div>
      </section>
      <section className="my-8 sm:my-10">
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="'The Cold Start Problem' by Andrew Chen" path="/blog/book_recaps/the-cold-start-problem">
            <p>
              The Cold Start Problem explores how tech&apos;s most successful products and companies solved the dreaded &quot;cold start problem&quot; by using network effects to launch and ultimately scale to billions of users.
            </p>
          </YouWillLearnCard>
        </div>
      </section>
    </>
  );
}

export default BookRecapLearnMore;
