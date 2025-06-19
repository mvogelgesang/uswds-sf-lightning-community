import { LightningElement, api } from "lwc";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

/**
 * @description A generic button component that can be customized with a label, variant, and size.
 * It supports different variants like 'primary', 'secondary', 'outline', and 'inverse'.
 * The size can be toggled between default and large. The component also supports icon integration
 * and emits a custom event when clicked.
 * @example
 * // Usage in an LWC template:
 * <c-uswds-button
 *   label="Cancel"
 *   variant="outline"
 *   onbuttonaction={handleButtonClick}>
 * </c-uswds-button>
 */
export default class UswdsButton extends LightningElement {
  /**
   * @type {string}
   * @default ''
   * @description Additional CSS classes to apply directly to the button element.
   * Allows for custom styling beyond predefined variants.
   */
  @api buttonClass = "";

  /**
   * @type {string}
   * @default 'Button'
   * @description The text displayed on the button.
   */
  @api label = "button";

  /**
   * @type {('default'|'secondary'|'accent cool'|'accent warm'|'outline'|'base'|'unstyled')}
   * @default 'default'
   * @description The visual styling variant of the button.
   * - 'default': Standard button styling.
   * - 'secondary': Used for destructive actions.
   * - 'accent cool': Button for related actions but not primary functions of a page (e.g. info box/ help).
   * - 'accent warm': Button for related actions but not primary functions of a page (e.g. info box/ help).
   * - 'outline': Used for secondary actions such as cancelling a form or going back. Button with only a border and transparent background.
   * - 'base': Button with grey/muted background.
   * - 'unstyled': No styling.
   */
  @api variant = "default";

  /**
   * @type {('button'|'submit'|'reset')}
   * @default 'button'
   * @description The HTML `type` attribute for the button.
   * - 'button': A clickable button with no default behavior.
   * - 'submit': A button that submits the form data.
   * - 'reset': A button that resets the form fields.
   */
  @api type = "button";

  /**
   * @type {boolean}
   * @default false
   * @description If `true`, the native HTML `disabled` attribute is applied,
   * disabling the button visually and functionally, and removing it from the tab order.
   * Use for truly inactive controls.
   */
  @api isDisabled = false;
  /**
   * @type {boolean}
   * @default false
   * @description If `true`, the `aria-disabled="true"` ARIA attribute is applied.
   * This communicates a disabled *state* to assistive technologies.
   * Note: This does not inherently prevent interaction or remove from tab order;
   * requires custom CSS (e.g., `pointer-events: none; opacity; cursor;`)
   * and JavaScript to fully suppress interaction for non-native elements.
   */
  @api isAriaDisabled = false;

  /**
   * @type {boolean}
   * @default false
   * @description If `true`, applies inverse styling to the button,
   * suitable for use on dark backgrounds. Only applicable on buttons of the outline variant.
   */
  @api isInverse = false;

  /**
   * @type {boolean}
   * @default false
   * @description If `true`, renders the button with a larger size.
   */
  @api isBig = false;

  @api iconName;
  @api iconPosition = "";
  uswdsInitialized = false;

  renderedCallback() {
    if (this.uswdsInitialized) {
      return;
    }
    this.uswdsInitialized = true;

    Promise.all([
      loadStyle(this, USWDS_ASSETS + "/css/theme.min.css"),
      loadScript(this, USWDS_ASSETS + "/js/uswds-initializer.min.js")
    ]);
  }

  /**
   * @event buttonaction
   * @description Fired when the button is clicked.
   * The parent component can use this event to determine which action
   * (e.g., submit, reset, cancel) to perform.
   * @param {object} detail - The event payload.
   * @param {string} detail.actionType - The HTML type of the button that was clicked
   * ('button', 'submit', or 'reset').
   * @param {string} detail.buttonLabel - The label text of the button that was clicked.
   * @example
   * // Parent component HTML:
   * <c-my-generic-button onbuttonaction={handleFormAction}></c-my-generic-button>
   *
   * // Parent component JavaScript:
   * handleFormAction(event) {
   * const { actionType, buttonLabel } = event.detail;
   * // ... logic based on actionType ...
   * }
   */
  _dispatchButtonEvent() {
    this.dispatchEvent(
      new CustomEvent("buttonaction", {
        detail: {
          label: this.label,
          type: this.type
        },
        bubbles: true, // Allows the event to bubble up the DOM tree
        composed: true
      })
    );
  }

  /**
   * @description Handles the button click event.
   * If the button is not disabled, it dispatches a custom event.
   * @param {Event} event - The click event.
   */
  handleClick(event) {
    // Check the LWC component's internal property for disabled state
    if (this.isButtonDisabled) {
      // Prevent the default click action
      event.preventDefault();
      // Stop event propagation to prevent it from bubbling up to parent elements
      event.stopPropagation();
      return; // Exit the function early
    }

    this._dispatchButtonEvent();
  }

  /**
   * @description Handles keyboard events for the button.
   * If the button is not disabled and the Enter or Space key is pressed,
   * it dispatches a custom event.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  handleKeyDown(event) {
    if (this.isButtonDisabled) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Prevent default activation
        event.stopPropagation();
      }
      return; // Exit early if disabled
    }

    // If not disabled, proceed with normal keyboard logic
    if (event.key === "Enter" || event.key === " ") {
      this._dispatchButtonEvent();
    }
  }

  /**
   * @description Determines the CSS classes to apply based on the button's variant.
   * @private
   * @returns {string} - A string of CSS classes corresponding to the variant.
   */
  get variantClasses() {
    switch (this.variant) {
      case "secondary":
        return "usa-button--secondary";
      case "accent cool":
        return "usa-button--accent-cool";
      case "accent warm":
        return "usa-button--accent-warm";
      case "base":
        return "usa-button--base";
      case "unstyled":
        return "usa-button--unstyled";
      case "outline":
        return "usa-button--outline";
      default: {
        return "";
      }
    }
  }

  /**
   * @description Generates the full list of CSS classes to apply to the button.
   * Combines the base class, variant-specific classes, and optional classes
   * for outline, inverse, unstyled, and large size variants.
   * @private
   * @returns {string[]} - An array of CSS class names.
   */
  get buttonClasses() {
    return [
      "usa-button",
      this.buttonClass,
      this.variantClasses,
      this.isInverse ? "usa-button--inverse" : "",
      this.isBig ? "usa-button--big" : ""
    ];
  }

  /**
   * @description Determines if the button should be considered disabled.
   * A button is considered disabled if either the `isDisabled` or `isAriaDisabled`
   * property is true.
   * @private
   * @returns {boolean} - True if the button is disabled, false otherwise.
   */
  get isButtonDisabled() {
    return this.isDisabled || this.isAriaDisabled;
  }
}
