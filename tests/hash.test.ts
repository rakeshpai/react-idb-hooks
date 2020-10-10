import { expect } from "chai";
import createHashFromObject from "../src/create-hash-from-object";

describe('Hash tests', () => {
  it('should hash an object', () => {
    expect(createHashFromObject({ foo: 'bar' }))
      .to.eql(createHashFromObject({ foo: 'bar' }));
    
    expect(createHashFromObject({ abc: 'foo', xyz: 'bar' }))
      .to.eql(createHashFromObject({ xyz: 'bar', abc: 'foo' }));

    expect(createHashFromObject({ abc: 'foo', xyz: 'bar' }))
      .to.not.eql(createHashFromObject({ abc: 'foo', xyz: 'baz' }))
  });
});
