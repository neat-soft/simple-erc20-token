/* eslint-disable */
const Crowdsale = artifacts.require('./Crowdsale.sol');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const moment = require('moment');
let instance;
let preICO;
let ICO;

const decimals = 1E8;
const [
  ID, START, DURATION, TOTALAMOUNT, MINCAP,
  RATE, MININVESTMENT, SMALLBONUS, BIGBONUS, SOLD
] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const timeTravel = (time) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [time],
      id: moment()
    }, (err, result) => {
      if (err) { return reject(err); }
      return resolve(result);
    });
  });
};

const mineBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine'
    }, (err, result) => {
      if (err) { return reject(err); }
      return resolve(result);
    });
  });
};

async function feasibility(callback, args) {
  try {
    await callback.apply(this, args);
    return true;
  } catch (error) {
    return false;
  }
}

contract('Crowdsale', (accounts) => {
  it('Setup', async () => {
    instance = await Crowdsale.deployed();
    preICO = await instance.preICO.call();
    ICO = await instance.ICO.call();
  });

  it('Token test', async () => {
    /* await timeTravel((ICO[START].toNumber() - Math.round(new Date().getTime() / 1000.0)) + 60);
    web3.eth.sendTransaction({ from: accounts[0], to: Crowdsale.address, value: web3.toWei(5.5, 'ether'), gas: 300000 });
    await instance.setEthUSD(3000000000000000, { from: accounts[0] });
    let aa = await instance.getFrozenTokens(accounts[0], 0, { from: accounts[0] });
    let bb = await instance.getFrozenTokens(accounts[0], 1, { from: accounts[0] });
    console.log(aa);
    console.log(bb);
    await timeTravel(15778463);
    await instance.unfreezeTokens({ from: accounts[0], gas: 300000 });
    console.log('new');
    aa = await instance.getFrozenTokens(accounts[0], 0, { from: accounts[0] });
    bb = await instance.getFrozenTokens(accounts[0], 1, { from: accounts[0] });
    console.log(aa);
    console.log(bb);
    assert.equal(true, false, 'Pre-ICO: frozen error (+20%)'); */
    /* assert.isOk(await feasibility(instance.manualSend, ["0xf17f52151ebef6c7334fad080c5704d77216b732", 1000, 200, { from: accounts[0] }]), 'Set withdrawal address - not ok');
    assert.equal(true, false, 'Pre-ICO: frozen error (+20%)'); */
    /* let frozen = (await instance.getFrozenTokens({ from: accounts[1] })).map(bigNum => bigNum.toNumber());
    assert.equal(frozen[0], 18300 * decimals, 'Pre-ICO: frozen error (+20%)');
    assert.equal(frozen[1], ICO[START].toNumber() + ICO[DURATION].toNumber(), 'Pre-ICO: timestamp error (+20%)'); */
  });

/*
  it('Set addresses', async () => {
    assert.isOk(await feasibility(instance.setWithdrawalAddress, [accounts[7], { from: accounts[0] }]), 'Set withdrawal address - not ok');
    assert.isOk(await feasibility(instance.setFoundersAddress, [accounts[8], { from: accounts[0] }]), 'Set founders address - not ok');
    assert.isOk(await feasibility(instance.setBountyAddress, [accounts[9], { from: accounts[0] }]), 'Set bounty address - not ok');
    assert.isNotOk(await feasibility(instance.setFoundersAddress, [accounts[8], { from: accounts[0] }]), 'Set founders address - ok');
    assert.isNotOk(await feasibility(instance.setBountyAddress, [accounts[9], { from: accounts[0] }]), 'Set bounty address - ok');
    await timeTravel((preICO[START].toNumber() - Math.round(new Date().getTime() / 1000.0)) + 60);
    assert.isNotOk(await feasibility(instance.setWithdrawalAddress, [accounts[7], { from: accounts[0] }]), 'Set withdrawal address - ok');
    assert.isNotOk(await feasibility(instance.setFoundersAddress, [accounts[8], { from: accounts[0] }]), 'Set founders address - ok');
    assert.isNotOk(await feasibility(instance.setBountyAddress, [accounts[9], { from: accounts[0] }]), 'Set bounty address - ok');
  });

  it('Set a new rate of ETH/USD', async () => {
    await instance.setEthUSD(30500, { from: accounts[0] });
    const ethUSD = await instance.ethUSD.call();
    assert.equal(ethUSD, 30500, 'ETH/USD error');
  });

  it('Buying tokens (pre-ICO)', async () => {
    // + 20%
    web3.eth.sendTransaction({ from: accounts[1], to: Crowdsale.address, value: web3.toWei(10, 'ether'), gas: 300000 });
    let frozen = (await instance.getFrozenTokens({ from: accounts[1] })).map(bigNum => bigNum.toNumber());
    assert.equal(frozen[0], 18300 * decimals, 'Pre-ICO: frozen error (+20%)');
    assert.equal(frozen[1], ICO[START].toNumber() + ICO[DURATION].toNumber(), 'Pre-ICO: timestamp error (+20%)');

    // + 20% + 25%
    await web3.eth.sendTransaction({ from: accounts[2], to: Crowdsale.address, value: web3.toWei(40, 'ether'), gas: 300000 });
    frozen = await instance.getFrozenTokens({ from: accounts[2] });
    assert.equal(frozen[0].toNumber(), 88450 * decimals, 'Pre-ICO: frozen error (+20% && value >= 40 ETH)');

    // + 20% + 35%
    await web3.eth.sendTransaction({ from: accounts[1], to: accounts[3], value: web3.toWei(1, 'ether') });
    await web3.eth.sendTransaction({ from: accounts[3], to: Crowdsale.address, value: web3.toWei(100, 'ether'), gas: 300000 });
    frozen = await instance.getFrozenTokens({ from: accounts[3] });
    assert.equal(frozen[0].toNumber(), 236375 * decimals, 'Pre-ICO: frozen error (+20% && value >= 100 ETH)');

    // Statistics
    preICO = await instance.preICO.call();
    assert.equal(preICO[SOLD].toNumber(), 343125 * decimals, 'Pre-ICO: sold error');
  });

  it('Withdrawal (pre-ICO)', async () => {
    assert.isNotOk(await feasibility(instance.withdrawal, [{ from: accounts[0] }]), 'Pre-ICO: the min cap was not reached');
  });

  it('Refund (pre-ICO)', async () => {
    assert.isNotOk(await feasibility(instance.refund, [0, { from: accounts[2] }]), 'Pre-ICO: did not end');
    await timeTravel((ICO[START].toNumber() - Math.round(new Date().getTime() / 1000.0)) + 60);
    const tx = await instance.refund(0, { from: accounts[2] });
    assert.equal(tx.logs[0].event, 'TransferWei', 'tx name');
    assert.equal(tx.logs[0].args.addr, accounts[2], 'tx addr');
    assert.equal(tx.logs[0].args.amount, web3.toWei(40, 'ether'), 'tx amount');
  });

  it('Buying tokens (ICO)', async () => {
    // 1 week
    await web3.eth.sendTransaction({ from: accounts[4], to: Crowdsale.address, value: web3.toWei(2, 'ether'), gas: 300000 });
    let frozen = await instance.getFrozenTokens({ from: accounts[4] });
    assert.equal(frozen[0].toNumber(), Math.round(3507.5 * decimals), 'ICO: frozen error (1 week)');

    // 2 week + 20%
    await timeTravel(604800);
    await web3.eth.sendTransaction({ from: accounts[5], to: Crowdsale.address, value: web3.toWei(43.363, 'ether'), gas: 300000 });
    frozen = await instance.getFrozenTokens({ from: accounts[5] });
    assert.equal(frozen[0].toNumber(), Math.round(85967.1475 * decimals), 'ICO: frozen error (2 week && value >= 40 ETH)');

    // 3 week + 30%
    await timeTravel(604800);
    await web3.eth.sendTransaction({ from: accounts[1], to: accounts[6], value: web3.toWei(1, 'ether') });
    await web3.eth.sendTransaction({ from: accounts[6], to: Crowdsale.address, value: web3.toWei(100.111, 'ether'), gas: 300000 });
    frozen = await instance.getFrozenTokens({ from: accounts[6] });
    assert.equal(frozen[0].toNumber(), Math.round(206103.52125 * decimals), 'ICO: frozen error (3 week && value >= 100 ETH)');

    // Statistics
    ICO = await instance.ICO.call();
    assert.equal(ICO[SOLD].toNumber(), Math.round(295578.16875 * decimals), 'ICO: sold error');
  });
*/
});
