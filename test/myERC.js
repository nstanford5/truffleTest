const myERC = artifacts.require('myERC.sol');

contract('myERC', () => {
  /**
   * Test 1
   * 
   * Create contract, return name and symbol. Simple constructor demonstration
   * and accessing contract functions.
   * 
   * FAIL: none
   */
  it('should test constructor, return name and symbol', async () => {
    const storage = await myERC.new("myERC", "MERC");

    const name = await storage.name();
    assert(name === "myERC", "name wrong");

    const symbol = await storage.symbol();
    assert(symbol === "MERC");
  })
  /**
   * Test 2
   * 
   * This starts another contract instance, so it will fail. 
   * Show that new tests need to create new instances.
   * 
   * FAIL: accessing old instance
   */
  it('should test instance2', async () => {
    try{
      const name2 = await storage.name();
      assert(name2 === "myERC");
    } catch (e) {
      console.log(`The test failed successfully: ${e}`);
    }
  })
  /**
   * Test 3
   * 
   * Mint an NFT, check the balance of the owners address, check ownership
   * of first tokenId.
   * 
   * FAIL: Mint to zero address
   */
  it('should mint, return balance, check token ID for owner', async () => {
    const storage = await myERC.new("myERC2", "MERC2");

    try {
      await storage.safeMint('0x0000000000000000000000000000000000000000');
    } catch (e) {
      console.log(`Mint test failed successfully: ${e}`);
    }

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    const amt = await storage.balanceOf('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    assert(amt.toString() === "1", "balance wrong");

    const addr = await storage.ownerOf(0);
    assert(addr == 0x1028c139157ab9be0eb649c6fc10fb792b21cb67, "address wrong");
  })
  /**
   * Test 4
   * 
   * Mint an entire collection for one contract address. The collection could
   * use AI generated art images hosted on IPFS.
   * 
   * FAIL: none.
   */
  it('should mint a collection', async () => {
    const storage = await myERC.new("myERC3", "MERC3");

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    const addr0 = await storage.ownerOf(0);
    assert(addr0 == 0x1028c139157ab9be0eb649c6fc10fb792b21cb67, "addr0 wrong");
    
    await storage.safeMint('0x9174521c0f0c48faf171a9129755e83d15aeae61');
    const addr1 = await storage.ownerOf(1);
    assert(addr1 == 0x9174521c0f0c48faf171a9129755e83d15aeae61, "addr1 wrong");
    
    await storage.safeMint('0x5bf5d31806a4599da5ce554f873eb20becd831ba');
    const addr2 = await storage.ownerOf(2);
    assert(addr2 == 0x5bf5d31806a4599da5ce554f873eb20becd831ba, "addr2 wrong");

    await storage.safeMint('0x59cba8c4545880c30a26c6073caa266c3120b964');
    const addr3 = await storage.ownerOf(3);
    assert(addr3 == 0x59cba8c4545880c30a26c6073caa266c3120b964, "addr3 wrong");

    await storage.safeMint('0x849d58ae76f2d5783a447a5dda3fb7110c6896e3');
    const addr4 = await storage.ownerOf(4);
    assert(addr4 == 0x849d58ae76f2d5783a447a5dda3fb7110c6896e3, "addr4 wrong");
    
    await storage.safeMint('0x50371ea88391c342501d53926e3ae2d32663f604');
    const addr5 = await storage.ownerOf(5);
    assert(addr5 == 0x50371ea88391c342501d53926e3ae2d32663f604, "addr5 wrong");
    
    await storage.safeMint('0x82a27c2b70ed658240becd4aa4510abca45abaeb');
    const addr6 = await storage.ownerOf(6);
    assert(addr6 == 0x82a27c2b70ed658240becd4aa4510abca45abaeb, "addr6 wrong");
    
    await storage.safeMint('0x58ff570794a5e9a23b840c5ed28471416e67414f');
    const addr7 = await storage.ownerOf(7);
    assert(addr7 == 0x58ff570794a5e9a23b840c5ed28471416e67414f, "addr7 wrong");
    
    await storage.safeMint('0x0d26f7f1bd92f01b81f57b562adb23bd80289523');
    const addr8 = await storage.ownerOf(8);
    assert(addr8 == 0x0d26f7f1bd92f01b81f57b562adb23bd80289523, "addr8 wrong");
    
    await storage.safeMint('0xbcfcb2ae864db0e703404a133bf7356fb45ac8cf');
    const addr9 = await storage.ownerOf(9);
    assert(addr9 == 0xbcfcb2ae864db0e703404a133bf7356fb45ac8cf, "addr9 wrong");
  })
  /**
   * Test 5
   * 
   * Simulate a sale, then transfer ownership. Check if the seller has access
   * to sell the token again with a failing test.
   * 
   * FAIL: seller is not owner
   */
  it('should transfer NFT', async () => {
    const storage = await myERC.new('myERC4', 'MERC4');

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    await storage.transferFrom('0x1028c139157ab9be0eb649c6fc10fb792b21cb67', '0x9174521c0f0c48faf171a9129755e83d15aeae61', 0);
    const owner = await storage.ownerOf(0);
    assert(owner == 0x9174521c0f0c48faf171a9129755e83d15aeae61, "transfer failed");

    // this will fail because addr0 no longer owns the NFT
    try {
      await storage.transferFrom('0x1028c139157ab9be0eb649c6fc10fb792b21cb67', '0x9174521c0f0c48faf171a9129755e83d15aeae61', 0);
    } catch (e) {
      console.log(`The transfer test failed successfully: ${e}`);
    }
  })
  /**
   * Test 6
   * 
   * Should test interface IDs, the standard requires implemting ERC165
   * 
   * FAIL: random interface ID (as booleans)
   */
  it('should test interface', async () => {
    // ERC165 interface ID == 0x80ac58cd
    const storage = await myERC.new('myERC5', 'MERC5');
    
    const b = await storage.supportsInterface('0x80ac58cd');
    console.log(`ERC165 interface support is: ${b}`);

    const b2 = await storage.supportsInterface('0xffffffff');
    console.log(`This interface id should return false is: ${!b2}`);

    const b3 = await storage.supportsInterface('0x12345678');
    console.log(`Support for this random number is: ${b3}`);
  })
  /**
   * Test 6
   * 
   * Why is does this not return correctly?
   * The value matches, the types return the same.
   * 
   * Hexadecimal numbers that conform to address specs 
   * are treated as an address literal
   */
  it('should test address return type', async () => {
    const storage = await myERC.new('myERC6', 'MERC6');

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    const addy = await storage.ownerOf(0);
    console.log(addy);// 0x1028c139157ab9be0eb649c6fc10fb792b21cb67
    console.log(typeof addy);// string
    console.log(typeof '0x1028c139157ab9be0eb649c6fc10fb792b21cb67');// string
    assert(addy == 0x1028c139157ab9be0eb649c6fc10fb792b21cb67, "address wrong");
  })
  /**
   * Test 7
   * 
   * Simulates one creator minting an entire collection to their wallet.
   */
  it('should mint a collection to a single owner', async () => {
    const storage = await myERC.new('myERC7', 'MERC7');

    for(let i = 0; i < 50; i++) {
      await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    }
    const balance = await storage.balanceOf('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    assert(balance.toString() === '50');
    console.log(`NFT creator balance: ${balance} NFTs`);

    await storage.transferFrom('0x1028c139157ab9be0eb649c6fc10fb792b21cb67', '0x9174521c0f0c48faf171a9129755e83d15aeae61', 0);
    assert(await storage.ownerOf(0) == 0x9174521c0f0c48faf171a9129755e83d15aeae61, "new owner wrong");
  })
  /**
   * Test 8
   * 
   * Approving non-owners to transfer the asset. Is this useful for this demo?
   * Maybe we could use it for implementing with a Reach DApp
   */
  it('should approve non-owners', async () => {
    const storage = await myERC.new('myERC8', 'MERC8');

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    
    // this returns the zero address
    // const myAddr = await storage.getApproved(0);
    // console.log(myAddr);

    await storage.setApprovalForAll('0x9174521c0f0c48faf171a9129755e83d15aeae61', true);
    const b = await storage.isApprovedForAll('0x1028c139157ab9be0eb649c6fc10fb792b21cb67', '0x9174521c0f0c48faf171a9129755e83d15aeae61');

    console.log(`Approving the truffle-config private key: ${b}`);
    await storage.transferFrom('0x1028c139157ab9be0eb649c6fc10fb792b21cb67', '0x5bf5d31806a4599da5ce554f873eb20becd831ba', 0);
  })
})