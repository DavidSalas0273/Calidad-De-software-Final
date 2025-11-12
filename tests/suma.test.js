const sumaModule = require('../suma');
const suma =
  sumaModule.default ||
  sumaModule.suma ||
  (typeof sumaModule === 'function' ? sumaModule : undefined);

if (typeof suma !== 'function') {
  throw new Error('No se pudo importar la función suma');
}

test('suma básica', () => {
  expect(suma(2, 3)).toBe(5);
});
