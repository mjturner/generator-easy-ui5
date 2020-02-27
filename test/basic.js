const assert = require("yeoman-assert");
const path = require("path");
const helpers = require("yeoman-test");
const execa = require("execa");

function createTest(oPrompt) {
  describe(Object.values(oPrompt).join("-"), function () {
    this.timeout(200000);

    it("should be able to create the project", function () {
      return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(oPrompt);
    });

    it("should create the necessary ui5 files", function () {
      return assert.file(["ui5.yaml", `webapp/view/MainView.view.${oPrompt.viewtype.toLowerCase()}`, "webapp/index.html", "webapp/manifest.json"]);
    });

    it("should create an installable project", function () {
      return execa.commandSync("npm install");
    });

    it("should create valid code (run inner test suite)", async function () {
      try {
        await execa.commandSync("npm run test");
      } catch (e) {
        throw new Error(e.stdout + "\n" + e.stderr);
      }
    });

    if (!!oPrompt.platform && oPrompt.platform !== "Static webserver") {
      it("should create an buildable project", async function () {
        try {
          await execa.commandSync("npm run build:mta");
        } catch (e) {
          throw new Error(e.stdout + "\n" + e.stderr);
        }
      });
    }

  });
}

describe("Basic project capabilities", function () {

  createTest({ viewtype: "XML", platform: "Application Router @ Cloud Foundry" });
  createTest({ viewtype: "JSON", ui5libs: "Local resources (OpenUI5)" });
  createTest({ viewtype: "JS" });
  createTest({ viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ Cloud Foundry" });
  createTest({ viewtype: "JSON", platform: "Fiori Launchpad on Cloud Foundry" });
  createTest({ viewtype: "XML", platform: "Cloud Foundry HTML5 Application Repository" });
  createTest({ viewtype: "XML", platform: "Application Router @ SAP HANA XS Advanced" });
  createTest({ viewtype: "JSON", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced" });
  createTest({ viewtype: "HTML", platform: "Cloud Foundry HTML5 Application Repository" });
  createTest({ viewtype: "JS", platform: "Cloud Foundry HTML5 Application Repository" });
  createTest({ viewtype: "HTML", ui5libs: "Local resources (OpenUI5)", platform: "Application Router @ SAP HANA XS Advanced" });
  createTest({ viewtype: "JS", ui5libs: "Local resources (OpenUI5)", platform: "Cloud Foundry HTML5 Application Repository" });

});
