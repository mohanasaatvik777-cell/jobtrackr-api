## Day 6: MongoDB

### 1. Embedding vs referencing: how do you decide?
Embedding: means here we are storing in the documnet itself. Like in the user document an array of there all order.
Referencing: Here we are linking two diff table like not inside the document with the id. Like flipkart table of the particular product users who buied it, in such a way like with the referencing the id of the users.

### 2. Why do queries get slow, and how do indexes help? What is the cost?
When the database is using the COLLSCAN , then i need to scan every document to find out of 1000. But due to index i.e IXSCAN we can simple reach out to what we want.
cost: slower write latency, disk overhead ,RAM consumption.


### 3. SQL vs NoSQL: when would you choose each?
SQL: is chossen when the structure is concrete, no changes in the structure at the middle.Ex:- bank details storage
NOsql: if the structure varies and needd to be flexible in that case we will be using.Ex: instagram database.