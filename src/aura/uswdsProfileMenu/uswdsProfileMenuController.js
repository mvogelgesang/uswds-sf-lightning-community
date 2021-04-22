({
  doInit: function (component, event, helper) {
    var userId = $A.get("$SObjectType.CurrentUser.Id");
    if (userId) {
      component.set("v.loggedIn", true);
    }
  },
  menuToggle: function(component, event, helper) {
    var profileMenu = component.find("menu-options");
    var chevron = component.find("profileMenuChevron");
    $A.util.toggleClass(profileMenu, "hidden");
    $A.util.toggleClass(chevron, "fa-chevron-down");
    $A.util.toggleClass(chevron, "fa-chevron-up");
  },
  handleMenuSelect: function (component, event, helper) {
    console.log("handling menu select");
    var selectedMenuItemValue = event.getParam("value");
    if (selectedMenuItemValue) {
      component.getSuper().navigate(selectedMenuItemValue);
    }
  }
});

