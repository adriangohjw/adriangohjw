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

## Indexes

### When to use indexes

#### Cardinality

Number of unique values in a column

`SELECT COUNT(DISTINCT column_name) FROM table_name;`

#### Selectivity

Ratio (number of unique values / total number of values)

`SELECT COUNT(DISTINCT column_name) / COUNT(*) FROM table_name;`

- Higher selectivity = more efficient index (e.g., primary key)
- For example, for 1 million users and 10 unique countries, selectivity is 0.00001, indicating low index efficiency.
- However, if there's 1 million users and 2 unique countries (99% Singapore, 1% Malaysia), while selectivity is low at 0.000002, adding index will improve performance if we are querying for the minority (users in Malaysia), but not for the majority (users in Singapore).

### Partial Indexes

If we still want to add index, we can use `WHERE` to limit the rows to include in the index.

For this example, if we have multiple rows of users with same email but frequently search for active users, we can add index to only include rows where `deleted_at` is `NULL`.

```sql
CREATE INDEX my_index
ON users (deleted_at)
WHERE deleted_at IS NOT NULL;
```

### Composite Indexes

- Orders matter for composite indexes
  - Equality on the left, range scans on the right
  - e.g. `CREATE INDEX example_index ON users (first_name, last_name, birthday);`. 
- Not always true, but a single composite indexes are more efficient than multiple single-column indexes
  - Composite indexes is faster when using a `AND` in WHERE clause
  - However, multiple single-column indexes are faster when using a `OR` in WHERE clause

### Covering Indexes

Indexes that include all the columns needed for a query (SELECT, WHERE, ORDER BY, etc.)

For example, we need `first_name`, `last_name`, and `id` in this query

```sql
SELECT first_name, last_name, id
FROM users
WHERE first_name = 'John' AND last_name = 'Doe';
```

A covering index for this query would be
```sql
CREATE INDEX my_index ON
users (first_name, last_name, id);
```

However, we might want to exclude `id` in the index since it's not used in the query. Instead, we can use `INCLUDE`.

```sql
CREATE INDEX my_index
ON users (first_name, last_name)
INCLUDE (id);
```

The upsides are:
- Smaller index size + Avoid b-tree bloat
- Improved INSERT/UPDATE performance

### Ordering indexes

```sql
CREATE INDEX my_index
ON users (created_at, deleted_at)
```
This above index will be used when doing:
- `... ORDER BY created_at ASC, deleted_at ASC`
- `... ORDER BY created_at DESC, deleted_at DESC` (backward index scan)

However, if we order in different direction e.g. `created_at ASC, deleted_at DESC`, the index will not be used. To do that, we need to add ordering in the index.

```sql
CREATE INDEX my_index
ON users (created_at ASC, deleted_at DESC)
```
This index will be used for both:
- `... ORDER BY created_at ASC, deleted_at DESC`
- `... ORDER BY created_at DESC, deleted_at ASC` (backward index scan)

But by doing so, it then won't be used when we order by both ASC/DESC.

#### NULLS

By default, (when doing `ASC`) `NULLs` are ordered last as they are the largest value.

We can override this by using `NULLS FIRST` (or `NULLS LAST` when doing `DESC`).
```sql
CREATE INDEX my_index
ON users (created_at ASC NULLS FIRST)
```

### Functional Indexes

Indexes that use a function to create the index key.

```sql
CREATE INDEX my_index
ON users (split_part(email, '@', 2))
```

This index will be used for queries like `... WHERE split_part(email, '@', 2) = 'gmail.com'`.

NOTE: This index will only be used when the query is exactly the same as the index. It won't be used for queries like `... WHERE split_part(email, '@', 1)`

Nevertheless, still useful in cases where a 3rd party system is querying the data in ways where we have no control over the query since we are still able to add the index.

### Hash Indexes

By default, indexes are B-tree indexes.

Hash indexes are faster for equality checks (e.g. `WHERE column = 'value'`) but not used for range scans (e.g. `WHERE column > 'value'`).

Rule of thumb: ONLY use hash indexes when:
1) columns that are used in equality checks (or `IN` clause)
2) dealing with a very large number of rows

## Understanding Query Plans

### Scan Types

Reading rows from physical disk is expensive, so we want to minimize the number of disk reads. Here's the order from slowest to fastest:

| Scan Type | Description |
|-|-|
| Sequential | Read the entire table in physical order |
| Bitmap index | Scans the index, produces a map, then reads pages in physical order |
| Index | Scans the index, then reads pages (without any order) |
| Index only | Scans the index (RE: Covering Index) |

### Reading output

Example:
`Bitmap Heap Scan on users (cost=33356.31..18398.43 rows=108889 width=76)`

| Metric | Value | Description |
|-|-|-|
| startup cost | 33356.31 | Before starting the scan<br>Need to wait for all children nodes to complete |
| total cost | 18398.43 | Inclusive of cost of children nodes |
| rows | 108889 | Estimated number of rows it will return to parent node |
| width | 76 | Estimated number of bytes returned per row |

Note: total cost will be thrown off if we use a LIMIT in the query (and no ORDER BY). For example, the parent node (LIMIT) has a lower total cost than the children nodes (Seq Scan)

![](/assets/mastering-postgres/query-plan-limit.png)

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
