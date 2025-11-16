/* eslint-env jest */

import suma from "../suma/index.js";

test("suma básica", () => {
  expect(suma(2, 3)).toBe(5);
});
