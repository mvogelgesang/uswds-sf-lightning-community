({
  composeButtonTypeAttributes: function (cmp, event, helper) {
    const buttonType = cmp.get("v.buttonType");
    const buttonMap = helper.buttonTypeMap(buttonType);

    // pull together the various classes needed for the button. customClass comes last so as to override any prior settings.
    const classes = [
      "usa-button",
      buttonMap,
      cmp.get("v.big") ? "usa-button--big" : "",
      cmp.get("v.unstyled") ? "usa-button--unstyled" : "",
      cmp.get("v.customClassName")
    ]
      .filter(Boolean) // clears out any empty strings
      .join(" ")
      .trim();
    cmp.set("v.class", classes);
  },
  onClick: function (cmp, event, helper) {
    var compEvent = cmp.getEvent("buttonClickEventHandler");
    compEvent.fire();
  }
});
