/**
 * @class
 * @alias c-uswds-side-navigation-builder
 * @description A builder component for USWDS side navigation that integrates with Experience Builder.
 * Loads navigation menu items from Salesforce NavigationLinkSet and renders them using the USWDS side navigation component.
 * Supports both Live and Draft navigation menus based on the current context (Experience Builder vs. published site).
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 1.0.0
 */
import { LightningElement, api, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource
import getMenuItems from "@salesforce/apex/UswdsNavigationMenuItems.getMenuItems";

export default class UswdsSideNavigationBuilder extends LightningElement {
  /**
   * @type {string}
   * @description The DeveloperName of the navigation menu to display.
   * This property is set by the Experience Builder property editor.
   */
  @api menuDeveloperName;

  /**
   * @type {boolean}
   * @default false
   * @description Whether to add a home menu item to the navigation.
   * When true, a home link will be prepended to the navigation items.
   */
  @api addHomeMenuItem = false;

  /**
   * @type {Array}
   * @default []
   * @description Array of navigation menu items loaded from the NavigationLinkSet.
   * Each item contains navigation data with labels, links, and optional sub-menu items.
   */
  menuItems = [];

  /**
   * @type {Object}
   * @description Error object if the menu items failed to load.
   * Contains error details from the Apex callout.
   */
  error;

  /**
   * @type {string}
   * @description The publish status to use when loading navigation menu items.
   * Set to 'Draft' when in Experience Builder, 'Live' otherwise.
   */
  publishStatus;

  /**
   * @type {boolean}
   * @default false
   * @description Flag to track whether USWDS assets have been initialized.
   * Prevents multiple initialization attempts.
   * @private
   */
  uswdsInitialized = false;

  /**
   * @description Lifecycle hook that runs after every render. Loads USWDS CSS and JavaScript
   * resources on the first render to ensure proper styling and functionality.
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
   * @description Getter that extracts the NetworkId from the menuDeveloperName.
   * The NetworkId is the first 15 characters of the menuDeveloperName.
   * @returns {string} The NetworkId portion of the menuDeveloperName
   * @private
   */
  get _networkId() {
    return this.menuDeveloperName
      ? this.menuDeveloperName.substring(0, 15)
      : "";
  }

  /**
   * @description Getter that extracts the DeveloperName from the menuDeveloperName.
   * The DeveloperName is everything after the 18th character (after the NetworkId and separator).
   * @returns {string} The DeveloperName portion of the menuDeveloperName
   * @private
   */
  get _developerName() {
    return this.menuDeveloperName ? this.menuDeveloperName.substring(18) : "";
  }

  /**
   * @description Lifecycle hook that runs when the component is inserted into the DOM.
   * Currently empty but available for future initialization logic.
   * @private
   */
  connectedCallback() {}

  /**
   * @description Wire service method that loads navigation menu items from the Apex controller.
   * Handles both successful data loading and error scenarios.
   * @param {Object} result - The wire service result object
   * @param {Array} result.data - Array of navigation menu items
   * @param {Object} result.error - Error object if the callout failed
   * @private
   */
  @wire(getMenuItems, {
    menuDeveloperName: "$_developerName",
    networkId: "$_networkId",
    publishStatus: "$publishStatus",
    includeImageUrl: false,
    addHomeMenuItem: "$addHomeMenuItem"
  })
  wiredMenuItems({ error, data }) {
    if (data) {
      this.menuItems = data || [];
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.menuItems = [];
      console.error("Error loading navigation menu items:", error);
    }
  }

  /**
   * @description Getter that checks if menu items are available for rendering.
   * Used in the template to conditionally render the navigation component.
   * @returns {boolean} True if menu items exist and have length greater than 0
   */
  get hasMenuItems() {
    return this.menuItems && this.menuItems.length > 0;
  }

  /**
   * @description Wire service method that determines the publish status based on the current page reference.
   * Sets the publish status to 'Draft' when in Experience Builder (commeditor app),
   * otherwise sets it to 'Live' for published sites.
   * @param {Object} currentPageReference - The current page reference object
   * @private
   */
  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    const app =
      currentPageReference &&
      currentPageReference.state &&
      currentPageReference.state.app;
    if (app === "commeditor") {
      this.publishStatus = "Draft";
    } else {
      this.publishStatus = "Live";
    }
  }
}
