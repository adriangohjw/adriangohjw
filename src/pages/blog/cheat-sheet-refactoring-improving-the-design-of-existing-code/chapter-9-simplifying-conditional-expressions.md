---
title:  "Chapter 9: Simplifying Conditional Expressions"
---

## Decompose Conditional {/*decompose-conditional*/}

> Extract methods in conditions

Sign(s) of code smell:
- You have a complicated conditional (if-then-else) statement.

```ruby
# Before
if date.before(SUMMER_START) || date.after(SUMMER_END)
  # ...
else
  # ...
end
```

```ruby
# After
def not_summer(date)
  date.before(SUMMER_START) || date.after(SUMMER_END)
end

if not_summer(date)
  # ...
else
  # ...
end
```

Why it is better:
- Simplification leads to improved readability and ease of understanding the reason for the branching

---

## Consolidate Conditional Expression {/*consolidate-conditional-expression*/}

> Extract conditional tests with the same results into a single conditional expression

Sign(s) of code smell:
- You have a sequence of conditional tests with the same result.

```ruby
# Before
def discount_percentage
  return 0 if age < 65
  return 0 if part_time
  # ...
end
```

```ruby
# After
def discount_percentage
  return 0 if not_eligible_for_discount?
  # ...
end

def not_eligible_for_discount?
  age < 65 || part_time
end
```

Why it is better:
- Makes the check clearer by doing a single check (keep original method small)

Note:
- Similarly, nested ifs can be combined using `&&`

---

## Consolidate Duplicate Conditional Fragments {/*consolidate-duplicate-conditional-fragments*/}

> Move the repeated code fragment outside of the branch

Sign(s) of code smell:
- The same fragment of code is in all branches of a conditional expression

```ruby
# Before
def is_special_deal?
  total = price * 0.8
  checkout
else
  total = price
  checkout
end
```

```ruby
# After
def is_special_deal?
  total = price * 0.8
else
  total = price
end
checkout
```

Why it is better:
- Makes it easier to spot rooms for subsequent refactoring

---

## Remove Control Flag {/*remove-control-flag*/}

> Use a break or return instead

Sign(s) of code smell:
- You have a variable that is acting as a control flag for a series of boolean expressions.

```ruby
# Before
def check_security(people)
  found = false
  for person in people
    unless found
      if person.eql?('Adrian')
        send_alert
        found = true
      end
    end
  end
end
```

```ruby
# After
def check_security(people)
  for person in people
    if person.eql?('Adrian')
      send_alert
      break
    end
  end
end
```

Why it is better:
- Reduce the number of nesting within a method

---

## Replace Nested Conditional with Guard Clauses {/*replace-nested-conditional-with-guard-clauses*/}

> Use guard clauses for all the special cases

Sign(s) of code smell:
- A method has conditional behaviour that does not make clear the normal path of execution.

```ruby
# Before
def pay_amount
  if dead?
    return dead_amount
  else
    if separated?
      return separated_amount
    else
      if retired?
        return retired_amount
      else
        return normal_amount
      end
    end
  end
end
```

```ruby
# After
def pay_amount
  return dead_amount if dead?
  return separated_amount if separated?
  return retired_amount if retired?

  normal_amount
end
```

Why it is better:
- Reduce the number of nesting within a method

---

## Replace Conditional with Polymorphism {/*replace-conditional-with-polymorphism*/}

> Move each leg of the conditional to an overriding method in a subclass

Sign(s) of code smell:
- You have a conditional expression that chooses different behaviour depending on the type of object.

```ruby
# Before
class Employee
  BASE_SALARY = 5000
  COMMISSION = 1000

  def salary
    case department
    when ENGINEERING
      BASE_SALARY
    when SALES
      BASE_SALARY + COMMISSION
    end
  end
end
```

```ruby
# After
class Employee
  def get_department
    case department
    when ENGINEERING
      EngineeringDepartment.new
    when SALES
      SalesDepartment.new
    end
  end

  def salary
    get_department.salary
  end
end

class Department
  BASE_SALARY = 5000
end

class EngineeringDepartment < Department
  def salary
    BASE_SALARY
  end
end

class SalesDepartment < Department
  COMMISSION = 1000

  def salary
    BASE_SALARY + COMMISSION
  end
end
```

Why it is better:
- Before, if you want to add a new type, you have to find and update all the conditionals. However, with subclasses, you just create a new subclass and provide the appropriate methods. Remember SOLID's OCP (Open/Closed Principle)?
- Clients (`Employee` in this case) don't need to know about the subclasses

Note:
- It might seem worth it as we are adding a lot of code, which I don't deny. However, the real benefit of this refactoring comes when the same conditional statement is repeated in multiple methods

---

## Introduce Null Object {/*introduce-null-object*/}

> Replace the null value with a null object

Sign(s) of code smell:
- Repeated checks for a null value

```ruby
# Before
class Order
  def get_customer
    customer
  end
end

c = order.get_customer
nationality = c.nationality || 'Singaporean'
plan = c.billing_plan || BillingPlan.new
```

```ruby
# After
class Order
  def get_customer
    customer || NullCustomer.new
  end
end

class NullCustomer < Customer
  def nationality
    'Singaporean'
  end

  def billing_plan
    BillingPlan.new
  end  
end

c = order.get_customer
nationality = c.nationality
plan = c.billing_plan
```

Why it is better:
- Skip the check for the object's value and just invoke the behaviour
- Refactoring can also be applied to similar use cases e.g. `UnknownCustomer`

Note:
- Here are some Ruby tricks that replace `@customer.nil? ? nil : @customer.name`
  - `@customer.try(:name)`
  - `@customer&.name`

---

## Introduce Assertion {/*introduce-assertion*/}

As it's less relevant for Ruby, I have replaced it with "Raising Exception", which is conceptually similar.

> Make assumption explicit with an exception

Sign(s) of code smell:
- A section of code assumes something about the state of the program.

```ruby
# Before
class Employee
  # ...

  def get_expense_limit
    # assumes project is not nil
    project.expense_limit
  end
end
```

```ruby
# After
class Employee
  # ...

  def get_expense_limit
    raise new StandardError.new('No project') if project.nil?
    project.expense_limit
  end
end
```

Why it is better:
- Often sections of code work only if certain conditions are true e.g. square root calculation's working only on a positive input value. Most often than not, these assumptions are not stated but can only be decoded by looking through an algorithm. Sometimes the assumptions are stated with a comment. A better technique is to make the assumption explicit by writing an assertion because failure will throw an error.

