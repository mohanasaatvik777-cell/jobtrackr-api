# JobTrackr
# Heading 1: JobTrackr API
REST API are used as Standard browser, that need to pass some principles in order to communicate blw the application
# Heading 2: How to run
1.npm install
2.copy .env.example to .env
3.npm run dev for development, or npm start
4.The server runs at http://localhost:5000

# Heading 3: Versions (semver)
1.^4.21.0 allows minor and patch updates, so up to but not including 5.0.0.
2.~4.21.0 allows only patch updates, so 4.21.x.

# Heading 4: Routes and error shape

Method	Route	Success	Error
GET	/api/applications (filters ?status= and ?search=)	200	none
GET	/api/applications/:id	200	404
POST	/api/applications	201	400
PATCH	/api/applications/:id	200	404
DELETE	/api/applications/:id	204	404

# Heading 5: Slow vs block (the most important one)



What I observed. Use your real results from the two-tab test:

Test with /api/slow: what did /api/applications i observed that while the slow running the other executes because node has single thread and it will not wait for the things that takes time, it keeps them in and when completed as a callback it call and executes.
Test with /api/block: and /api/applications, 


#  Day 6 below the existing README
### Setup
1.Add MONGODB_URI to the .env keys (placeholder only, never the real URI).
2.npm run seed creates 2 users and 1,000 applications.
3.npm run dev starts the server after the database connects.
### Data model
1.Notes are embedded: they belong to one application and are always read with it, so one query gets both.
2.Owner is referenced: one user has many applications and can change on its own, so we store only the user’s _id and use populate('owner', 'name email').
### When I would choose SQL
1.SQL: data with many relationships and joins, strict consistency (payments, banking).
2.MongoDB: flexible or changing shapes, nested data read together (like applications with notes).
### Index: COLLSCAN vs IXSCAN
Query: find({ owner, status: "Interview" }).explain("executionStats")
Means without an index. Mongodb reades every documents which takes extra time i.e COLLSCAN. After the index in the Mongodb it is IXSCAN with the less time of finding as compared to the COLLSCAN.

	                                 Stage	   Docs examined 	Returned
Before index	                     COLLSCAN	1001              135
After index { owner: 1, status: 1 }	 IXSCAN	    135	              135

### Pagination
1.GET /api/applications?page=2&limit=10 returns data, page, limit, total, totalPages.
2.Why skip gets slow: MongoDB still walks past every skipped document, so a very high page does a lot of wasted work.
3.Alternative: range (cursor) pagination: remember the last _id and query { _id: { $lt: lastId } } with limit.
### Stats
GET /api/applications/stats uses an aggregation ($match, $group, $sort) to return the count per status and the average salary of offers
### Errors
Bad id (/abc): 400 “Invalid id”.
Invalid fields: 400 with a message per field.
Valid but unknown id: 404 “Application not found”.
Same shape as always: { success: false, message, errors }
### Notes
POST /api/applications/:id/notes with { "text": "..." } adds an embedded note

## Day 7
# Day 7: Secure API

## Helmet headers
Helmet is added with `app.use(helmet())`. Three headers it sets,
seen in my Postman response:
- `X-Content-Type-Options: nosniff`: 
- `X-Frame-Options: SAMEORIGIN`: 
- `Strict-Transport-Security`: 

## XSS test
I saved a note containing `<img src=x onerror=alert(1)>`.
The API returned it unchanged as a plain string in JSON.

Why React is safe: React escapes any text placed in JSX, so the tag is
shown as visible text and never becomes a real element.

What makes it dangerous: `dangerouslySetInnerHTML` inserts the string as
raw HTML, so the onerror would run.
## RateLimiter
It is used to restrict particular user that is how many requests the user 
can make in a particular amount of time.
That was implemented in the screenshot it shows 429 with wrong passoword,
where after trying for the 5 attempts for the 6 th attempt it shows the 429 as the
ratelimit implemented successfully.

## NoSqlInjection
There are some commands in the mongodb so that by executing them
will get the permission like accessing the application of other thing like admin,
there will be some command, so to sanitize them we will using the sanitizeFilter inside the db.js so that it will detect them easily.

# AI INTEGRATION IN JOBTRACKR DAY-01
## Why the API key stays on the server
1. When we write in the frontend(react) browser side, the react code downloads to the user's browser, so anyone can read it, and utilize and spend our money.
2.Everything in the browser will visible at the Network tab.
