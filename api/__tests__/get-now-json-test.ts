import { buildConfig } from '../get-now-json'

describe('#buildConfig', () => {
  it('should always return an object with version and public property set to 2 and false', () => {
    expect(buildConfig({})).toEqual({ version: 2, public: false })
  })
  it('should update version property if one is provided', () => {
    expect(
      buildConfig({
        version: '300'
      })
    ).toEqual({
      public: false,
      version: 300
    })
  })

  it('should update public property if one is provided', () => {
    expect(
      buildConfig({
        public: 'true'
      })
    ).toEqual({
      public: true,
      version: 2
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
      public: false,
      version: 2
    })
  })
  ;['builds', 'routes', 'regions'].forEach(key => {
    it(`should always return ${key} as an array`, () => {
      expect(
        buildConfig({
          [key]: '"a"'
        })
      ).toEqual({ version: 2, public: false, [key]: ['a'] })
      expect(
        buildConfig({
          [key]: '["a"]'
        })
      ).toEqual({ version: 2, public: false, [key]: ['a'] })
      expect(
        buildConfig({
          [key]: ['a', 'b']
        })
      ).toEqual({ version: 2, public: false, [key]: ['a', 'b'] })
    })
  })
})
