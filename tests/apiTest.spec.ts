import { test, expect, APIResponse } from "@playwright/test";

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
  test("GET /people results contains all expected properties", async ({ request }) => {
    let next: string | null = `${process.env.SWAPI_BASE_URL}/people`;

    while (next !== null) {
      const response = await request.get(next);
      expect(response.ok()).toBeTruthy();

      const responseBody = await response.json();

      // Check that each person in results matches the PersonSchema
      for (const person of responseBody.results) {
        expect(person).toMatchObject(PersonSchema);
      }

      next = responseBody.next;
    }
  });

  test("GET /people/{id} results contains all expected properties", async ({ request }) => {
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
});
