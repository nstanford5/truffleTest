const myERC = artifacts.require('myERC.sol');

contract('myERC', () => {
  it('should test constructor, return name and symbol', async () => {
    const storage = await myERC.new("myERC", "MERC");

    const name = await storage.name();
    assert(name === "myERC", "name wrong");

    const symbol = await storage.symbol();
    assert(symbol === "MERC");
  })
  // this starts another contract instance, will fail
  // it('should test instance2', async () => {
  //   const name2 = await storage.name();
  //   assert(name2 === "myERC");
  // })
  it('should mint, return balance, check token ID', async () => {
    const storage = await myERC.new("myERC2", "MERC2");

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    const amt = await storage.balanceOf('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');
    assert(amt.toString() === "1", "balance wrong");

    const addr = await storage.ownerOf(0);
    assert(addr == 0x1028c139157ab9be0eb649c6fc10fb792b21cb67, "address wrong");
  })
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
  it('should transfer NFT', async () => {
    const storage = await myERC.new('myERC4', 'MERC4');

    await storage.safeMint('0x1028c139157ab9be0eb649c6fc10fb792b21cb67');

    await storage.transfer('0x1028c139157ab9be0eb649c6fc10fb792b21cb67', '0x9174521c0f0c48faf171a9129755e83d15aeae61', 0);
    const owner = await storage.ownerOf(0);
    assert(owner == 0x9174521c0f0c48faf171a9129755e83d15aeae61, "transfer failed");
  })
})