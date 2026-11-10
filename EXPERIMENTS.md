# Experiments

## Rewrite: zero-shot vs few-shot
Tone used: confident | Temperature: 0

| # | Original line | Zero-shot result | Few-shot result |
|---|---------------|------------------|-----------------|
| 1 | worked on backend stuff | Spearheaded backend development initiatives. | Handled backend development. |
| 2 | I was responsible for the creation and maintenance of the various database tables and also for writing all of the different queries that the team needed to use for their reports every single week | I designed and maintained database tables and authored all weekly queries required for the team's reports. | Created and maintained diverse database tables while authoring all weekly queries required for the team's reports. |
| 3 | reduced page load time from 4 seconds to 2 seconds | Cut page load time in half, slashing it from 4 seconds to 2 seconds. | Halved page load time, cutting it from 4 seconds to 2 seconds. |
## Judgeing section
1.Here we are judgeing based on the word constrain. 
2. Based on the tone(important)

## Decision section
1. The zero-shot follows the instructions but it is not that munch confident when we compared to the few-short
2. The way few-shot is confident and good keywords format make more worthy than the zero-shot.

Decision: I kept few-shot because of its ability for the confident and formation of response.


## Summarize: temperature 0 vs temperature 1
Same input for all 6 runs: Acme Tech Backend Developer job description.

### Temperature 0 (3 runs)
All three runs gave the same output:

- Role: Backend Developer (Hyderabad)
- Must-have skills: 2 years experience with Node.js, Express, MongoDB
- Nice-to-haves: Docker, AWS
- Responsibilities: Build REST APIs, fix bugs, collaborate with the frontend team
- Red flags: Occasional weekend work is expected

### Temperature 1 (3 runs)
Role, Nice-to-haves and Red flags were identical in all three runs. Only two lines changed:

| Run | Must-have skills | Responsibilities |
|-----|------------------|------------------|
| 1 | ...Node.js, Express, MongoDB | build REST APIs, fix bugs, work with the frontend team |
| 2 | ...Node.js, Express, and MongoDB | Build REST APIs, fix bugs, and work with the frontend team |
| 3 | ...Node.js, Express, and MongoDB | Build REST APIs, fix bugs, and collaborate with the frontend team |

## Conclusion
1.I have notice that the output of the llm is consistent across the three runs when temperature is 0. But the output of the llm chages at every run in the three runs when we place the temperature at 1.
2.But at the temp 1 i observed only the change in the way of response, but the actually fact neven changes
3.So the three that is summarize, extract, and rewrite:-
summarize temperaturn is 0,
and extract temperature 0,
and rewrite say temperaturn 0.7