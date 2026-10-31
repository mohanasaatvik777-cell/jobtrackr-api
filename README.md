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