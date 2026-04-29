# CSDS-393-Group-17
Productivity social media app

### All front-end testing code resides in the `sensei-productivity` folder

In the sensei-productivty folder, run `yarn install --mode=skip-build` to install needed packages and dependencies for front end testing. 

## Running the tests: 
Navigate to `sensei-productivity/apps/expo`

Run the tests: `yarn test`

There are six total tests on the front end. Both have to do with helper functions for the feed and the profile screen. One Tests mapCategory to ensure that all categories are properly mapped to ensure consistency with the database. Additionally, it checks to make sure that invalid categories are not accepted. formatPostTime tests that only valid dates and time are accepted. 

# CSDS-393-Group-17 REST API Backend
REST API powering all features of the Sensei Productivity social media app. [Main Repo](https://github.com/one-and-only/CSDS-393-Group-17-REST-API).

Before running tests, the following environment variables are expected to be in the `.env.test` file in the repo's root directory and the environment itself prior to running the dev REST API server and the Cypress Unit Test execution command:
```env
DATABASE_URL="mysql://user:password@host:3306/databaseName"

DATABASE_HOST=123.456.789.012
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_NAME=databaseName
```

## Tests Location

The REST API unit tests are located in the `cypress/e2e/` directory. 

They cover the following endpoint groups:
* **Activity Posts:** `activity-post-endpoints.cy.js`
* **Categories:** `category-endpoints.cy.js`
* **Friends:** `friend-endpoints.cy.js`
* **Schools:** `school-endpoints.cy.js`
* **User Activities:** `user-activity-endpoints.cy.js`
* **Users:** `user-endpoints.cy.js`

**What is Covered:** The Cypress E2E tests verify API responses, authentication error handling, and schema validation. They ensure the Fastify server properly enforces endpoint specifications. For example, the tests verify that unauthorized requests fail with a 400 BadRequest error. They also verify that API responses appropriately return expected fields (like `schoolNameShorthand`) and drop fields not explicitly required by the API specification.

## Running The Tests

To run the REST API tests locally, you need to set up the dependencies, build the TypeScript/Prisma files, start the server, and launch Cypress. 

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Build the Project:**
   This command executes `npx prisma generate && npx tsc` to prepare the database client and compile the code.
   ```bash
   npm run build
   ```
3. **Start the REST API Server:**
   The server must be actively running on your machine.
   ```bash
   node --env-file=.env.test index.js
   ```
4. **Execute Cypress Tests:**
   In a separate terminal window, run the tests using Cypress. 
   ```bash
   npx cypress run
   ```

**Important Limitations:**
* The default `npm test` script in `package.json` is not configured for Cypress and will currently exit with an error (`"echo \"Error: no test specified\" && exit 1"`). You must use the `npx cypress run` command directly.
* A live database connection must be present and correctly authenticated via your `.env` variables for the backend to start and for tests to pass.


## Quality Artifact: Feed Data Transformation & Integration Testing (Kaia Kanj 493)

### Overview
To satisfy the CSDS 493 quality artifact requirement, I implemented automated testing for the Feed feature, focusing on both helper-level correctness and integration of frontend data processing logic.

**Testing files exist at: sensei-productivity/apps/expo/__tests__**

### Components Tested

#### 1. Helper Function Unit Tests (`profileHelpers.test.ts`)
I created unit tests for core helper functions used in the Feed feature:

- **`mapCategory`**
  - Maps backend category names (e.g., "Academic", "Professional") to frontend display categories ("School", "Work", "Personal")

- **`formatPostTime`**
  - Formats backend timestamps into human-readable dates
  - Handles invalid or missing date values gracefully

These tests ensure correctness of individual logic components used throughout the feed pipeline.

---

#### 2. Integration-Style Test (`feedHelpers.integration.test.ts`)
I implemented an integration-style test that simulates how backend feed data is transformed into frontend-ready display data.

This test:
- Takes a mock API response object (simulating backend data)
- Applies helper functions (`mapCategory`, `formatPostTime`)
- Constructs the final object used by the Feed UI
- Verifies that all fields are correctly transformed and preserved

### Example Flow Tested
- Backend category `"Academic"` → mapped to `"School"`
- Raw timestamp → formatted date string
- Post metadata (likes, user, caption) preserved correctly


The integration-style test validates interaction between multiple parts of the system, including:

- Backend-style data structures  
- Frontend transformation logic  
- Helper utilities  
- UI-ready data formatting  

---

### Conclusion
This testing approach ensures that feed data flows correctly from backend responses to frontend display, improving reliability and catching issues that would not be detected by unit tests alone.