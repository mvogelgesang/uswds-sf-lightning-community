describe("USWDS Button", function () {
  afterEach(function () {
    // Each spec (test) renders its components into the same div,
    // so we need to clear that div out at the end of each spec.
    $T.clearRenderedTestComponents();
  });
  describe("default settings", function () {
    it("Displays 'Button' within component", function (done) {
      $T.createComponent("c:uswdsButton", {}, true)
        .then(function (component) {
          expect(
            document.querySelector("[data-testid='button']").textContent
          ).toContain("Button");
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
    it("Includes base usa-button class", function (done) {
      $T.createComponent("c:uswdsButton", {}, true)
        .then(function (component) {
          expect(
            document.querySelector("[data-testid='button']").className
          ).toBe("usa-button");
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
  });
  describe("Button Types", function () {
    const buttonTypes = {
      "secondary color": "usa-button--secondary",
      "accent cool color": "usa-button--accent-cool",
      "accent warm color": "usa-button--accent-warm",
      "base color": "usa-button--base",
      outline: "usa-button--outline",
      "outline inverse": "usa-button--outline usa-button--inverse"
    };
    for (const button in buttonTypes) {
      it(`${button} displays '${buttonTypes[button]}' classes`, function (done) {
        $T.createComponent("c:uswdsButton", { buttonType: button }, true)
          .then(function (component) {
            expect(
              document.querySelector("[data-testid='button']").className
            ).toBe(`usa-button ${buttonTypes[button]}`);
            done();
          })
          .catch(function (e) {
            done.fail(e);
          });
      });
    }
  });
  describe("optional settings and attributes", function () {
    const optionalSettings = {
      big: "usa-button--big",
      unstyled: "usa-button--unstyled"
    };
    for (const setting in optionalSettings) {
      it(`${setting} includes css class '${optionalSettings[setting]}'`, function (done) {
        $T.createComponent(
          "c:uswdsButton",
          { [setting]: optionalSettings[setting] },
          true
        )
          .then(function (component) {
            expect(
              document.querySelector("[data-testid='button']").className
            ).toBe(`usa-button ${optionalSettings[setting]}`);
            done();
          })
          .catch(function (e) {
            done.fail(e);
          });
      });
    }
    it(`disabled attribute set`, function (done) {
      $T.createComponent("c:uswdsButton", { disabled: "true" }, true)
        .then(function (component) {
          expect(
            document
              .querySelector("[data-testid='button']")
              .getAttribute("disabled")
          ).toBe(""); // if not set, null would be expected
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
    it(`Button label can be set`, function (done) {
      $T.createComponent(
        "c:uswdsButton",
        { buttonLabel: "this is a big label" },
        true
      )
        .then(function (component) {
          expect(
            document.querySelector("[data-testid='button']").textContent
          ).toContain("this is a big label");
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
    it(`Custom class gets passed`, function (done) {
      $T.createComponent("c:uswdsButton", { disabled: "true" }, true)
        .then(function (component) {
          expect(
            document
              .querySelector("[data-testid='button']")
              .getAttribute("disabled")
          ).toBe(""); // if not set, null would be expected
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
  });
  describe("Handle button clicks via event propogation via various means", function () {
    it("Upon click places text into paragraph", function (done) {
      //lightning:tile
      $T.createComponent("c:testButtonWrapper", {}, true)
        .then(function (component) {
          expect(
            document.querySelectorAll("[data-testid='button']")[0].textContent
          ).toContain("Button");
          //click the button
          var button = component.find("uswdsButton");
          button.getElement().click();
          expect(
            document.getElementById("testParagraph").textContent
          ).toContain("I was clicked");
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
    it("Changes buttonType onclick", function (done) {
      $T.createComponent("c:testButtonWrapper", {}, true)
        .then(function (component) {
          //click the button
          var button = component.find("changeColor");
          button.getElement().click();
          expect(
            document
              .querySelectorAll("[data-testid='button']")[1]
              .getAttribute("class")
          ).toBe("usa-button usa-button--secondary");
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
    it("Changes to disabled onclick", function (done) {
      var buttonName = "disable";
      $T.createComponent("c:testButtonWrapper", { name: buttonName }, true)
        .then(function (component) {
          //click the button
          var button = component.find("disableMe");
          button.getElement().click();
          expect(
            document
              .querySelectorAll("[data-testid='button']")[2]
              .hasAttribute("disabled")
          ).toBe(true);
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
  });
});
