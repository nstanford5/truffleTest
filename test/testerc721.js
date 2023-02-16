const testerc721 = artifacts.require('testerc721.sol');

contract('testerc721', () => {
  it('should create contract', async () => {
    const storage = await testerc721.new("testerc721", "TERC"); 
  })
})