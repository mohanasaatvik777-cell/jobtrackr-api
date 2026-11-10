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


# Interview Answers

## 1. Token, context window, knowledge cutoff, hallucination

Ans. Token is nothing but a small text or a part of text. The number of tokens the model see at a time is called context window. The LLM is trained on upto certain date, after that what happens is notknow to the LLM is called as knowledge cutoff,
when they are trained for upto certain date then after we may ask the question it gives the ans confidental is because it invent the things that they have been trained on is called as hallucination.

## 2. Temperature

Ans. Temperature is used the control the randomness of the llm response. The range is of 0 2. when it is 0(deterministic) when it is 1(creative) means it things out of box.

## 3. Choosing a model and controlling cost
Ans. We need to choose a model based on our task purpose only. Like sonnet 5 in cluade is used for multiple purpose. While Haiku5.5 is used for normall task like the summarize like that but for a Opus 5.5 for more creative work inventions like this. We need to control the amount by calculating at every time.
