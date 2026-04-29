# CSDS-393-Group-17
Productivity social media app

### All front-end testing code resides in the `sensei-productivity` folder

In the sensei-productivty folder, run `yarn install --mode=skip-build` to install needed packages and dependencies for front end testing. 

## Running the tests: 
Navigate to `sensei-productivity/apps/expo`

Run the tests: `yarn test`

There are six total tests on the front end. Both have to do with helper functions for the feed and the profile screen. One Tests mapCategory to ensure that all categories are properly mapped to ensure consistency with the database. Additionally, it checks to make sure that invalid categories are not accepted. formatPostTime tests that only valid dates and time are accepted. 