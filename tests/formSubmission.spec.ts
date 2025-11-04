import { test, expect, Page } from "@playwright/test";
import type { StudentProps } from "../types";
import datasets from "../assets/data/students.json" assert { type: "json" };

const students: StudentProps[] = datasets;

const doFormSubmission = async (page: Page, student: StudentProps) => {
  // Implementation of form submission using data
  // Wait for form to be visible
  await expect(page.locator("#userForm")).toBeVisible();

  // Scroll userForm to top of page
  // This is done to avoid any bottom floating advertisement banners covering form elements
  await page.evaluate(() => {
    document.getElementById("userForm")?.scrollIntoView(true);
  });

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
  await page.locator("#dateOfBirthInput").click();
  await page.locator(".react-datepicker__year-select").selectOption("1990");
  await page.locator(".react-datepicker__month-select").selectOption("4");
  await page.locator(".react-datepicker__day--015").click();

  // Fill subjects
  for (const subject of student.subjects) {
    await page.locator("#subjectsInput").pressSequentially(subject);
    await page.locator("#subjectsInput").press("Enter");
  }

  // Select hobbies
  for (const hobby of student.hobbies) {
    await page.getByLabel(hobby, { exact: true }).click({ force: true });
  }

  // Set picture
  await page.getByLabel("Select picture").setInputFiles("assets/images/example.png");

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

  await page.locator("#submit").click();
};

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
        expect(value).toBe("15 May,1990");
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

test("submit first student", async ({ page }) => {
  await page.goto("https://demoqa.com/automation-practice-form");
  await doFormSubmission(page, students[0]);
  await validateFormSubmission(page, students[0]);
});
