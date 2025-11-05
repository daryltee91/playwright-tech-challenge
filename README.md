# playwright-technical-challenge
Technical challenge built using Node.js v24 and Playwright for E2E testing.

Tests for `DemoQA Automation Practice Form` are defined in `tests/formSubmission.spec.ts`.

Tests for `SWAPI` are defined in `tests/apiTest.spec.ts`.

## Getting Started

Create a `.env` file, using `env.sample` as a reference.

Install dependencies

```bash
pnpm i
```

## Running Locally

To run tests without tracing

```bash
pnpm run test
```

To run tests with tracing

```bash
pnpm run test:trace
```

## Running In Docker Container

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

### Test Case 1

- I assume that the datasets are available in a students.json file.

- I assume that the second dataset as-is is expected to fail as there is no hobby checkbox for 'Traveling'.

- I assume that the date of birth is always in the format `YYYY-MM-DD`.

- I assume that the test should simulate user interaction as closely as possible:
  
  - For datepicker fields: click on the input field, and then select the year, month, and date.

  - For select fields: click on the input field, and then selecting the option with the correct value.

- For `Current Address`, 
  
  - I assume that I will use the `Address` value, and input any value of my choosing for any missing parts.

  - I assume that `Address` can be broken up to `block`, `street`, `unit`, `level`, `building`, and `postal`.
  
  - For the format, I assume that the semicolon should come after each address part, to make it more human-readable. Thus, I will format it as:
    
    `[Block Number] [Street Name]; #[Unit Level]-[Unit No.]; [Building Name]; Singapore Postal code [Postal Code]`