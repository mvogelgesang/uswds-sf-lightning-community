# Rule: LWC JSDoc

**Description:** Ensure JSDoc-style comments are used throughout all LWC js files

**Applies to:** `**/*.js` .

**Guidelines:**
* **Be Comprehensive:** Document all `@api` properties, public methods, private helper methods, and custom events.
* **Be Clear & Concise:** Descriptions should be easy to understand and to the point.
* **Be Accurate:** JSDoc types (`@type`) and default values (`@default`) must match the actual code.
* **Maintain Consistency:** Follow the tag order and formatting presented below.

---

## 1. Documenting LWC Classes/Components

Every LWC's main JavaScript file (`.js`) should start with a JSDoc block describing the component class.

* **Required Tags:**
    * `@class` (or `@component` for clarity, though `@class` is standard JSDoc)
    * `@alias [ComponentName]` (Crucial for your requirement! Maps to the LWC's kebab-case tag name.)
    * `@description` (A brief summary of the component's purpose.)
    * `@extends LightningElement` (Standard for LWC classes.)
    * `@author` (Your name/team name)
    * `@since` (Version or date of creation)

* **Example:**

    ```javascript
    /**
     * @class
     * @alias my-generic-button
     * @description A reusable, generic button component for common form actions (submit, reset, cancel) or other clickable interactions.
     * It leverages SLDS styling variants.
     * @extends LightningElement
     * @author YourNameHere <your.email@example.com>
     * @since 1.0.0
     */
    export default class MyGenericButton extends LightningElement {
        // ... (properties, methods, etc.)
    }
    ```

---

## 2. Documenting `@api` Properties

Every `@api` property must have its own JSDoc block immediately preceding it.

* **Required Tags:**
    * `@type {<JavaScript Type>}` (e.g., `string`, `boolean`, `number`, `object`, `Array<string>`, `('option1'|'option2')` for enums.)
    * `@default <Default Value>` (Must match the code's default value.)
    * `@description` (Clear explanation of what the property does.)
* **Content in Description for Enum/Options:** If the type has limited options (like `variant` or `type`), list them out with brief explanations within the `@description`.

* **Examples:**

    ```javascript
    // ... (inside MyGenericButton class) ...

    /**
     * @type {string}
     * @default ''
     * @description Additional CSS classes to apply directly to the button element.
     * Allows for custom styling beyond predefined variants.
     */
    @api buttonClass = "";

    /**
     * @type {string}
     * @default 'button'
     * @description The text displayed on the button.
     */
    @api label = "button";

    /**
     * @type {('default'||'secondary'|'destructive'|'outline'|'ghost'|'link')}
     * @default 'default'
     * @description The visual styling variant of the button.
     * - 'default': Standard button styling.
     * - 'secondary': Less emphasized secondary action button.
     * - 'outline': Button with only a border and transparent background.
     */
    @api variant = "default";

    // ... (other properties) ...
    ```

---

## 3. Documenting Methods (Public and Private)

Both public and private methods should be documented. Private methods usually start with an underscore `_`.

* **Required Tags:**
    * `@description`
    * `@private` (for private methods)
    * `@param {<Type>} <name> - <Description>` (for each parameter)
    * `@returns {<Type>} - <Description>` (if the method returns a value)

* **Examples:**

```javascript
    // ... (inside MyGenericButton class) ...

    /**
     * @description Handles the click event on the button element.
     * Prevents default action and dispatches a custom event if the button is not disabled.
     * @param {Event} event - The DOM click event.
     */
    handleClick(event) { /* ... */ }

    /**
     * @description Private method to dispatch the 'buttonaction' custom event.
     * Centralizes the event creation and payload definition.
     * @private
     */
    _dispatchButtonAction() { /* ... */ }

    /**
   * @method toggle
   * @memberof <className>
   * @description Public method to toggle the expanded state of the accordion section.
   *              If an argument is provided, it sets the expanded state to that value.
   *              Otherwise, it toggles the current state.
   *
   * @param {boolean} [expand] - Optional. The desired expanded state.
   * @returns {void}
   * @public
   */
   @api
   toggle(expand) { /* ... */ }
```

---

## 4. Documenting Custom Events

Custom events dispatched by the component should have a dedicated JSDoc block, typically placed right before the `dispatchEvent` call or in a section outlining all events.

* **Required Tags:**
    * `@event <eventName>` (The actual name of the custom event, e.g., `buttonaction`.)
    * `@description` (Explains when the event fires and its purpose.)
    * `@param {object} detail - The event payload.` (Always indicate the `detail` object.)
    * `@param {<Type>} detail.<propertyName> - <Description>` (Document each property within the `detail` object.)
    * `@example` (Provide an HTML and/or JavaScript example of how a parent component consumes this event.)

* **Example:**

    ```javascript
    // ... (inside _dispatchButtonAction method) ...

        /**
         * @event buttonaction
         * @description Fired when the button is clicked (and is not disabled).
         * The parent component can use this event to determine which action
         * (e.g., submit, reset, cancel) to perform.
         * @param {object} detail - The event payload.
         * @param {string} detail.actionType - The HTML `type` of the button that was clicked
         * ('button', 'submit', or 'reset').
         * @param {string} detail.buttonLabel - The label text of the button that was clicked.
         * @example
         * // Parent component HTML:
         * // <c-my-generic-button onbuttonaction={handleFormAction}></c-my-generic-button>
         *
         * // Parent component JavaScript:
         * // handleFormAction(event) {
         * //   const { actionType, buttonLabel } = event.detail;
         * //   console.log(`Action: ${actionType}, Label: ${buttonLabel}`);
         * // }
         */
        this.dispatchEvent(new CustomEvent('buttonaction', { /* ... */ }));
    ```
