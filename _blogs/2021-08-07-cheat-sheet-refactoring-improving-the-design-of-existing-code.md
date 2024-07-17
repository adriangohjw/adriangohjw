---
layout: blog
title:  "[Cheat Sheet] Refactoring: Improving the Design of Existing Code"
date:   2021-08-07 18:08:00 +0800
image: /assets/refactoring-cheat-sheet-cover.png
categories: blogs
tags: [refactoring]
---

[cover]:            /assets/refactoring-cheat-sheet-cover.png

![][cover]

Recently, I started reading <b>Refactoring: Improving the Design of Existing Code</b> by Martin Fowler. I thought it would be useful to translate my learnings into bite-size content in Ruby for future references.

Note:
- As the source is in Java, I have modified the code to make more sense in Ruby
- As I am trying to keep this concise such that my future self can easily refer to it (hi future self if you are reading this), I will be skipping the implementation steps as I find it to be rather straightforward once we grasped the concept.

## <b>Why I recommend this book</b>

<b>1) Refactoring techniques are small</b>

They can take a few minutes to an hour at most (depends on the health of the codebase).
- Lots of <b>quick wins</b> and instant satisfaction!
- No need to convince non-engineering management to stop progress to make the changes.

<b>2) Suitable for all</b>

- Even someone with basic development experience can learn and apply the techniques
- While the book is in Java, most of the concepts are universal and rather <b>language agnostic</b>.

<b>3) Objectively better</b>

Most approaches are objectively an improvement and do not require any degree of agreement among the engineering team

