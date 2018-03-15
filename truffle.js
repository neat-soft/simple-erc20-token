module.exports = {
  migrations_directory: './migrations',
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 8546,
      network_id: "*", // Match any network id
      gas:4600000
    },
    ropsten: {
     host:"localhost",
     port: 8545,
     network_id: '*',
     gas: 4600000
    }
  }
};
