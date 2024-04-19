import { randomBytes } from 'crypto';
import { BIP32Factory } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import { Address } from "@cmdcode/tapscript";
import type { Networks as BitcoinNetworks } from "@cmdcode/tapscript";

bitcoin.initEccLib(ecc);
const BIP32 = BIP32Factory(ecc);
const SEED = Buffer.alloc(64, 1);


export type TxOutput = {
  address: string;
  value: number;
}


function _nameToNetwork(name_: BitcoinNetworks): bitcoin.networks.Network {
  switch (name_) {
    case 'main':
      return bitcoin.networks.bitcoin;
    case 'testnet':
      return bitcoin.networks.testnet;
    case 'regtest':
      return bitcoin.networks.regtest;
  }

  throw new Error(`UNKNOWN NETWORK: ${name_}`);
}


export const p2wpkh = (outputs_: TxOutput[], options_?: {
  inputCount?: number;
  changeCount?: number;
}): number => {
  let options = { inputCount: 1, changeCount: 1 };
  if (options_) options = { ...options, ...options_ };

  // network name of outputs
  let networkName: BitcoinNetworks | undefined = undefined;
  for (const output of outputs_) {
    const decodedDepositAddress = Address.decode(output.address);

    if (undefined === networkName) networkName = decodedDepositAddress.network;
    if (networkName !== decodedDepositAddress.network) {
      throw new Error(`MIXED NETWORKS: ${networkName} & ${decodedDepositAddress.network}`);
    }
  }

  // total sats of outputs
  const totalSats = outputs_.reduce((acc, cur) => acc + cur.value, 0);

  // virtual value for each input
  const virtualInputValue = totalSats + 50e8;

  // network
  const network = _nameToNetwork(networkName!);

  // HD key (virtual)
  const hdKey = BIP32.fromSeed(SEED, network);

  // p2wpkh
  const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: hdKey.publicKey, network: network });

  // build PSBT
  const psbt = new bitcoin.Psbt({ network: network });

  // inputs
  for (let i = 0; i < options.inputCount; i++) {
    psbt.addInput({
      hash: randomBytes(32).toString('hex'),
      index: 0,
      witnessUtxo: {
        script: p2wpkh.output!,
        value: virtualInputValue,
      },
      sequence: 0xf0000000,
    });
  }

  // outputs
  for (const output of outputs_) psbt.addOutput(output);

  // change
  for (let i = 0; i < options.changeCount; i++) {
    psbt.addOutput({
      address: p2wpkh.address!,
      value: 1e3,
    });
  }

  // sign inputs
  for (let i = 0; i < options.inputCount; i++) psbt.signInput(i, hdKey);

  psbt.finalizeAllInputs();

  return psbt.extractTransaction(true).virtualSize();
}
