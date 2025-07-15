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

import { LightningElement, api } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import { NavigationMixin } from "lightning/navigation";
import { navigate } from "c/navigationUtils";

import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource
import uswdsIdentifier_mastheadSectionLabel from "@salesforce/label/c.uswdsIdentifier_mastheadSectionLabel";
import uswdsIdentifier_disclaimer from "@salesforce/label/c.uswdsIdentifier_disclaimer";
import uswdsIdentifier_taxpayerDisclaimer from "@salesforce/label/c.uswdsIdentifier_taxpayerDisclaimer";
import uswdsIdentifier_requiredLinksSectionLabel from "@salesforce/label/c.uswdsIdentifier_requiredLinksSectionLabel";
import uswdsIdentifier_sectionUsaGov from "@salesforce/label/c.uswdsIdentifier_sectionUsaGov";
import uswdsIdentifier_usaGovDesc from "@salesforce/label/c.uswdsIdentifier_usaGovDesc";
import uswdsIdentifier_usaGovLink from "@salesforce/label/c.uswdsIdentifier_usaGovLink";
import uswdsIdentifier_mastheadConjunction from "@salesforce/label/c.uswdsIdentifier_mastheadConjunction";

/**
 * @class
 * @alias uswds-identifier
 * @description Displays the USWDS identifier banner, including agency masthead, navigation, and required links.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 2024-06
 */
export default class UswdsIdentifier extends NavigationMixin(LightningElement) {
  /**
   * @type {string}
   * @default ""
   * @description The domain name to display in the identifier banner.
   */
  @api domain = "";

  /**
   * @type {boolean}
   * @default false
   * @description Whether to show the taxpayer disclaimer.
   */
  @api taxPayerDisclaimer = false;

  /**
   * @type {Array<UswdsNavMenuItem>}
   * @default []
   * @description Array of masthead navigation menu items (agencies) to display.
   */
  @api mastheadMenuItems = [];

  /**
   * @type {Array<UswdsNavMenuItem>}
   * @default []
   * @description Array of main navigation menu items to display.
   */
  @api mainMenuItems = [];

  /**
   * @type {boolean}
   * @default false
   * @description Internal flag to track if the USWDS assets have been initialized.
   * @private
   */
  uswdsInitialized = false;

  /**
   * @description Object containing all the label strings used in the banner.
   * @type {Object}
   * @private
   */
  label = {
    uswdsIdentifier_mastheadSectionLabel,
    uswdsIdentifier_disclaimer,
    uswdsIdentifier_taxpayerDisclaimer,
    uswdsIdentifier_requiredLinksSectionLabel,
    uswdsIdentifier_sectionUsaGov,
    uswdsIdentifier_usaGovDesc,
    uswdsIdentifier_usaGovLink,
    uswdsIdentifier_mastheadConjunction
  };

  /**
   * @description Determines if we should show a conjunction between two items.
   * @returns {boolean} True if there are exactly 2 items.
   * @private
   */
  get mastheadTwoItemConjunction() {
    return this.mastheadMenuItems && this.mastheadMenuItems.length === 2;
  }

  /**
   * @description Gets the appropriate conjunction text based on number of items.
   * @returns {string} The conjunction text to display.
   * @private
   */
  get mastheadConjunction() {
    if (!this.mastheadMenuItems) {
      return "";
    }
    const count = this.mastheadMenuItems.length;
    return count >= 2 ? this.label.uswdsIdentifier_mastheadConjunction : "";
  }

  /**
   * @description Returns mastheadMenuItems with computed formatting properties for rendering.
   * @returns {Array<object>} Array of menu items with formatting flags.
   * @private
   */
  get formattedMastheadMenuItems() {
    if (!this.mastheadMenuItems || this.mastheadMenuItems.length === 0) {
      return [];
    }
    return this.mastheadMenuItems.map((item, index) => {
      const isLast = index === this.mastheadMenuItems.length - 1;
      const isSecondToLast = index === this.mastheadMenuItems.length - 2;
      const hasMoreThanTwo = this.mastheadMenuItems.length > 2;
      return {
        ...item,
        showComma: hasMoreThanTwo && !isLast && !isSecondToLast,
        showConjunction: isSecondToLast,
        commaKey: `${item.id}_comma`,
        conjunctionKey: `${item.id}_conjunction`
      };
    });
  }

  get hasOneOrMoreFormattedMastheadMenuItems() {
    return this.formattedMastheadMenuItems.length > 0;
  }

  /**
   * @description Handles click events on navigation items. Prevents default behavior,
   * updates the current navigation state, and triggers navigation using the navigationUtils service.
   * @param {Event} event - The DOM click event from the navigation item.
   * @private
   */
  handleSelect(event) {
    event.preventDefault();
    const navId = event.currentTarget.dataset.id;
    const navType = event.currentTarget.dataset.navtype; // "masthead" or "mainnav"
    let navArray = [];
    if (navType === "masthead") {
      navArray = this.mastheadMenuItems;
    } else if (navType === "mainnav") {
      navArray = this.mainMenuItems;
    } else {
      navArray = [];
    }
    const selectedItem = navArray.find((item) => item.id === navId);
    if (selectedItem) {
      navigate(this, selectedItem);
    }
  }

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
}
