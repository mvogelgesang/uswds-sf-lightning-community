import { LightningElement, api } from "lwc";

/**
 * @class
 * @alias uswds-footer-builder
 * @description Experience Builder property editor component for the USWDS Footer.
 * Provides configuration options for footer type selection in the Experience Builder.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 2024 */
export default class UswdsFooterBuilder extends LightningElement {
  /**
   * @type {('Big|Medium'|'Slim')}
   * @default 'Big'
   * @description The type of footer to display.
   * - Big: Full footer with multiple sections and links
   * - Medium: Standard footer (uses base usa-footer class)
   * - 'Slim': Compact footer with minimal content
   */
  @api type = "Big";
}
