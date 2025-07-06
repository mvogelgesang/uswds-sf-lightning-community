/**
 * @class
 * @alias c-uswds-side-navigation
 * @description A USWDS-compliant side navigation component that displays hierarchical navigation items with support for nested sub-menus.
 * Integrates with the navigationUtils service to handle different types of navigation actions including internal links,
 * external links, events, and custom component swapping.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 1.0.0
 */
import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { navigate } from "c/navigationUtils";

/**
 * @description Recursively processes navigation items to mark the current item and generate CSS classes.
 * @param {Array} items - Array of navigation items to process
 * @param {string} currentId - The ID of the currently selected navigation item
 * @returns {Array} Array of navigation items with isCurrent flag, ariaCurrent attribute, and className properties
 * @private
 */
function markCurrent(items, currentId) {
  return (items || []).map((item) => {
    const subMenuItems = item.subMenuItems
      ? markCurrent(item.subMenuItems, currentId)
      : [];
    const isCurrent = item.id === currentId;
    return {
      ...item,
      isCurrent,
      ariaCurrent: isCurrent ? "page" : null,
      className: `usa-sidenav__item${isCurrent ? " usa-current" : ""}`,
      subMenuItems
    };
  });
}

export default class UswdsSideNavigation extends NavigationMixin(
  LightningElement
) {
  /**
   * @type {string}
   * @default 'Side Navigation'
   * @description The label displayed for the navigation component, typically used for accessibility.
   */
  @api navigationLabel = "Side Navigation";

  /**
   * @type {Array}
   * @default []
   * @description Array of navigation items to display in the side navigation.
   * Each item should have an id, label, and optionally subMenuItems and actionType properties.
   */
  @api navigationItems = [];

  /**
   * @type {string}
   * @description The ID of the navigation item that should be marked as current/active on initial render.
   * If not provided, the first item in the navigationItems array will be selected.
   */
  @api initialNavId;

  /**
   * @type {string}
   * @description The ID of the currently selected navigation item.
   * @private
   */
  _currentNavId;

  /**
   * @type {Array}
   * @description The processed navigation items with current state and CSS classes applied.
   * @private
   */
  _navigationItems = [];

  /**
   * @description Lifecycle hook that runs after every render. Updates the navigation state when
   * navigationItems or initialNavId change. Ensures the current navigation item is properly marked
   * and CSS classes are applied.
   * @private
   */
  renderedCallback() {
    if (
      this.navigationItems &&
      this.navigationItems.length > 0 &&
      (this._currentNavId !== this.initialNavId ||
        this._navigationItems.length === 0)
    ) {
      this._currentNavId = this.initialNavId || this.navigationItems[0]?.id;
      this._navigationItems = markCurrent(
        this.navigationItems,
        this._currentNavId
      );
    }
  }

  /**
   * @description Getter that returns the computed navigation items with current state applied.
   * Used in the template for rendering the navigation structure.
   * @returns {Array} Array of navigation items with current state and CSS classes
   */
  get navigationItemsComputed() {
    return this._navigationItems;
  }

  /**
   * @description Public method to programmatically set the current navigation item.
   * Updates the internal state and triggers a re-render with the new current item marked.
   * @param {string} id - The ID of the navigation item to set as current
   * @public
   */
  setCurrentNavId(id) {
    this._currentNavId = id;
    this._navigationItems = markCurrent(this.navigationItems, id);
  }

  /**
   * @description Handles click events on navigation items. Prevents default behavior,
   * updates the current navigation state, and triggers navigation using the navigationUtils service.
   * @param {Event} event - The DOM click event from the navigation item
   * @private
   */
  handleSelect(event) {
    event.preventDefault();
    const navId = event.currentTarget.dataset.id;
    this.setCurrentNavId(navId);
    const selectedItem = this._navigationItems.find(
      (item) => item.id === navId
    );
    if (selectedItem) {
      navigate(this, selectedItem);
    }
  }
}
