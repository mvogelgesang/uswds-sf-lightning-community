import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { navigate } from "c/navigationUtils";

function markCurrent(items, currentId) {
  return (items || []).map((item) => {
    const subMenuItems = item.subMenuItems
      ? markCurrent(item.subMenuItems, currentId)
      : [];
    const isCurrent = item.id === currentId;
    return {
      ...item,
      isCurrent,
      className: `usa-sidenav__item${isCurrent ? " usa-current" : ""}`,
      subMenuItems
    };
  });
}

export default class UswdsSideNavigation extends NavigationMixin(
  LightningElement
) {
  @api navigationLabel = "Side Navigation";
  @api navigationItems = [];
  @api initialNavId;

  _currentNavId;
  _navigationItems = [];

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

  get navigationItemsComputed() {
    return this._navigationItems;
  }

  setCurrentNavId(id) {
    this._currentNavId = id;
    this._navigationItems = markCurrent(this.navigationItems, id);
  }

  handleSelect(event) {
    event.preventDefault();
    const navId = event.currentTarget.dataset.id;
    this.setCurrentNavId(navId);
    const selectedItem = this._navigationItems.find(
      (item) => item.id === navId
    );
    if (selectedItem) {
      // This is the only navigation code this component needs!
      // It passes its own context (`this`) and the navigation request.
      navigate(this, selectedItem);
    }
  }
}
