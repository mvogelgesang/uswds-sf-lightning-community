import { LightningElement, api, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import getMenuItems from "@salesforce/apex/UswdsNavigationMenuItems.getMenuItems";

/**
 * @typedef {Object} UswdsNavMenuItem
 * @property {string} id - Unique identifier for the menu item.
 * @property {string} label - The display label for the menu item.
 * @property {string} [actionValue] - The URL or navigation target for the menu item. (Optional)
 * @property {string} [target] - The target attribute for the link (e.g., '_blank', 'NewWindow'). (Optional)
 * @property {string} [imageUrl] - Optional image URL for the menu item. (Optional)
 * @property {boolean} [hasSubMenu] - Whether the item has a submenu. (Optional)
 * @property {Array<UswdsNavMenuItem>} [subMenuItems] - Submenu items, if any. (Optional)
 * @property {boolean} [opensInNewWindow] - Whether the link opens in a new window. (Optional)
 * @property {string} [actionType] - The type of action (e.g., 'ExternalLink'). (Optional)
 */

/**
 * @class
 * @alias uswds-identifier-builder
 * @description LWC controller for the Experience Builder property editor for the USWDS Identifier. Loads and wires navigation menu data for preview.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 2024-06
 */
export default class UswdsIdentifierBuilder extends LightningElement {
  /**
   * @type {string}
   * @description The domain name to display in the identifier preview.
   */
  @api domain;
  /**
   * @type {boolean}
   * @description Whether to show the taxpayer disclaimer in the preview.
   */
  @api taxPayerDisclaimer;
  /**
   * @type {string}
   * @description The DeveloperName of the masthead navigation menu to display.
   * This property is set by the Experience Builder property editor.
   */
  @api mastheadNavDeveloperName;
  /**
   * @type {string}
   * @description The DeveloperName of the main navigation menu to display.
   * This property is set by the Experience Builder property editor.
   */
  @api mainNavDeveloperName;
  /**
   * @type {boolean}
   * @default false
   * @description Whether to add a home menu item to the navigation.
   * When true, a home link will be prepended to the navigation items.
   */
  @api addHomeMenuItem = false;
  /**
   * @type {Array<UswdsNavMenuItem>}
   * @default []
   * @description Array of navigation menu items loaded from the NavigationLinkSet for the main nav.
   */
  mainNavMenuItems = [];
  /**
   * @type {Array<UswdsNavMenuItem>}
   * @default []
   * @description Array of navigation menu items loaded from the NavigationLinkSet for the masthead nav.
   */
  mastheadMenuItems = [];
  /**
   * @type {string}
   * @description The publish status to use when loading navigation menu items.
   * Set to 'Draft' when in Experience Builder, 'Live' otherwise.
   */
  publishStatus;

  /**
   * @description Getter that extracts the NetworkId from the mainNavDeveloperName.
   * The NetworkId is the first 15 characters of the mainNavDeveloperName.
   * @returns {string} The NetworkId portion of the mainNavDeveloperName
   * @private
   */
  get _mainNavNetworkId() {
    return this.mainNavDeveloperName
      ? this.mainNavDeveloperName.substring(0, 15)
      : "";
  }
  /**
   * @description Getter that extracts the NetworkId from the mainNavDeveloperName.
   * The NetworkId is the first 15 characters of the mainNavDeveloperName.
   * @returns {string} The NetworkId portion of the mainNavDeveloperName
   * @private
   */
  get _mastheadNavNetworkId() {
    return this.mastheadNavDeveloperName
      ? this.mastheadNavDeveloperName.substring(0, 15)
      : "";
  }

  /**
   * @description Getter that extracts the DeveloperName from the mainNavDeveloperName.
   * The DeveloperName is everything after the 18th character (after the NetworkId and separator).
   * @returns {string} The DeveloperName portion of the mainNavDeveloperName
   * @private
   */
  get _mastheadNavDeveloperName() {
    return this.mastheadNavDeveloperName
      ? this.mastheadNavDeveloperName.substring(18)
      : "";
  }
  /**
   * @description Getter that extracts the DeveloperName from the mainNavDeveloperName.
   * The DeveloperName is everything after the 18th character (after the NetworkId and separator).
   * @returns {string} The DeveloperName portion of the mainNavDeveloperName
   * @private
   */
  get _mainNavDeveloperName() {
    return this.mainNavDeveloperName
      ? this.mainNavDeveloperName.substring(18)
      : "";
  }

  /**
   * @description Wire service method that loads navigation menu items from the Apex controller.
   * Handles both successful data loading and error scenarios.
   * @param {Object} result - The wire service result object
   * @param {Array} result.data - Array of navigation menu items
   * @param {Object} result.error - Error object if the callout failed
   * @private
   */
  @wire(getMenuItems, {
    menuDeveloperName: "$_mainNavDeveloperName",
    networkId: "$_mainNavNetworkId",
    publishStatus: "$publishStatus",
    includeImageUrl: false,
    addHomeMenuItem: "$addHomeMenuItem"
  })
  wiredMainNavMenuItems({ error, data }) {
    if (data) {
      this.mainNavMenuItems = data || [];
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.mainNavMenuItems = [];
      console.error("Error loading navigation menu items:", error);
    }
  }

  /**
   * @description Wire service method that loads navigation menu items from the Apex controller.
   * Handles both successful data loading and error scenarios.
   * @param {Object} result - The wire service result object
   * @param {Array} result.data - Array of navigation menu items
   * @param {Object} result.error - Error object if the callout failed
   * @private
   */
  @wire(getMenuItems, {
    menuDeveloperName: "$_mastheadNavDeveloperName",
    networkId: "$_mastheadNavNetworkId",
    publishStatus: "$publishStatus",
    includeImageUrl: true,
    addHomeMenuItem: false
  })
  wiredMastheadNavMenuItems({ error, data }) {
    if (data) {
      this.mastheadMenuItems = data || [];
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.mastheadMenuItems = [];
      console.error("Error loading navigation menu items:", error);
    }
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
