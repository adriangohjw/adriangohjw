---
layout: study
title:  "Mastering Postgres (by Aaron Francis)"
date:   2025-01-04 00:00:00 +0800
image: /assets/mastering-postgres/cover.png
categories: studies
tags: [postgres]
---

Just jotting down some quick notes and learnings from the [video course](https://masteringpostgres.com/) by Aaron Francis.

![](/assets/mastering-postgres/cover.jpg)

## Advanced Data Types

### Sequences

```sql
CREATE SEQUENCE IF NOT EXISTS users_id_seq
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
```

`SELECT NEXTVAL('users_id_seq');` will return the next value in the sequence.

`SELECT CURRVAL('users_id_seq');` will return the current value in the sequence.
- Note: This is "current value" of this session and not global value (not affected by other sessions)

`SELECT SETVAL('users_id_seq', 100);` will set the current value of the sequence to 100.
- Note: Be careful with using this. For example, avoid setting the sequence to an auto-incremented number already used as a primary key.

### Network and mac addresses

```sql
CREATE TABLE inet_examples (
    ip_address INET
);

INSERT INTO inet_examples (ip_address) VALUES
    ('192.168.1.10/24'), -- host address using subnet mask
    ('10.0.0.1'), -- host address without subnet mask
    ('::1/128'), -- IPv6 loopback address
    ('2001:db8::/32'), -- IPv6 network
    ('2001:0db8:85a3:0000:0000:8a2e:0370:7334/128'), -- IPv6 host address
```

![](/assets/mastering-postgres/network-and-mac-addresses.png)
 
### JSON / JSONB

TL;DR: always use JSONB

- JSON is stored as text under the hood, such as white spaces, new lines, etc.
- JSONB is larger in size but is more robust
  - remove extra white spaces, new lines, etc.
  - remove duplicate keys
  - reorder keys if needed (since keys are unordered in JSON)

### Array

`SELECT example_array[1] FROM ...`
- Will return the first element of the array.
- PG uses 1-based index for arrays (first element is at index 1)

`... WHERE example_array @> ARRAY['hello']`
- Will return all rows where the `example_array` contains `hello`

`... WHERE example_array && ARRAY['hello']`
- Will return all rows where the `example_array` overlaps with `['hello']`

`SELECT UNNEST(example_array) FROM ...`
- Will unnest the array into a set of rows.

### Generated Columns

- `STORED` means the generated column's value is saved on disk for quicker access, using more storage.
- We cannot manually update a generated column (will throw an error)

#### Example 1 (height conversion)

```sql
CREATE TABLE users (
    height_cm numeric,
    height_in numeric GENERATED ALWAYS AS
        (height_cm / 2.54) STORED
);
```

#### Example 2 (email domain extraction)

```sql
CREATE TABLE users (
    email text,
    email_domain text GENERATED ALWAYS AS
        (split_part(email, '@', 2)) STORED
);
```

#### Example 3 (text to tsvector)

```sql
CREATE TABLE posts (
    body text,
    search_vector_en tsvector GENERATED ALWAYS AS 
        (to_tsvector('english', body)) STORED
);
```

### Range

- `[` and `]` is inclusive, `(` and `)` is exclusive

```sql
CREATE TABLE range_examples (
    int_range int4range, -- integer range (discrete integer values)
    num_range numrange, -- numeric range (includes decimal)
    date_range daterange, -- date range
    ts_range tsrange -- timestamp range
);
```

`... WHERE int_range @> 5`
- Will return all rows where the `int_range` contains `5`

`... WHERE int_range && '[3, 7]'`
- Will return all rows where the `int_range` overlaps with `[3, 7]`
- e.g. can use exclusion too `... WHERE int_range && (3, 7)`

`SELECT int4range[10, 20] * int4range(15, 25) FROM ...`
- Will return the intersection of the two ranges (e.g. `[15, 21)`)

`SELECT '{[3,7], [8,9]}'::int4multirange`
- Will return a range containing 3,4,5,6,8,9 (7 is excluded)

### Composite Types

```sql
-- Define the type
CREATE TYPE address AS (
    street text,
    city text,
    state text,
    postal_code text
);

-- Create a table with the type
CREATE TABLE addresses (
    address address
);

-- Insert a row with the type
INSERT INTO addresses (address) VALUES
    ROW('123 Main St', 'Anytown', 'CA', '12345')::address;

-- Accessing the fields (bracket notation)
-- Without brackets, DB will think it's a table name and throw an error
SELECT (address).street FROM addresses;
```

## Others

### `RETURNING`

Reduces the need for another query to get the inserted data.

```sql
INSERT INTO
    orders (customer_name, order_date, total_amount) 
VALUES
('John Doe', '2024-01-01', 100.00)
RETURNING *; -- or RETURNING id (or other columns);
```
