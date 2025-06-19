import { createElement } from "@lwc/engine-dom";
import UswdsButton from "c/uswdsButton";

describe("c-uswds-button", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should render the component with default values", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button).not.toBeNull();
    expect(button.textContent).toBe("button");
    expect(button.disabled).toBe(false);
    expect(button.classList.contains("usa-button")).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("should render the component with custom label", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.label = "Custom Label";
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.textContent).toBe("Custom Label");
    await expect(element).toBeAccessible();
  });

  it("should render the component with secondary variant", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.variant = "secondary";
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.classList.contains("usa-button--secondary")).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("should render the component with outline variant", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.variant = "outline";
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.classList.contains("usa-button--outline")).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("should render the component with inverse styling", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isInverse = true;
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.classList.contains("usa-button--inverse")).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("should render the component with large size", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isBig = true;
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.classList.contains("usa-button--big")).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("should render the component with custom class", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.buttonClass = "custom-class";
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.classList.contains("custom-class")).toBe(true);
  });

  it("should render the component with disabled state", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isDisabled = true;
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.disabled).toBe(true);
    await expect(element).toBeAccessible();
  });

  it("should render the component with aria-disabled state", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isAriaDisabled = true;
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    await expect(element).toBeAccessible();
  });

  it("should render the component with submit type", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.type = "submit";
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.type).toBe("submit");
    await expect(element).toBeAccessible();
  });

  it("should render the component with reset type", async () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.type = "reset";
    document.body.appendChild(element);

    const button = element.shadowRoot.querySelector("button");
    expect(button.type).toBe("reset");
    await expect(element).toBeAccessible();
  });

  it("should dispatch buttonaction event on click", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.click();

    expect(handler).toHaveBeenCalled();
  });

  it("should not dispatch buttonaction event when disabled", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isDisabled = true;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.click();

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not dispatch buttonaction event when aria-disabled", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isAriaDisabled = true;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.click();

    expect(handler).not.toHaveBeenCalled();
  });

  it("should dispatch buttonaction event on Enter key", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(handler).toHaveBeenCalled();
  });

  it("should dispatch buttonaction event on Space key", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(handler).toHaveBeenCalled();
  });

  it("should not dispatch buttonaction event on Enter key when disabled", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isDisabled = true;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not dispatch buttonaction event on Space key when disabled", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isDisabled = true;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not dispatch buttonaction event on Enter key when aria-disabled", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isAriaDisabled = true;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not dispatch buttonaction event on Space key when aria-disabled", () => {
    const element = createElement("c-uswds-button", {
      is: UswdsButton
    });
    element.isAriaDisabled = true;
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("buttonaction", handler);

    const button = element.shadowRoot.querySelector("button");
    button.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(handler).not.toHaveBeenCalled();
  });
});
