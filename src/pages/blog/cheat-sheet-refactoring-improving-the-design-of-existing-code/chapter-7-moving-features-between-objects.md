---
title:  "Chapter 7: Moving Features Between Objects"
---

Generally, we aim to ensure that each field and method are placed in the correct classes and objects, ensuring that responsibilities belong to its rightful owner. The refactoring approaches in this chapter address these code smells and closely enforces SOLID's SRP (Single Responsibility Principle). Also, this often led to small and concise classes, improving readability.

<i>Note: For this chapter, I will be borrowing some concepts from ActiveRecord (Rails' ORM) to easier illustrate some of the pointers</i>

---

## Move Method {/*move-method*/}

> Move the method into the class that uses it most + Turn the old method into a simple delegation, or remove it altogether

Sign(s) of code smell:
- A method is or will be, using or used by more features of another class than the class on which it
is defined.

```ruby
# Before
class Account
  attr :days_overdrawn
  has_one :account_type, class_name: AccountType.to_s

  def overdraft_charge
    return days_overdrawn * 1.5 if account_type.premium?
    days_overdrawn * 2
  end
end

class AccountType
  belongs_to :account, class_name: Account.to_s
  # ...
end
```

```ruby
# After
class Account
  attr :days_overdrawn
  has_one :account_type, class_name: AccountType.to_s

  def overdraft_charge
    account_type.overdraft_charge
  end
end

class AccountType
  belongs_to :account, class_name: Account.to_s

  def overdraft_charge
    return account.days_overdrawn * 1.5 if premium?
    account.days_overdrawn * 2
  end
end
```

Why it is better:
- This sets a better foundation for cleaner code down the road too, especially if there are multiple `AccountType` and each has its implementation of `overdraft_charge`. We can use [Replace Conditional with Polymorphism](https://refactoring.guru/replace-conditional-with-polymorphism), which follows the SOLID's Open-Closed Principle very closely.

---

## Move Field {/*move-field*/}

> Move the field into the class that uses it the most

Sign(s) of code smell:
- A field is, or will be, used by another class more than the class on which it is defined.

```ruby
# Before
class Account
  attr :interest_rate
  has_one :account_type, class_name: AccountType.to_s

  def interest(amount, days)
    interest_rate * amount * days
  end
end

class AccountType
  belongs_to :account, class_name: Account.to_s
  # ...
end
```

```ruby
# After
class Account
  has_one :account_type, class_name: AccountType.to_s

  # Solution 1
  def interest(amount, days)
    account_type.interest_rate * amount * days
  end

  # Solution 2 
  def interest(amount, days)
    interest_rate * amount * days
  end

  def interest_rate
    account_type.interest_rate
  end
end

class AccountType
  attr :interest_rate
  belongs_to :account, class_name: Account.to_s
  # ...
end
```

Why it is better:
- Similar to "Move Method"

Note:
- Solution 1 is the more preferred refactoring as `interest_rate` is removed from the class altogether, and no additional method has been introduced
- However, Solution 2 is "safer" and more recommended if there are insufficient test coverages, as there's a much lower chance of things breaking.

---

## Extract Class {/*extract-class*/}

> Extract logics into a new class

Sign(s) of code smell:
- Classes overly bloated with methods that don't really fall under its concern and responsibilities

```ruby
# Before
class Person
  attr :area_code, :office_number

  def telephone_number
    "(#{@area_code} #{@office_number})"
  end
end
```

```ruby
# After
class Person
  attr :area_code, :office_number

  def telephone_number
    TelephoneNumber.new(@area_code, @office_number).call
  end
end

class TelephoneNumber
  def initialize(area_code, office_number)
    @area_code = area_code
    @office_number = office_number
  end

  def call
    "(#{@area_code} #{@office_number})"
  end
end
```

Why it is better:
- This is similar to using [Value Objects to avoid Primitive Obsession](/blog/value-objects-to-avoid-primitive-obsession)
  - Improve readability
  - Business logics are abstracted and hidden away

---

## Hide Delegate (+ Remove Middle Man) {/*hide-delegate-and-remove-middle-man*/}

> Create a new method to hide delegate class from client

Sign(s) of code smell:
- A client is calling a delegate class of an object.

```ruby
# Before
class Person
  belongs_to :department, class_name: Department.to_s
end

class Department
  attr :manager
end

manager = john.department.manager
```

```ruby
# After
class Person
  belongs_to :department, class_name: Department.to_s

  def manager
    department.manager
  end
end

class Department
  attr :manager
end

manager = john.manager
```

Why it is better:
- Abstract logic on how the `Department` class works and hide it away from the client 

Note:
- IMO, I see a minimal benefit when the delegate class is immediate, especially at the cost of adding a method. However, the benefit multiplies with the number of delegation e.g. `john.department.manager.previous_job.salary`
- However, if you are using templating engines (like ERB for Rails) that allow the client to access the backend, this will be a great practice to separate the logic from the client.
- If the benefit is negligible, we can reverse it with <b>Remove Middle Man</b> (explanation skipped)

---

## Introduce Local Extension {/*introduce-local-extension*/}

> Create a new class (subclass OR wrapper) as an extension of the original class

Sign(s) of code smell:
- A server class you are using needs several additional methods, but you can't modify the class.

```ruby
# Before
class JobListing
  # ...
end

def annual_salary_from_monthly(monthly_salary)
  monthly_salary * 12
end

j = JobListing.new
a = annual_salary_from_monthly(j.monthly_salary)
```

```ruby
# After (with subclass)
class JobListingInheritance < JobListing
  def annual_salary
    monthly_salary * 12
  end
end

j = JobListingInheritance.new
a = j.annual_salary
```

```ruby
# After (with wrapper class)
class JobListingWrapper
  def initialize(job_listing)
    @job_listing = job_listing
  end

  def annual_salary
    @job_listing.monthly_salary * 12
  end
end

j = JobListing.new
a = JobListingWrapper.new(j).monthly_salary
```

Why it is better:
- Replaces `annual_salary_from_monthly` by and
  - Give it a better name
  - Restraining it such that it won't be used in the wrong context

Note:
- The issue with using a wrapper class is that it is no longer the same instance and class as the original class. `inheritance.is_a?(JobListing)` will return true while `wrapper.is_a?(JobListing)` will return false.
