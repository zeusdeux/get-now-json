import { buildConfig } from '../get-now-json'

describe('#buildConfig', () => {
  it('should always return an object with version property', () => {
    expect(buildConfig({})).toEqual({ version: 2 })
  })
  it('should update version property if one is provided', () => {
    expect(
      buildConfig({
        version: '300'
      })
    ).toEqual({
      version: 300
    })
  })

  it('should ignore non-now.json properties', () => {
    expect(
      buildConfig({
        a: '1',
        name: 'asd'
      })
    ).toEqual({
      name: 'asd',
      version: 2
    })
  })
  ;['builds', 'routes', 'regions'].forEach(key => {
    it(`should always return ${key} as an array`, () => {
      expect(
        buildConfig({
          [key]: '"a"'
        })
      ).toEqual({ version: 2, [key]: ['a'] })
      expect(
        buildConfig({
          [key]: '["a"]'
        })
      ).toEqual({ version: 2, [key]: ['a'] })
    })
  })
})
