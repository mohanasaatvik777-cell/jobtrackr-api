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

## Day 7
## 1. Authentication vs authorisation
Authentication means giving access for server, like a login. But authorization in that server what data that a particular can accessible and being restricted is done in the authorization tk.

## 2. JWT vs sessions with cookies
jwt is a token which will be last for the amount of time we keep it to not get expire, {expiresIn:"1d"} in this way, so that this token is used for every subsequent request for the data the user want to access from the server. While sssion is a cookie which will last until the session end, here cookies are provided in the server and used whenever user enters
## 3. XSS and CSRF
XSS (Cross-Site Scripting) happens when an attacker’s script runs on your webpage. Defend by escaping output, avoiding risky code like dangerouslySetInnerHTML, and using security tools like Helmet or Content Security Policy (CSP).

CSRF (Cross-Site Request Forgery) is when another site tricks your browser into sending a request using your login cookie. Defend by setting cookies with SameSite attribute, using CSRF tokens, and not relying only on cookies for authentication.
