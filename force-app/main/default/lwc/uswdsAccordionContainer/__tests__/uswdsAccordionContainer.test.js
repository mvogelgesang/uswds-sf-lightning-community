import { createElement } from "@lwc/engine-dom";
import { registerSa11yMatcher } from "@sa11y/jest";
import UswdsAccordionContainer from "c/uswdsAccordionContainer";
import UswdsAccordionSection from "c/uswdsAccordionSection";

describe("c-uswds-accordion-container", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Verify that the accordion container applies the correct CSS class based on the `accordionType` property.", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-container", {
      is: UswdsAccordionContainer
    });
    element.accordionType = "Bordered";

    // Act
    document.body.appendChild(element);

    // Assert
    const container = element.shadowRoot.querySelector(".usa-accordion");
    expect(container.classList.contains("usa-accordion--bordered")).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("Verify that the accordion container applies the correct `data-allow-multiple` attribute and classbased on the `allowMultipleSelectable` property.", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-container", {
      is: UswdsAccordionContainer
    });
    element.allowMultipleSelectable = true;

    // Act
    document.body.appendChild(element);

    // Assert
    const container = element.shadowRoot.querySelector(".usa-accordion");
    expect(container.getAttribute("data-allow-multiple")).toBe("true");
    expect(container.classList.contains("usa-accordion--multiselectable")).toBe(
      true
    );
    await expect(element).toBeAccessible();
  });

  it("Verify that the accordion container sets the `applyTopMargin` property correctly on its child sections.", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-container", {
      is: UswdsAccordionContainer
    });
    const section1 = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    section1.header = "1st section";
    const section2 = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    section2.applyTopMargin = true;
    section2.header = "2nd section";
    element.appendChild(section1);
    element.appendChild(section2);

    // Act
    document.body.appendChild(element);

    // Assert
    expect(section1.applyTopMargin).toBe(false);
    expect(section2.applyTopMargin).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("Verify that the accordion container toggles the visibility of the correct section when a toggle event is dispatched.", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-container", {
      is: UswdsAccordionContainer
    });
    const section1 = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    section1.sectionId = "section1";
    section1.header = "1st section";
    const section2 = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    section2.sectionId = "section2";
    section2.header = "2nd section";
    // Add sections to container
    element.appendChild(section1);
    element.appendChild(section2);
    document.body.appendChild(element);
    await expect(element).toBeAccessible();
    // Wait for component to be rendered
    await Promise.resolve();

    // Add event listener to verify event is received
    const container = element.shadowRoot.querySelector(".usa-accordion");
    let eventReceived = false;
    container.addEventListener("sectiontoggle", (event) => {
      eventReceived = true;
    });

    // Act
    const toggleEvent = new CustomEvent("sectiontoggle", {
      bubbles: true,
      composed: true,
      detail: { id: "section1" }
    });
    container.dispatchEvent(toggleEvent);

    // Wait for the event to be handled
    await Promise.resolve();

    // Assert
    expect(eventReceived).toBe(
      true,
      "Event should be received by the container"
    );
    expect(section1.isExpanded).toBe(true);
    expect(section2.isExpanded).toBe(false);
    await expect(element).toBeAccessible();
  });
});
