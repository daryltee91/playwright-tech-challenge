# playwright-technical-challenge
Technical challenge built using Node.js v24, Docker, and Playwright for E2E testing.

## Structure

Datasets for `DemoQA Automation Practice Form` is defined in `assets/data/students.json` in JSON format.

Image used for `DemoQA Automation Practice Form` can be found in `assets/images/example.png`.

Tests for `DemoQA Automation Practice Form` are defined in `tests/demoqa.spec.ts`.

Tests for `SWAPI` are defined in `tests/swapi.spec.ts`.

## Getting Started

Create a `.env` file, using `.env.example` as a reference.

Install dependencies

```bash
pnpm i
```

### Running Locally

To run tests without tracing

```bash
pnpm run test
```

To run tests with tracing

```bash
pnpm run test:trace
```

### Running In Docker Container

Build the docker image

```bash
docker build -t playwright-tests .
```

Verify image was created successfully

```bash
docker image ls
```

To run tests without tracing

```bash
docker run -it playwright-tests:latest npm run test
```

To run tests with tracing

```bash
docker run -p 3000:9323 -it playwright-tests:latest npm run test:trace
```

## Assumptions

### DemoQA Automation Practice Form

- I assume that the datasets are available in a json file, which I have created in `assets/data/students.json`.

- I assume that the second dataset is expected to fail as-is, as there is no hobby checkbox for `Traveling` in the form.

- I assume that the date of birth is always in the format `YYYY-MM-DD`.

- I assume that the test should simulate user interaction as closely as possible:
  
  - For datepicker fields: click on the input field, and then select the year, month, and date.

  - For select fields: click on the input field, and then selecting the option with the correct value.

- For `Current Address`, 
  
  - I assume that I will use the `Address` value, and input any value of my choosing for any missing parts.

  - I assume that `Address` can be broken up to `block`, `street`, `unit`, `level`, `building`, and `postal`.
  
  - For the format, I assume that the semicolon should come after each address part, to make it more human-readable. Thus, I will format it as:
    
    `[Block Number] [Street Name]; #[Unit Level]-[Unit No.]; [Building Name]; Singapore Postal code [Postal Code]`

### SWAPI

- I assume that, to verify the count of people returned by the `/people` endpoint, I have to check the `count` property of the first page, as well as count the number of people returned on all pages.

- I assume that, when checking for the gender of each person, I have to call the `/people/{id}` endpoint instead of relying on the data returned by the `/people` endpoint.

- I assume that the test for checking gender should fail, as one or more of the data contains `hermaphrodite` for gender.