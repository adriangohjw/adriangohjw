---
title:  "Chapter 10:  Making Method Calls Simpler"
---

## Rename Method {/*rename-method*/}

> Change the name of the method

Sign(s) of code smell:
- The name of the method does not accurately reveal its purpose.

```ruby
# Before
def telephone_number
  "#{office_area_code} #{office_number}"
end
```

```ruby
# After
def office_telephone_number
  "#{office_area_code} #{office_number}"
end
```

Why it is better:
- Less likely for the code to be called wrongly

Note:
- A good way to do this is to think what the comment for the method would be and turn that comment into the name of the method

---

## Separate Query from Modifier {/*separate-query-form-modifier*/}

> Split the method into 2 - Query & Modifier

Sign(s) of code smell:
- You have a method that returns a value but also changes the state of an object.

```ruby
# Before
def original_method(people)
  for person in people
    if person.name == 'Adrian'
      method_with_side_effects
      return 'Adrian'
    end
  end

  'Not found'
end

# Using it...
result = found_developer(people) 
```

```ruby
# After

# Step 1: Create new method without the side effect
def found_developer_without_side_effect(people)
  for person in people
    if person.name == 'Adrian'
      return 'Adrian'
    end
  end

  'Not found'
end

# Step 2: Update original method to remove void instead
def original_method_but_side_effect_only(people)
  for person in people
    if person.name == 'Adrian'
      method_with_side_effects
      return
    end
  end

  return
end

# Using it...
original_method_but_side_effect_only(people)
result = found_developer_without_side_effect(people)

```

Why it is better:
- Able to reuse the Query method
- Having a method that does too many things violates the SRP (Single Responsibility Principle)
- Simplify the original method and open up more room for further refactoring

Note:
- A good rule to follow is that methods that return a value should not have observable side effects.
- Here's my opinion on the above approach:
  - It is error-proof and straightforward, but I find that there are probably other approaches that can achieve the same while keeping the code cleaner.
  - What I dislike is that you ended up with 2 codes with similar logic, making it easily forgettable to update both.

---

## Parameterize Method {/*parameterize-method*/}

> Create one method that uses a parameter for the different values

Sign(s) of code smell:
- Several methods do similar things but with different values contained in the method body.

<b>An obvious situation to spot</b>

```ruby
# Before
class Employee
  def five_percent_raise
    salary *= 1.05
  end
  
  def ten_percent_raise
    salary *= 1.1
  end
end
```

```ruby
# After
class Employee
  def raise(percentage)
    salary *= (1 + percentage / 100)
  end
end
```

<b>An less obvious situation to spot</b>

```ruby
# Before
def base_charge
  result = [last_usage, 100].min * 0.03
  if last_usage > 100
    result += ([last_usage, 200].min - 100) * 0.05 
  end
  if last_usage > 200
    result += (last_usage - 200) * 0.07
  end
end
```

```ruby
# After
def base_charge
  result = usage_in_range(start_value: 0, end_value: 100) * 0.03
  result += usage_in_range(start_value: 100, end_value: 200) * 0.05
  result += usage_in_range(start_value: 200)
end

def usage_in_range(start_value:, end_value: nil)
  return 0 if last_usage <= start_value

  [last_usage, end_value].compact.min - start_value
end
```

Why it is better:
- Reduce code duplication
- Increase flexibility

---

## Replace Parameter with Explicit Methods {/*replace-parameter-with-explicit-methods*/}

> Create a separate method for each value of the parameter

Sign(s) of code smell:
- You have a method that runs different codes depending on the values of an enumerated parameter.

```ruby
# Before
class SomeClass
  HEIGHT = 'height'
  WEIGHT = 'weight'

  def set_value(name, value)
    case name
    when HEIGHT
      height = value
    when WEIGHT
      weight = value
    end
  end
end

adrian.set_value(SomeClass::HEIGHT, 174)
```

```ruby
# After
class SomeClass
  def set_height(value)
    height = value
  end

  def set_weight(value)
    weight = value
  end
end

adrian.set_height(174)
```

Why it is better:
- Code interface (parameters) are cleaner - anyone can use it without having to refer to the class to determine a valid parameter value.
- Having a method that does too many things violates the SRP (Single Responsibility Principle)
- Possibly clean up more code by removing constants used

Note:
- You shouldn't use this when the parameter values are likely to change a lot.
- If you need conditional behaviour, you need <b>Replace Conditional with Polymorphism</b>.

---

## Preserve Whole Object {/*preserve-whole-object*/}

> Send the whole object instead

Sign(s) of code smell:
- Getting several values from an object and passing these values as parameters in a method call.

```ruby
# Before
within_range(temp.low, temp.high)
```

```ruby
# After
within_range(temp)
```

Why it is better:
- If the called object needs new data values later, you don't have to change the calls to this method.
- Improves readability by eliminating long parameter list
- Avoid code duplication

