---
title:  "Chapter 8: Organizing Data"
---

## Replace Data Value with Object {/*replace-data-value-with-object*/}

> TL;DR: Turn the data item into an object

Sign(s) of code smell:
- Simple objects aren't so simple and require quite a bit of manipulation

```ruby
# Before
class JobListing
  def initialize(salary_min, salary_max)
    @salary_min = salary_min
    @salary_max = salary_max
  end

  def salary_range_within_1000?
    @salary_max - @salary_min < 1000
  end
end

j = JobListing.new(4000, 5000)
return j.salary_range_within_1000?
```

```ruby
# After
class JobListing
  def initialize(salary_min, salary_max)
    @salary_range = SalaryRange.new(salary_min, salary_max)
  end
end

class SalaryRange
  def initialize(salary_min, salary_max)
    @salary_min = salary_min
    @salary_max = salary_max
  end

  def within_1000?
    @salary_max - @salary_min < 1000
  end
end

j = JobListing.new(4000, 5000)
return j.salary_range.within_1000?
```

Why it is better:
- This has been explained in greater detail in [Value Objects to avoid Primitive Obsession]({% post_url 2021-05-26-value-objects-to-avoid-primitive-obsession %})
  - Improved Readability
  - Business logics are abstracted and hidden away
  - The class can be extended easily

---

## Replace Array with Object {/*replace-array-with-object*/}

> Replace the array with an object that has a field for each element

Sign(s) of code smell:
- The array is used to contain different objects e.g. <i>the 1st element is the name, 2nd is the age...</i>

```ruby
# Before
a = ['Adrian', 'Goh', 25]
puts "First name is #{a[0]}"
```

```ruby
# After

# Solution #1
Person = Struct.new(:first_name, :last_name, :age)
a = Person.new('Adrian', 'Goh', 25)
puts "First name is #{a.first_name}"

# Solution #2
Person = Struct.new(:first_name, :last_name, :age, keyword_init: true)
a = Person.new(first_name: 'Adrian', last_name: 'Goh', age: 25)
puts "First name is #{a.first_name}"
```

Why it is better:
- This is very similar to <b>Replace Data Value with Object</b>
- Also, give more context, e.g. `a[0]` doesn't tell you anything, but `a.first_name` does

Note:
- Solution #2 requires keywords to be included during initiation. This is more encouraged when there are many attributes in the object.

---

## Replace Magic Number with Symbolic Constant {/*replace-magic-number-with-symbolic-constant*/}

> Replace the number with a constant instead

Sign(s) of code smell:
- You have a literal number with a particular meaning.

```ruby
# Before
def price_in_usd(price_in_sgd)
  price_in_sgd * 0.74
end
```

```ruby
# After
SGD_TO_USD_CONVERSION_RATE = 0.74

def price_in_usd(price_in_sgd)
  price_in_sgd * SGD_TO_USD_CONVERSION_RATE
end
```

Why it is better:
- It might not seem much, but using constant makes updating so much simpler as we only have to update it in one place instead of finding all the instances (this multiplies with its usage count)
- 100% lead to improved contextualization

---

## Replace Type Code with Class {/*replace-type-code-with-class*/}

> Replace the type with a new class

Sign(s) of code smell:
- A class has a numeric type code that does not affect its behavior.

```ruby
# Before
class Employee
  BACKEND = 'Backend Developer'
  FRONTEND = 'Frontend Developer'
  TITLE_OPTIONS = [BACKEND, FRONTEND]

  def initialize(title)
    @title = title
  end
end

Employee.new(Employee::BACKEND)
```

```ruby
# After
class Employee
  def initialize(title)
    @title = title
  end
end

class Title
  BACKEND = 'Backend Developer'
  FRONTEND = 'Frontend Developer'
  OPTIONS = [BACKEND, FRONTEND]
end

Employee.new(Title::BACKEND)
```

Why it is better:
- Keep `Employee` class small and readable

---

## Encapsulate Collection {/*encapsulate-collection*/}

> Make it return a read-only view + provide add/remove methods

Sign(s) of code smell:
- A method returns a collection

```ruby
# Before
class Company
  attr_accessor :people

  def initialize
    @people = []
  end
end

c = Company.new
c.people = [Person.new('Adrian'),
            Person.new('Goh')]
```

```ruby
# After
class Company
  attr_reader :people

  def initialize
    @people = []
  end
  
  def add_person(person)
    # perhaps some logic to validate if person can be added
    @people << person
  end
end

c = Company.new
c.add_person(Person.new('Adrian'))
c.add_person(Person.new('Goh'))
```

Why it is better:
- Preserve attribute's integrity e.g. Avoid adding an object that's not `Person` into `people`
- Avoid revealing too much to clients about the object's internal data structures.
