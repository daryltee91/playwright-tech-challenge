import { test, expect, Page } from "@playwright/test";
import type { StudentProps } from "../types";
import datasets from "../assets/data/students.json" assert { type: "json" };
import dayjs from "dayjs";

const students: StudentProps[] = datasets;

/**
 * Performs form submission using the provided student data.
 *
 * @param page
 * @param student
 */
const doFormSubmission = async (page: Page, student: StudentProps) => {
  // Implementation of form submission using data
  // Wait for form to be visible
  await expect(page.locator("#userForm")).toBeVisible();

  // Fill First Name
  await page.getByPlaceholder("First Name").fill(student.firstName);

  // Fill Last Name
  await page.getByPlaceholder("Last Name").fill(student.lastName);

  // Fill Email
  await page.getByPlaceholder("name@example.com").fill(student.email);

  // Fill Mobile Number
  await page.getByPlaceholder("Mobile Number").fill(student.mobile);

  // Select Gender
  await page.getByLabel(student.gender, { exact: true }).click({ force: true });

  // Set Date of Birth
  const dateOfBirth = dayjs(student.dateOfBirth);
  await page.locator("#dateOfBirthInput").click();
  await page.locator(".react-datepicker__year-select").selectOption(dateOfBirth.year().toString());
  await page
    .locator(".react-datepicker__month-select")
    .selectOption(dateOfBirth.month().toString());
  await page
    .locator(`div.react-datepicker__day:not(.react-datepicker__day--outside-month)`)
    .getByText(dateOfBirth.date().toString())
    .click();

  // Fill subjects
  for (const subject of student.subjects) {
    await page.locator("#subjectsInput").pressSequentially(subject);
    await page.locator(".subjects-auto-complete__menu").getByText(subject, { exact: true }).click();
  }

  // Select hobbies
  for (const hobby of student.hobbies) {
    if (await page.getByLabel(hobby, { exact: true }).isVisible()) {
      await page.getByLabel(hobby, { exact: true }).click({ force: true });
    } else {
      throw new Error(`Hobby "${hobby}" is not a valid option.`);
    }
  }

  // Set picture
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByLabel("Select picture").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("assets/images/example.png");

  // Fill Current Address
  await page
    .locator("#currentAddress")
    .fill(
      `${student.address.block} ${student.address.street}; #${student.address.level}-${student.address.unit}; ${student.address.building}; Singapore Postal code ${student.address.postal}`
    );

  // Select State
  await page.locator("#state").click();
  await page.getByText(student.state, { exact: true }).click();

  // Select City
  await page.locator("#city").click();
  await page.getByText(student.city, { exact: true }).click();

  // Click the submit button
  await page.locator("#submit").click();
};

/**
 * Validates that the form's submission success modal contains the correct data.
 *
 * @param page
 * @param student
 */
const validateFormSubmission = async (page: Page, student: StudentProps) => {
  // Wait for modal dialog to be visible
  await expect(page.getByText("Thanks for submitting the form")).toBeVisible();

  // Get the number of rows in the submission table
  const rows = page.locator(".modal-dialog table > tbody > tr");
  const rowCount = await rows.count();

  // Loop through the rows and validate each field
  for (let i = 0; i < rowCount; i++) {
    const value = await rows.nth(i).locator("td").nth(1).innerText();

    switch (i) {
      case 0: // First and Last Name
        expect(value).toBe(`${student.firstName} ${student.lastName}`);
        break;
      case 1: // Email
        expect(value).toBe(student.email);
        break;
      case 2: // Gender
        expect(value).toBe(student.gender);
        break;
      case 3: // Mobile
        expect(value).toBe(student.mobile);
        break;
      case 4: // Date of Birth
        expect(value).toBe(dayjs(student.dateOfBirth).format("D MMMM,YYYY"));
        break;
      case 5: // Subjects
        expect(value).toBe(student.subjects.join(", "));
        break;
      case 6: // Hobbies
        expect(value).toBe(student.hobbies.join(", "));
        break;
      case 7: // Picture
        expect(value).toBe("example.png");
        break;
      case 8: // Address
        expect(value).toBe(
          `${student.address.block} ${student.address.street}; #${student.address.level}-${student.address.unit}; ${student.address.building}; Singapore Postal code ${student.address.postal}`
        );
        break;
      case 9: // State and City
        expect(value).toBe(`${student.state} ${student.city}`);
        break;
      default:
        break;
    }
  }

  await page.locator("#closeLargeModal").click({ force: true });
};

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe("Form Submission Tests", () => {
  /**
   * This test performs a form submission for the first student in the dataset
   * and validates that the submission was successful with correct data.
   */
  test("should pass first student submission", async ({ page }) => {
    if (typeof process.env.DEMOQA_FORM_URL === "undefined") {
      throw new Error("DEMOQA_FORM_URL is undefined in .env");
    }

    await page.goto(process.env.DEMOQA_FORM_URL, { waitUntil: "domcontentloaded" });

    await doFormSubmission(page, students[0]);
    await validateFormSubmission(page, students[0]);
  });

  /**
   * This test performs a form submission for the second student in the dataset,
   * which is expected to fail due to an invalid hobby "Traveling".
   */
  test.fail(
    "should fail second student submission due to invalid hobby 'Traveling'",
    async ({ page }) => {
      if (typeof process.env.DEMOQA_FORM_URL === "undefined") {
        throw new Error("DEMOQA_FORM_URL is undefined in .env");
      }

      await page.goto(process.env.DEMOQA_FORM_URL, { waitUntil: "domcontentloaded" });

      await doFormSubmission(page, students[1]);
      await validateFormSubmission(page, students[1]);
    }
  );

  /**
   * This test performs a form submission for the second student in the dataset
   * after removing the invalid hobby "Traveling",
   * and validates that the submission was successful with correct data.
   */
  test("should pass second student submission after removing 'Traveling' hobby", async ({
    page,
  }) => {
    if (typeof process.env.DEMOQA_FORM_URL === "undefined") {
      throw new Error("DEMOQA_FORM_URL is undefined in .env");
    }

    await page.goto(process.env.DEMOQA_FORM_URL, { waitUntil: "domcontentloaded" });

    const student = {
      ...students[1],
      hobbies: students[1].hobbies.filter((hobby) => hobby !== "Traveling"),
    };

    await doFormSubmission(page, student);
    await validateFormSubmission(page, student);
  });
});
