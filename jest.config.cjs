/* eslint-disable no-undef */

module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFiles: ["./jest.setup.js"],
    transform: {
        "^.+\\.jsx?$": "babel-jest", 
    },
    extensionsToTreatAsEsm: [".js"],
    esModuleInterop: true,
};
