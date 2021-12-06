/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import YouWillLearnCard from 'components/MDX/YouWillLearnCard';

function BlogLearnMore() {
  return (
    <>
      <section className="my-8 sm:my-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Technical" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-6-composing-methods">
            <p>
              How I built stuff and (try to) write clean code
            </p>
          </YouWillLearnCard>
        </div>
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Management" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-6-composing-methods">
            <p>
              Thoughts and learnings from managing an engineering team
            </p>
          </YouWillLearnCard>
        </div>
      </section>
      <section className="my-8 sm:my-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
      <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Opinions" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-7-moving-features-between-objects">
            <p>
              Just some random thoughts, might be absolutely right or terribly wrong
            </p>
          </YouWillLearnCard>
        </div>
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Others" path="/blog/i-spoke-at-rubysg-behind-the-gems">
            <p>
              Everything else that I couldn't categorize
            </p>
          </YouWillLearnCard>
        </div>
      </section>
    </>
  );
}

export default BlogLearnMore;
