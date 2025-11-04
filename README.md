# playwright-technical-challenge
Technical challenge using Playwright for E2E testing

## Getting Started

Build the docker image

```bash
docker build -t playwright-tests .
```

Verify image was created successfully

```bash
docker image ls
```

## Run Tests Locally

```bash
pnpm run test
```

## Run Tests In Docker Container

```bash
docker run -it playwright-tests:latest npm run test
```