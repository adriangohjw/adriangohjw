/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import YouWillLearnCard from 'components/MDX/YouWillLearnCard';

function RefactoringCheatSheetLearnMore() {
  return (
    <>
      <section className="my-8 sm:my-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Composing Methods" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-6-composing-methods">
            <p>
              Streamline methods, remove code duplication, and pave the way for future improvements
            </p>
          </YouWillLearnCard>
        </div>
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Moving Features Between Objects" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-7-moving-features-between-objects">
            <p>
              Move functionality between classes, create new classes, and hide implementation details from public access
            </p>
          </YouWillLearnCard>
        </div>
      </section>
      <section className="my-8 sm:my-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Organizing Data" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-8-organizing-data">
            <p>
              Untangling of class associations, which makes classes more portable and reusable
            </p>
          </YouWillLearnCard>
        </div>
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Simplifying Conditional Expressions" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-9-simplifying-conditional-expressions">
            <p>
              Simplifying complex conditional expressions, making code more readable and maintainable
            </p>
          </YouWillLearnCard>
        </div>
      </section>
      <section className="my-8 sm:my-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Making Method Calls Simpler" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-10-making-method-calls-simpler">
            <p>
              Make method calls simpler and easier to understand, thus simplifying the interfaces for interaction between classes
            </p>
          </YouWillLearnCard>
        </div>
        <div className="flex flex-col justify-center">
          <YouWillLearnCard title="Dealing with Generalization" path="/blog/cheat-sheet-refactoring-improving-the-design-of-existing-code/chapter-11-dealing-with-generalization">
            <p>
              Move functionality along the class inheritance hierarchy, create new classes and interfaces, and replace inheritance with delegation
            </p>
          </YouWillLearnCard>
        </div>
      </section>
    </>
  );
}

export default RefactoringCheatSheetLearnMore;
