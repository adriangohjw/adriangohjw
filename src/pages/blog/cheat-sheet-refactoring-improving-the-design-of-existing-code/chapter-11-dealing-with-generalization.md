---
title:  "Chapter 11: Dealing with Generalization"
---

I will be skipping several approaches here, as I found it to be the default good practice for OOP in general. This includes:
- Pull Up Field: Move similar fields across subclasses into the superclass
- Pull Up Method: Move similar methods across subclasses into the superclass
- Pull Up Constructor: Create a superclass constructor and call it from the subclass instead
- Push Down Field: Move fields in the superclass that's only relevant for subclasses into them
- Push Down Method: Move methods in the superclass that's only relevant for subclasses into them

---

## Extract Subclass {/*extract-subclass*/}

> Create a subclass for the subset of features

Sign(s) of code smell:
- A class has features that are used only in some instances

```ruby
# Before
class JobItem
  attr_accessor :unit_price, :quantity, :is_labour, :employee

  def initialize(unit_price, quantity, is_labour, employee)
    @unit_price = unit_price
    @quantity = quantity
    @is_labour = is_labour
    @employee = employee
  end

  def get_unit_price
    @is_labour ? @employee.get_rate : @unit_price
  end
end
```

```ruby
# After
class JobItem
  attr_accessor :unit_price, :quantity

  def initialize(unit_price, quantity)
    @unit_price = unit_price
    @quantity = quantity
  end

  def get_unit_price
    @unit_price
  end
end

class LabourItem < JobItem
  attr_accessor :employee

  def initialize(unit_price, quantity, employee)
    super(unit_price, quantity)
    @employee = employee
  end

  def get_unit_price
    @employee.get_rate
  end
end
```

Why it is better:
- Improve readability and error-proneness by removing irrelevant fields and methods

---

## Extract Superclass {/*extract-superclass*/}

> Create a superclass and move the common features to the superclass

Sign(s) of code smell:
- You have two classes with similar features.

```ruby
# Before
class Employee
  attr_accessor :id, :name, :annual_cost
  def initialize(id, name, annual_cost)
    # ...
  end
end

class Department
  attr_accessor :name, :staff
  def initialize(name)
    # ...
  end

  def get_total_annual_cost
    # ...
  end
end
```

```ruby
# After
class Party
  attr_accessor :name
  def initialize(name)
    # ...
  end

  def get_annual_cost; end
end

class Employee < Party
  attr_accessor :id
  def initialize(id, name, annual_cost)
    super(name)
    # ...
  end

  def get_annual_cost
    # ...
  end
end

class Department < Party
  def initialize(name)
    super(name)
  end

  def get_annual_cost
    # ...
  end
end
```

Why it is better:
- Remove duplicated code

Note:
- Find it to be useful in theory, but in practice, there's often a lot of other restrictions:
  - Using ORM where the models are quite tied to the database schema
- Also, don't find it to be as useful in Ruby because abstract classes and interfaces aren't a thing since it is a dynamically typed language

---

## Replace Inheritance with Delegation {/*replace-inheritance-with-delegation*/}

> Create a field for the superclass and adjust methods to delegate to the superclass

Sign(s) of code smell:
- A subclass uses only part of a superclasses interface or does not want to inherit data
- As the class grows, some of the inheritance might no longer make sense

```ruby
# Before
class Sanitation
  def wash_hands
    'Cleaned!'
  end
end

class Child < Sanitation
end
```

```ruby
# After
class Sanitation
  def wash_hands
    'Cleaned!'
  end
end

# if you are using ActiveSupport
class Child
  delegate :wash_hands, to: :@sanitation

  def initialize
    @sanitation = Sanitation.new
  end
end

# using Forwardable module included with Ruby
require 'forwardable'

class Child
  extend Forwardable

  def_delegators :@sanitation, :wash_hands

  def initialize
    @sanitation = Sanitation.new
  end
end
```

Why it is better:
- A class doesn’t contain any unneeded methods inherited from the superclass.
- Various objects with various implementations can be put in the delegate field.

---

## Replace Delegation with Inheritance {/*replace-delegation-with-inheritance*/}

> Make the delegating class a subclass of the delegate

Sign(s) of code smell:
- You're using delegation and are often writing many simple delegations for the entire interface.

```ruby
# Before
class Employee
  delegate :get_last_name, to: :@person

  def initialize(name)
    @name = name
    @person = Person.new
  end

  def to_str
    "Employee: #{get_last_name}"
  end
end
```

```ruby
# After
class Employee < Person
  def to_str
    "Employee: #{get_last_name}"
  end
end
```

Why it is better:
- Remove code duplication + Get rid of delegation methods

Note:
- This is the flip side of <b>Replace Delegation with Inheritance</b>
- Only use if the subclass is using all the methods of the superclass to which you are delegating
