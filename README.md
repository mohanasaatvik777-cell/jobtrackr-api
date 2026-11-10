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


# JobTrackr API

JobTrackr is a job application tracker. This is its backend, built with Node.js, Express and MongoDB. Users register, log in and track their job applications. Day 10 adds three AI tools that help with job descriptions and resume lines.

## AI features (Day 10)

All AI routes are protected. Send `Authorization: Bearer <token>` with every request. The token comes from `POST /api/auth/login`.

| Route | Input | Output |
|-------|-------|--------|
| POST /api/ai/summarize | `jobDescription` | 5 bullet points: role, must-have skills, nice-to-haves, responsibilities, red flags |
| POST /api/ai/rewrite | `text`, `tone` (formal, confident or concise) | one rewritten resume line, 30 words or fewer |
| POST /api/ai/extract | `jobDescription` | JSON with company, role, location, skills, minYears, salaryRange |
| GET /api/ai/usage | none | today's number of calls, tokens and cost for the logged-in user |

Example `extract` response:

{ "company": "Acme Tech", "role": "Backend Developer", "location": "Hyderabad", "skills": ["Node.js", "Express", "MongoDB"], "minYears": 2, "salaryRange": null }

If something is not written in the job description, its value is `null`. The API never guesses.

### Error codes

| Code | Meaning |
|------|---------|
| 400 | Input is missing, is not text, is longer than 6,000 characters, or the tone is not allowed. The model is not called. |
| 401 | Missing or invalid token |
| 502 | The AI service failed, or `extract` returned invalid data twice |

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and fill in the values.
3. Run `npm run dev`. The API starts on http://localhost:5000.

Environment variables for the AI features:

- `LLM_API_KEY`: your Groq API key
- `LLM_MODEL`: the model id to use
- `LLM_PRICE_INPUT_PER_M`: model price per 1 million input tokens, in dollars
- `LLM_PRICE_OUTPUT_PER_M`: model price per 1 million output tokens, in dollars

The other variables (database connection, `JWT_SECRET`, `JWT_EXPIRES_IN`, and so on) are listed in `.env.example`.

The LLM provider is Groq, on its free tier with no payment method attached, so no charges are possible. The cost shown in the usage log is still calculated from the model's listed price per million tokens.

## Why the API key stays on the server

React code is downloaded into the user's browser, so anyone can open it and read what is inside. Every request the browser sends is also visible in the Network tab, and environment variables used in a React build are copied into the JavaScript, which makes them public. If the key were in React, anyone could copy it and use my quota or money. So