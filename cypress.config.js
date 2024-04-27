const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://rarocrud-frontend-88984f6e4454.herokuapp.com',
    supportFile: 'cypress/support/commands.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
