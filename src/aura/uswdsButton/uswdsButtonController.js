({
  doInit: function (cmp, event, helper) {
    const buttonType = cmp.get("v.buttonType");
    const disabled = cmp.get("v.disabled");
    const buttonMap = helper.buttonTypeMap(buttonType);
    const customClass = cmp.get("v.customClassName");
    // pull together the various classes needed for the button. customClass comes last so as to override any prior settings.
    const classes = [
      "usa-button",
      buttonMap,
      cmp.get("v.big") ? "usa-button--big" : "",
      cmp.get("v.unstyled") ? "usa-button--unstyled" : "",
      customClass
    ]
      .filter(Boolean) // clears out any empty strings
      .join(" ")
      .trim();

    const buttonLabel = cmp.get("v.buttonLabel");
    const props = cmp.get("v.props");
    $A.createComponent(
      "aura:html",
      {
        tag: "button",
        body: buttonLabel,
        //takes any key value pairs passed as an object in props as well as outputs from classnames() to produce attribute pairs
        HTMLAttributes: Object.assign(
          props,
          { disabled: disabled },
          { class: classes },
          { "data-testid": "button" }
        )
      },
      function (buttonComponent, status, errorMessage) {
        if (status === "SUCCESS") {
          // Finding the div by aura:id and pushing newly created component into it.
          var outerDiv = cmp.find("buttonContainer").get("v.body");
          outerDiv.push(buttonComponent);
          cmp.find("buttonContainer").set("v.body", outerDiv);
        }
        if (status === "ERROR") {
          console.error(errorMessage);
        }
      }
    );
  },
  onClick: function (cmp, event, helper) {
    var id = event.target.dataset.menuItemId;
    if (id) {
      cmp.getSuper().navigate(id);
    }
  }
});