## <b>Table of Content</b>
- [Chapter 6: Composing Methods](#chapter-6-composing-methods)
  - Extract Method
  - Introduce Explaining Variable
  - Inline Method
  - Replace Temp with Query
  - Split Temporary Variable
  - Remove Assignments to Parameters
  - Replace Method with Method Object
- [Chapter 7: Moving Features Between Objects](#chapter-7-moving-features-between-objects)
  - Move Method
  - Move Field
  - Extract Class
  - Hide Delegate (+ Remove Middle Man)
  - Introduce Local Extension
- [Chapter 8: Organizing Data](#chapter-8-organizing-data)
  - Replace Data Value with Object
  - Replace Array with Object
  - Replace Magic Number with Symbolic Constant
  - Replace Type Code with Class
  - Encapsulate Collection
- [Chapter 9: Simplifying Conditional Expressions](#chapter-9-simplifying-conditional-expressions)
  - Decompose Conditional
  - Consolidate Conditional Expression
  - Consolidate Duplicate Conditional Fragments
  - Remove Control Flag
  - Replace Nested Conditional with Guard Clauses
  - Replace Conditional with Polymorphism
  - Introduce Null Object
  - Introduce Assertion
- [Chapter 10: Making Method Calls Simpler](#chapter-10-making-method-calls-simpler)
  - Rename Method
  - Separate Query from Modifier
  - Parameterize Method
  - Replace Parameter with Explicit Methods
  - Preserve Whole Object
  - Replace Parameter with Method
  - Introduce Parameter Object
  - Hide Method
  - Replace Constructor with Factory Method
  - Replace Error Code with Exception
  - Replace Exception with Test
- [Chapter 11: Dealing with Generalization](#chapter-11-dealing-with-generalization)
  - Extract Subclass
  - Extract Superclass
  - Replace Inheritance with Delegation
  - Replace Delegation with Inheritance

---
<br>

## <b>Chapter 6: Composing Methods</b>

### <b>>> Extract Method</b>

<b>TL;DR: Turn the fragment into a method whose name explains the purpose of the method</b>

Sign(s) of code smell:
- The method is too long
- Code requires comment to understand its purpose

```ruby
# Before
def printOwing(amount)
  print_banner

  # print details
  puts("name: #{name}")
  puts("amount: #{amount}")
end
```

```ruby
# After
def printOwing(amount)
  print_banner
  print_details(amount)
end

def print_details(amount)
  puts("name: #{name}")
  puts("amount: #{amount}")
end
```

Why it is better:
- Code can be reused
- Improves readability
- Possible to test code in parts

Note:
- Descriptive method names are needed

---<br>

### <b>>> Introduce Explaining Variable</b>

<b>TL;DR: Put the result of a complicated expression, or parts of it, in a temporary variable</b>

Sign(s) of code smell:
- Expression is long, complicated and hard-to-read (usually conditional statement)

```ruby
# Before
if ((platform.upcase.index_of('MAC') > -1) &&
    (browser.upcase.index_of('IE') > -1) &&
    resize > 0)
  # ...
end
```

```ruby
# After
is_platform_mac = platform.upcase.index_of('MAC') > -1
is_browser_ie = browser.upcase.index_of('IE') > -1
was_resized = resize > 0

if (is_platform_mac && is_browser_ie && was_resized)
  # ...
end
```

Why it is better:
- Improves readability

Note:
- Almost always, able to refactor using Extract Method instead. This is preferred only when there are many local variables, making it difficult to extract

---<br>

### <b>>> Inline Method</b>

<b>TL;DR: Put the method's body into the body of its callers and remove the method.</b>

Sign(s) of code smell:
- The method name is as clear as its implementation

```ruby
# Before
def rating
  more_than_5_late_deliveries? ? 2 : 1
end

def more_than_5_late_deliveries?
  late_deliveries.count > 5
end
```

```ruby
# After
def rating
  late_deliveries.count > 5 ? 2 : 1
end
```

Why it is better:
- Needless indirection is harder to read

---<br>

### <b>>> Replace Temp with Query</b>

<b>TL;DR: Extract expression into a method and replace all temp references with it</b>

Sign(s) of code smell:
- Temps are local --> likely to be useless without the context of the method they are in

```ruby
# Before
def some_method
  # ...
  base_price = quantity * item_price
  if base_price > 1000
    return base_price * 0.95
  else
    return base_price * 0.98
  end
end
```

```ruby
# After
def some_method
  # ...
  if base_price > 1000
    return base_price * 0.95
  else
    return base_price * 0.98
  end
end

def base_price
  quantity * item_price
end
```

Why it is better:
- Logic is abstracted and you don't have to worry about its implementation
- Code can be reused
- Cleaned up code likely to open up room for more and easier refactorings

Note:
- Most of the time, performance degradation is very much negligible

---<br>

### <b>>> Split Temporary Variable</b>

<b>TL;DR: Make a separate temporary variable for each assignment</b>

Sign(s) of code smell:
- A temporary variable is assigned to more than once but is not a loop variable nor a collecting temporary variable

```ruby
# Before
temp = 2 * (height + width)
puts(temp)
temp = height * width
puts(temp)
```

```ruby
# After
perimeter = 2 * (height + width)
puts(perimeter)
area = height * width
puts(area)
```

Why it is better:
- Ensure each variable follows SRP (Single Responsibility Principle)
- Reusing a temp for multiple things are confusing for readers
- More likely lead to better naming of the variables

---<br>

### <b>>> Remove Assignments to Parameters</b>

<b>TL;DR: Use a temporary variable instead</b>

Sign(s) of code smell:
- Parameters have been reassigned (especially if it refers to a completely different object)

```ruby
# Before
def discount(value)
  value = 2 if value > 50
  # ...
end
```

```ruby
# After
def discount(value)
  result = value
  result = 2 if value > 50
  # ...
end
```

Why it is better:
- Much clearer if you use only the parameter to represent what has been passed in because that is a consistent usage

---<br>

### <b>>> Replace Method with Method Object</b>

<b>TL;DR: Turn the method into its object so that all the local variables become fields on that object.
You can then decompose the method into other methods on the same object.</b>

Sign(s) of code smell:
- The method is long with many local variables that cannot be extracted

```ruby
# Before
class Account
  # Note: Don't worry about what this logic means, it doesn't matter
  def discount(value, quantity)
    a = (value * quantity) + delta
    b = (value + quantity) + 100
    b -= 20 if a > 100
    c = b * 7
    # and so on
  end

  def delta
    # ...
  end
end
```

```ruby
# After
class Account
  def some_function(value, quantity)
    Discount.new(self, value, quantity).call
  end

  def delta
    # ...
  end
end

class Discount
  def initialize(account, value, quantity)
    @account = account
    @value = value
    @quantity = quantity
  end

  def call
    a = (@value * @quantity) + @account.delta
    b = (@value + @quantity) + 100
    b -= 20 if a > 100
    c = b * 7
    # and so on
  end
end
```

Why it is better:
- Can refactor `call` into smaller methods given that logic is encapsulated in the `Discount` object

---
<br>

## <b>Chapter  7: Moving Features Between Objects</b>

Generally, we aim to ensure that each field and method are placed in the correct classes and objects, ensuring that responsibilities belong to its rightful owner. The refactoring approaches in this chapter address these code smells and closely enforces SOLID's SRP (Single Responsibility Principle). Also, this often led to small and concise classes, improving readability.

<i>Note: For this chapter, I will be borrowing some concepts from ActiveRecord (Rails' ORM) to easier illustrate some of the pointers</i>

### <b>>> Move Method</b>

<b>TL;DR: Move the method into the class that uses it most + Turn the old method into a simple delegation, or remove it altogether</b>

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

---<br>

### <b>>> Move Field</b>

<b>TL;DR: Move the field into the class that uses it the most</b>

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

---<br>

### <b>>> Extract Class</b>

<b>TL;DR: Extract logics into a new class</b>

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
- This is similar to using [Value Objects to avoid Primitive Obsession](/2021-05-26-value-objects-to-avoid-primitive-obsession)
  - Improve readability
  - Business logics are abstracted and hidden away

---<br>

### <b>>> Hide Delegate (+ Remove Middle Man)</b>

<b>TL;DR: Create a new method to hide delegate class from client</b>

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

---<br>

### <b>>> Introduce Local Extension</b>

<b>TL;DR: Create a new class (subclass OR wrapper) as an extension of the original class</b>

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

---
<br>

## <b>Chapter  8: Organizing Data</b>

### <b>>> Replace Data Value with Object</b>

<b>TL;DR: Turn the data item into an object</b>

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
- This has been explained in greater detail in [Value Objects to avoid Primitive Obsession](/2021-05-26-value-objects-to-avoid-primitive-obsession)
  - Improved Readability
  - Business logics are abstracted and hidden away
  - The class can be extended easily

---<br>

### <b>>> Replace Array with Object</b>

<b>TL;DR: Replace the array with an object that has a field for each element</b>

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

---<br>

### <b>>> Replace Magic Number with Symbolic Constant</b>

<b>TL;DR: Replace the number with a constant instead</b>

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

---<br>

### <b>>> Replace Type Code with Class</b>

<b>TL;DR: Replace the type with a new class</b>

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

---<br>

### <b>>> Encapsulate Collection</b>

<b>TL;DR: Make it return a read-only view + provide add/remove methods.</b>

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

---
<br>

## <b>Chapter  9: Simplifying Conditional Expressions</b>

### <b>>> Decompose Conditional</b>

<b>TL;DR: Extract methods in conditions</b>

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

---<br>

### <b>>> Consolidate Conditional Expression</b>

<b>TL;DR: Extract conditional tests with the same results into a single conditional expression</b>

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

---<br>

### <b>>> Consolidate Duplicate Conditional Fragments</b>

<b>TL;DR: Move the repeated code fragment outside of the branch</b>

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

---<br>

### <b>>> Remove Control Flag</b>

<b>TL;DR: Use a break or return instead.</b>

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

---<br>

### <b>>> Replace Nested Conditional with Guard Clauses</b>

<b>TL;DR: Use guard clauses for all the special cases.</b>

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

---<br>

### <b>>> Replace Conditional with Polymorphism</b>

<b>TL;DR: Move each leg of the conditional to an overriding method in a subclass</b>

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

---<br>

### <b>>> Introduce Null Object</b>

<b>TL;DR: Replace the null value with a null object</b>

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

---<br>

### <b>>> Introduce Assertion</b>

As it's less relevant for Ruby, I have replaced it with "Raising Exception", which is conceptually similar.

<b>TL;DR: Make assumption explicit with an exception</b>

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

---
<br>

## <b>Chapter  10: Making Method Calls Simpler</b>

### <b>>> Rename Method</b>

<b>TL;DR: Change the name of the method</b>

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

---<br>

### <b>>> Separate Query from Modifier</b>

<b>TL;DR: Split the method into 2 - Query & Modifier</b>

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

---<br>

### <b>>> Parameterize Method</b>

<b>TL;DR: Create one method that uses a parameter for the different values.</b>

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

---<br>

### <b>>> Replace Parameter with Explicit Methods</b>

<b>TL;DR: Create a separate method for each value of the parameter.</b>

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

---<br>

### <b>>> Preserve Whole Object</b>

<b>TL;DR: Send the whole object instead.</b>

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

---<br>

### <b>>> Replace Parameter with Method</b>

<b>TL;DR: Remove the parameter and let the receiver invoke the method</b>

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

---<br>

### <b>>> Introduce Parameter Object</b>

<b>TL;DR: Replace a group of parameters that naturally go together with an object.</b>

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

---<br>

### <b>>> Hide Method</b>

<b>TL;DR: Hide the method (make it protected / private)</b>

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

---<br>
>

### <b>>> Replace Constructor with Factory Method</b>

<b>TL;DR: Replace the constructor with a factory method</b>

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

---<br>

### <b>>> Replace Error Code with Exception</b>

<b>TL;DR: Throw an exception instead</b>

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

---<br>

### <b>>> Replace Exception with Test</b>

<b>TL;DR: Change the caller to make the test first. </b>

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

---
<br>

## <b>Chapter  11: Dealing with Generalization</b>

I will be skipping several approaches here, as I found it to be the default good practice for OOP in general. This includes:
- Pull Up Field: Move similar fields across subclasses into the superclass
- Pull Up Method: Move similar methods across subclasses into the superclass
- Pull Up Constructor: Create a superclass constructor and call it from the subclass instead
- Push Down Field: Move fields in the superclass that's only relevant for subclasses into them
- Push Down Method: Move methods in the superclass that's only relevant for subclasses into them

---<br>

### <b>>> Extract Subclass</b>

<b>TL;DR: Create a subclass for the subset of features</b>

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

---<br>

### <b>>> Extract Superclass</b>

<b>TL;DR: Create a superclass and move the common features to the superclass.</b>

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

---<br>

### <b>>> Replace Inheritance with Delegation</b>

<b>TL;DR: Create a field for the superclass and adjust methods to delegate to the superclass</b>

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

---<br>

### <b>>> Replace Delegation with Inheritance</b>

<b>TL;DR: Make the delegating class a subclass of the delegate</b>

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

---