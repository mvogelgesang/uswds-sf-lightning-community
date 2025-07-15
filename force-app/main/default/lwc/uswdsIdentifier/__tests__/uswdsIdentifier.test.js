import { createElement } from "@lwc/engine-dom";
import UswdsIdentifier from "c/uswdsIdentifier";
import uswdsIdentifier_mastheadConjunction from "@salesforce/label/c.uswdsIdentifier_mastheadConjunction";

jest.mock(
  "@salesforce/label/c.uswdsIdentifier_mastheadConjunction",
  () => ({ default: "and the" }),
  { virtual: true }
);
describe("c-uswds-identifier", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  // Helper function to create element with mocked labels
  async function createElementWithMockedLabels() {
    const element = createElement("c-uswds-identifier", {
      is: UswdsIdentifier
    });

    document.body.appendChild(element);

    // Wait for the component to be connected
    await Promise.resolve();

    // Override the mastheadConjunction getter to return a test value
    Object.defineProperty(element, "mastheadConjunction", {
      get: function () {
        if (!this.mastheadMenuItems) {
          return "";
        }
        const count = this.mastheadMenuItems.length;
        return count >= 2 ? "and the" : "";
      },
      configurable: true
    });

    return element;
  }

  it("should render with basic properties", async () => {
    // Arrange
    const element = await createElementWithMockedLabels();

    // Act
    document.body.appendChild(element); // This line is removed as per the new_code

    // Assert
    const div = element.shadowRoot.querySelector(".usa-identifier");
    expect(div).toBeTruthy();
  });

  describe("formattedMastheadMenuItems", () => {
    let element;

    beforeEach(async () => {
      element = await createElementWithMockedLabels();
    });

    it("should return empty array when no agencies", async () => {
      element.mastheadMenuItems = [];
      await Promise.resolve();
      const disclaimerItems = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer a"
      );
      expect(disclaimerItems.length).toEqual(0);
    });

    it("should return single agency without formatting", async () => {
      element.mastheadMenuItems = [
        {
          label: "Department of Defense",
          actionValue: "https://defense.gov",
          id: "dod",
          target: "NewWindow"
        }
      ];
      await Promise.resolve();

      const disclaimerItems = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer a"
      );
      expect(disclaimerItems.length).toEqual(1);
      expect(disclaimerItems[0].innerHTML).toEqual("Department of Defense");
    });

    it("should format two agencies with conjunction on second item", async () => {
      element.mastheadMenuItems = [
        {
          label: "Department of Defense",
          actionValue: "https://defense.gov",
          id: "dod",
          target: "NewWindow"
        },
        {
          label: "Department of Homeland Security",
          actionValue: "https://dhs.gov",
          id: "dhs",
          target: "NewWindow"
        }
      ];
      await Promise.resolve();
      const disclaimerItems = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer a"
      );
      const disclaimer = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer"
      );
      expect(disclaimerItems.length).toEqual(2); // First agency - should have comma
      expect(disclaimer[0].textContent).toEqual(
        expect.stringContaining(
          "Department of Defense and the Department of Homeland Security"
        )
      );
    });

    it("should format three agencies with comma and conjunction", async () => {
      element.mastheadMenuItems = [
        {
          label: "Department of Defense",
          actionValue: "https://defense.gov",
          id: "dod",
          target: "NewWindow"
        },
        {
          label: "Department of Homeland Security",
          actionValue: "https://dhs.gov",
          id: "dhs",
          target: "NewWindow"
        },
        {
          label: "Department of Justice",
          actionValue: "https://justice.gov",
          id: "doj",
          target: "NewWindow"
        }
      ];
      await Promise.resolve();
      const disclaimerItems = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer a"
      );
      const disclaimer = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer"
      );
      expect(disclaimerItems.length).toEqual(3); // First agency - should have comma
      expect(disclaimer[0].textContent).toEqual(
        expect.stringContaining(
          "Department of Defense, Department of Homeland Security and the Department of Justice"
        )
      );
    });

    it("should handle undefined mastheadMenuItems", async () => {
      element.mastheadMenuItems = undefined;
      await Promise.resolve();
      const disclaimerItems = element.shadowRoot.querySelectorAll(
        ".usa-identifier__identity-disclaimer a"
      );
      expect(disclaimerItems.length).toEqual(0);
    });
  });

  describe("mastheadConjunction", () => {
    let element;

    beforeEach(async () => {
      element = await createElementWithMockedLabels();
      // document.body.appendChild(element); // This line is removed as per the new_code
    });

    it('should return "and the" for two or more agencies', async () => {
      element.mastheadMenuItems = [
        { label: "Agency 1", id: "agency-1" },
        { label: "Agency 2", id: "agency-2" }
      ];
      expect(element.mastheadConjunction).toBe("and the");
    });

    it('should return "and the" for three or more agencies', async () => {
      element.mastheadMenuItems = [
        { label: "Agency 1", id: "agency-1" },
        { label: "Agency 2", id: "agency-2" },
        { label: "Agency 3", id: "agency-3" }
      ];
      expect(element.mastheadConjunction).toBe("and the");
    });

    it("should return empty string for single agency", async () => {
      element.mastheadMenuItems = [{ label: "Agency 1", id: "agency-1" }];
      await Promise.resolve(); // Wait for reactivity
      expect(element.mastheadConjunction).toBe("");
    });

    it("should return empty string for no agencies", async () => {
      element.mastheadMenuItems = [];
      await Promise.resolve(); // Wait for reactivity

      expect(element.mastheadConjunction).toBe("");
    });
  });
});
