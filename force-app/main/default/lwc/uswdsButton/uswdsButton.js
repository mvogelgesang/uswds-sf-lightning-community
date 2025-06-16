import { LightningElement, api } from "lwc";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

export default class UswdsButton extends LightningElement {
  /**
   * @api
   * @type {string}
   * @default ''
   * @description Additional CSS classes to apply directly to the button element.
   * Allows for custom styling beyond predefined variants.
   */
  @api buttonClass = "";
  /**
   * @api
   * @type {string}
   * @default 'Button'
   * @description The text displayed on the button.
   */
  @api label = "button";
  /**
   * @api
   * @type {('default'|'secondary'|'accent cool'|'accent warm'|'base')}
   * @default 'default'
   * @description The visual styling variant of the button.
   * - 'default': Standard button styling.
   * - 'primary': Emphasized primary action button.
   * - 'secondary': Less emphasized secondary action button.
   * - 'destructive': Button for destructive actions (e.g., delete).
   * - 'outline': Button with only a border and transparent background.
   * - 'ghost': Button with transparent background and colored text/icon on hover.
   * - 'link': Button styled as a link.
   */
  @api variant = "default";
  /**
   * @api
   * @type {('button'|'submit'|'reset')}
   * @default 'button'
   * @description The HTML `type` attribute for the button.
   * - 'button': A clickable button with no default behavior.
   * - 'submit': A button that submits the form data.
   * - 'reset': A button that resets the form fields.
   */
  @api type = "button";
  /**
   * @api
   * @type {boolean}
   * @default false
   * @description If `true`, the native HTML `disabled` attribute is applied,
   * disabling the button visually and functionally, and removing it from the tab order.
   * Use for truly inactive controls.
   */
  @api isDisabled = false;
  /**
   * @api
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
   * @api
   * @type {boolean}
   * @default false
   * @description If `true`, applies outline styling to the button (e.g., no fill, only border).
   * Specific classes will depend on the variant.
   */
  @api isOutline = false;

  /**
   * @api
   * @type {boolean}
   * @default false
   * @description If `true`, applies inverse styling to the button,
   * suitable for use on dark backgrounds.
   */
  @api isInverse = false;

  /**
   * @api
   * @type {boolean}
   * @default false
   * @description If `true`, removes all default button styling,
   * rendering it as a plain text element that still retains button functionality.
   * Useful for highly custom visual buttons.
   */
  @api isUnstyled = false;

  /**
   * @api
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

  // Handle keyboard events (e.g., Enter or Space key for activation)
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
      default: {
        return "";
      }
    }
  }

  get buttonClasses() {
    return [
      "usa-button",
      this.buttonClass,
      this.variantClasses,
      this.isOutline ? "usa-button--outline" : "",
      this.isInverse ? "usa-button--inverse" : "",
      this.isUnstyled ? "usa-button--unstyled" : "",
      this.isBig ? "usa-button--big" : ""
    ];
  }
  get isButtonDisabled() {
    return this.isDisabled || this.isAriaDisabled;
  }
}
