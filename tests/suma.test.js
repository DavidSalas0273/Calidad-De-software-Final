/* eslint-env jest */

const suma = require("../suma/index.js");

test("suma básica", () => {
  expect(suma(2, 3)).toBe(5);
});
