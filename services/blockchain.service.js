/**
 * @file
 * Contains implementation of BlockChain service.
 */

// Web3 imports.
import Web3 from 'web3';

/**
 * BlockChain provides methods to work with block chain.
 */
class BlockChain {
  /**
   * Class constructor.
   * @param {string} httpProvider
   *  Provider url.
   */
  constructor(httpProvider) {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(httpProvider)
    );
  }

  /**
   * Get transaction by id.
   * @param {string} id
   *  Current transaction id.
   */
  getTransactionById (id) {
    return this.web3.eth.getTransaction(id)
      .then(data => {
        return this.InputString(data.input);
      });
  }

  /**
   * Convert input data to Alphabet Latin string.
   * @param {object} data
   *  Transaction object data.
   */
  InputString (data) {
    return this.web3.utils.toAscii(data);
  }
}

/**
 * Init SynonymService object.
 */
const BlockChainService = new BlockChain('https://mainnet.infura.io/');

/**
 * Export SynonymService object.
 */
export default BlockChainService
