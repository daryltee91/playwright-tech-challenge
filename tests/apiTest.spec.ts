import { test, expect } from "@playwright/test";

const PersonSchema = {
  name: expect.any(String),
  height: expect.any(String),
  mass: expect.any(String),
  hair_color: expect.any(String),
  skin_color: expect.any(String),
  eye_color: expect.any(String),
  birth_year: expect.any(String),
  gender: expect.any(String),
  homeworld: expect.any(String),
  films: expect.any(Array),
  species: expect.any(Array),
  vehicles: expect.any(Array),
  starships: expect.any(Array),
  created: expect.any(String),
  edited: expect.any(String),
  url: expect.any(String),
};

test.describe("API Tests", () => {
  /**
   * This test iterates through all people in the SWAPI and asserts that
   * the count of people matches MAX_STAR_WARS_CHARACTERS environment variable.
   */
  test(`GET /people should return the expected number of people`, async ({ request }) => {
    const maxStarWarsCharacters = Number(process.env.MAX_STAR_WARS_CHARACTERS);

    // Ensure that MAX_STAR_WARS_CHARACTERS is a valid number
    expect(!isNaN(maxStarWarsCharacters)).toBeTruthy();

    let next: string | null = "";
    let resultsCount: number = 0;

    const response = await request.get(`${process.env.SWAPI_BASE_URL}/people`);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    // Assert that the count property from the initial response matches the expected max characters
    expect(responseBody.count).toBe(maxStarWarsCharacters);

    resultsCount += responseBody.results.length;
    next = responseBody.next;

    // Iterate through all pages and accumulate resultsCount with the length of results
    while (next !== null) {
      const response = await request.get(next);
      expect(response.ok()).toBeTruthy();

      const responseBody = await response.json();
      resultsCount += responseBody.results.length;

      next = responseBody.next;
    }

    // Assert that the total resultsCount matches the expected max characters
    expect(resultsCount).toBe(maxStarWarsCharacters);
  });

  /**
   * This test iterates through all people in the SWAPI, fetches their individual details,
   * and asserts that the response contains all expected properties as defined in PersonSchema.
   */
  test("GET /people/{id} should contain all expected properties", async ({ request }) => {
    let next: string | null = `${process.env.SWAPI_BASE_URL}/people`;

    while (next !== null) {
      const response = await request.get(next);
      expect(response.ok()).toBeTruthy();

      const responseBody = await response.json();

      for (const res of responseBody.results) {
        const personResponse = await request.get(res.url);
        expect(personResponse.ok()).toBeTruthy();

        const person = await personResponse.json();
        expect(person).toMatchObject(PersonSchema);
      }

      next = responseBody.next;
    }
  });

  /**
   * This test iterates through all people in the SWAPI, fetches their individual details,
   * and asserts that the gender field matches one of "male", "female", or "n/a".
   *
   * This step is expected to fail as some entries contain an unexpected value "hermaphrodite".
   */
  test("GET /people/{id} gender should be one of male, female, or n/a", async ({ request }) => {
    let next: string | null = `${process.env.SWAPI_BASE_URL}/people`;

    while (next !== null) {
      const response = await request.get(next);
      expect(response.ok()).toBeTruthy();

      const responseBody = await response.json();

      for (const res of responseBody.results) {
        const personResponse = await request.get(res.url);
        expect(personResponse.ok()).toBeTruthy();

        const person = await personResponse.json();
        expect(person.gender).toMatch(/^(male|female|n\/a)$/);
      }

      next = responseBody.next;
    }
  });
});
