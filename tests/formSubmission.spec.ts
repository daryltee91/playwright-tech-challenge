import { test, expect, Page } from "@playwright/test";
import type { StudentProps } from "../types";

const datasets: StudentProps[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    gender: "Male",
    mobile: "1234567890",
    subjects: ["Maths"],
    hobbies: ["Sports", "Music"],
    address: {
      block: "123",
      street: "Test Street",
      unit: "03",
      level: "1234",
      building: "Test Building",
      postal: "123456",
    },
    state: "NCR",
    city: "Delhi",
  },
];

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
  await page.getByPlaceholder("First Name").fill(datasets[0].firstName);

  // Fill Last Name
  await page.getByPlaceholder("Last Name").fill(datasets[0].lastName);

  // Fill Email
  await page.getByPlaceholder("name@example.com").fill(datasets[0].email);

  // Fill Mobile Number
  await page.getByPlaceholder("Mobile Number").fill(datasets[0].mobile);

  // Select Gender
  await page.getByLabel(datasets[0].gender, { exact: true }).click({ force: true }); // Force the click on the input, as the label intercepts it and will prevent the click.

  // Set Date of Birth
  await page.locator("#dateOfBirthInput").click();
  await page.locator(".react-datepicker__year-select").selectOption("1990");
  await page.locator(".react-datepicker__month-select").selectOption("4");
  await page.locator(".react-datepicker__day--015").click();

  // Fill subjects
  for (const subject of datasets[0].subjects) {
    await page.locator(".subjects-auto-complete__value-container").pressSequentially(subject);
    await page.locator(".subjects-auto-complete__value-container").press("Enter");
  }

  // Set picture
  await page.getByLabel("Select picture").setInputFiles("assets/images/example.png");

  // Fill Current Address
  await page
    .locator("#currentAddress")
    .fill(
      `${datasets[0].address.block} ${datasets[0].address.street}; #${datasets[0].address.level}-${datasets[0].address.unit}; ${datasets[0].address.building}; Singapore Postal code ${datasets[0].address.postal}`
    );
};

test("submit first dataset", async ({ page }) => {
  await page.goto("https://demoqa.com/automation-practice-form");
  await doFormSubmission(page, datasets[0]);
});
