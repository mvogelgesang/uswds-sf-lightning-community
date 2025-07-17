import { LightningElement, api } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

/**
 * @class
 * @alias uswds-footer-container
 * @description Container component for USWDS footer that handles styling and asset loading.
 * Supports different footer types (Big, Medium, Slim) with appropriate CSS classes.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 2024 */
export default class UswdsFooterContainer extends LightningElement {
  /**
   * @type {('Big'|'Medium'|'Slim')}
   * @default 'Big'
   * @description The type of footer to display.
   * - Big: Full footer with multiple sections and links
   * - Medium: Standard footer (uses base usa-footer class)
   * - 'Slim': Compact footer with minimal content
   */
  @api type = "Big";

  /**
   * @type {boolean}
   * @default false
   * @description Internal flag to track if the USWDS assets have been initialized.
   * @private
   */
  uswdsInitialized = false;

  /**
   * @description Lifecycle hook to load USWDS assets after the component is rendered.
   * @private
   */
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
   * @description Computes the CSS classes for the footer container based on the type property.
   * @returns {string} The CSS classes to apply to the footer container.
   * @private
   */
  get footerContainerClasses() {
    var classes = "usa-footer";
    if (this.type.toLowerCase() == "big") {
      classes += " usa-footer--big";
    }
    // medium footer just uses base usa-footer class
    else if (this.type.toLowerCase() == "slim") {
      classes += " usa-footer--slim";
    }
    return classes;
  }
}
