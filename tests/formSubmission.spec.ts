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
  await page.getByLabel(student.gender, { exact: true }).click({ force: true }); // Force the click on the input, as the label intercepts it and will prevent the click.

  // Set Date of Birth
  await page.locator("#dateOfBirthInput").click();
  await page.locator(".react-datepicker__year-select").selectOption("1990");
  await page.locator(".react-datepicker__month-select").selectOption("4");
  await page.locator(".react-datepicker__day--015").click();

  // Fill subjects
  for (const subject of student.subjects) {
    await page.locator(".subjects-auto-complete__value-container").pressSequentially(subject);
    await page.locator(".subjects-auto-complete__value-container").press("Enter");
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
};

test("submit first student", async ({ page }) => {
  await page.goto("https://demoqa.com/automation-practice-form");
  await doFormSubmission(page, students[0]);
});
