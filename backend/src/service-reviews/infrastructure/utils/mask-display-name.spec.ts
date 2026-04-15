import { maskDisplayName } from './mask-display-name';

describe('maskDisplayName', () => {
  it('enmascara email', () => {
    expect(maskDisplayName('diana@gmail.com')).toMatch(/\*\*\*/);
  });

  it('enmascara nombre largo', () => {
    expect(maskDisplayName('Cinthya')).toMatch(/^Ci\*\*\*ya$/);
  });

  it('vacío devuelve Usuario', () => {
    expect(maskDisplayName('   ')).toBe('Usuario');
  });
});