Note:
- Downside: Method is dependent on the object
- Does not benefit if you only need one value instead of the whole object

---

## Replace Parameter with Method {/*replace-parameter-with-method*/}

> Remove the parameter and let the receiver invoke the method

Sign(s) of code smell:
- An object invokes a method, then passes the result as a parameter for a method.

```ruby
# Before
base_price = quantity * item_price
discount = compute_discount()
final_price = discounted_price(base_price, discount)

def discounted_price(base_price, discount)
  # ...
end
```

```ruby
# After
base_price = quantity * item_price
final_price = discounted_price(base_price)

def discounted_price(base_price)
  discount = compute_discount()
  # ...
end
```

Why it is better:
- Improves readability by eliminating long parameter list

Note:
- Not possible if the calculation relies on a parameter of the calling method

---

## Introduce Parameter Object {/*introduce-parameter-object*/}

> Replace a group of parameters that naturally go together with an object

Sign(s) of code smell:
- You have a group of parameters that naturally go together
- Several methods may use this group of parameters

```ruby
# Before
def amount_invoiced_in(start_date, end_date)
  # ...
end
```

```ruby
# After
def amount_invoiced_in(date_range)
  # ...
end

class DateRange
  attr_accessor :start_date, :end_date

  def initialize(start_date, end_date)
    @start_date = start_date
    @end_date = end_date
  end
end
```

Why it is better:
- Make it easier to spot behaviour that can also be moved into the new class
- Defined accessors on the new object make the code more consistent

---

## Hide Method {/*hide-method*/}

> Hide the method (make it protected / private)

Sign(s) of code smell:
- Method not used outside of the class

```ruby
# Before
class MyClass
  def self.class_method_used_everywhere
  end
  
  def instance_method_used_everywhere
  end

  def self.class_method_used_within_class_only
  end

  def instance_method_used_within_class_only
  end
end
```

```ruby
# After

class MyClass
  def self.class_method_used_everywhere
  end
  
  def instance_method_used_everywhere
  end

  private_class_method :class_method_used_within_class_only
  def self.class_method_used_within_class_only
  end

  private

  def instance_method_used_in_class_only
  end
end
```

Why it is better:
- It indirectly explained which methods should not be accessed publicly

Note:
- The above example is just one of the many ways to declare class methods as private

---
>

## Replace Constructor with Factory Method {/*replace-constructor-with-factory-method*/}

> Replace the constructor with a factory method

Sign(s) of code smell:
- You want to do more than simple construction when you create an object

```ruby
# Before
class Employee
  def initialize(type)
    case type
    when ENGINEER
      Engineer.new
    when SALESMAN
      Salesman.new
    when MANAGER
      Manager.new
    end
  end
end

employee = Employee.new(Employee::ENGINEER)
```

```ruby
# After
# Solution 1
class Employee
  def self.create(type)
    Object::const_get(type).new
  end
end

employee = Employee.create('Engineer')

# Solution 2
class Employee
  def self.create_engineer
    Engineer.new
  end
end

employee = Employee.create_engineer
```

Why it is better:
- Removes the need to update the create method as we add new subclasses

Note:
- Related to <b>Replace Type Code with Subclasses</b>
- The downside for Solution 1:
  - More prone to error, especially typo error
  - Expose subclass names to clients

---

## Replace Error Code with Exception {/*replace-error-code-with-exception*/}

> Throw an exception instead

Sign(s) of code smell:
- A method returns a special code to indicate an error

```ruby
# Before
def withdraw(amount)
  return nil if amount > balance
  balance -= amount
end
```

```ruby
# After
def withdraw(amount)
  raise StandardError.new('Insufficient balance') if amount > balance
  balance -= amount
end
```

Why it is better:
- The caller will be aware when the operation throws an error, and may pass the error up the chain.

Note:
- You can (and probably should) create custom exceptions instead

---

## Replace Exception with Test {/*replace-exception-with-test*/}

> Change the caller to make the test first

Sign(s) of code smell:
- Throwing a checked exception on a condition the caller could have checked first.

```ruby
# Before
def value_for_period(period_number)
  values[period_number]
rescue ArrayIndexOutOfBoundsException
  0
end
```

```ruby
# After
def value_for_period(period_number)
  return 0 if period_number >= values.count
  values[period_number]
end
```

Why it is better:
- Exceptions should be used for exceptional behaviour - behaviour that is an unexpected error, and not acts as a substitute for conditional tests. If you can reasonably expect the caller to check the condition before calling the operation, you should provide a test.

Note:
- I am on the fence about this. I feel like it adds more distraction to someone reading it by bloating up the logic portion of the code. Think about it, as opposed to being focused on `values[period_number]`, you are now bothered by the checks, which worsen the time taken for someone to comprehend what this code does.
