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
      $T.createComponent("c:uswdsButton", { buttonLabel: "this is a big label" }, true)
        .then(function (component) {
          expect(
            document
              .querySelector("[data-testid='button']")
              .textContent)
              .toContain("this is a big label");
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
    it(`Other attributes can be passed as key value pairs- illegitimate attributes do not get displayed`, function (done) {
      $T.createComponent(
        "c:uswdsButton",
        {
          props: {
            name: "buttonName",
            type: "submit",
            value: "buttonValue",
            notALegitAttribute: "blah"
          }
        },
        true
      )
        .then(function (component) {
          expect(
            document
              .querySelector("[data-testid='button']")
              .getAttribute("name")
          ).toBe("buttonName");
          expect(
            document
              .querySelector("[data-testid='button']")
              .getAttribute("type")
          ).toBe("submit");
          expect(
            document
              .querySelector("[data-testid='button']")
              .getAttribute("notALegitAttribute")
          ).toBe(null);
          done();
        })
        .catch(function (e) {
          done.fail(e);
        });
    });
  });
});
