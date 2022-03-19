({
  buttonTypeMap: function (buttonType) {
    buttonType = buttonType.toLowerCase();
    // default english language content
    var buttonTypes = {
      "secondary color": "usa-button--secondary",
      "accent cool color": "usa-button--accent-cool",
      "accent warm color": "usa-button--accent-warm",
      "base color": "usa-button--base",
      outline: "usa-button--outline",
      "outline inverse": "usa-button--outline usa-button--inverse"
    };

    return buttonTypes[buttonType] ? buttonTypes[buttonType] : "";
  }
});
