const myERC = artifacts.require('myERC.sol');

contract('myERC', () => {
  it('should test constructor', async () => {
    const storage = await myERC.new("myERC", "MERC");
  })
})