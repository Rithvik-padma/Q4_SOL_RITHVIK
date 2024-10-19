import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);
const name = "AGAROTH";
const symbol = "AGR";
const uri =
  "https://devnet.irys.xyz/DrhgtqnP5udb7gUZBFA8qfbS4V7cnwQs5BaCmYL1vSje";
const sellerFeeBasisPoints = percentAmount(0, 2);

(async () => {
  let tx = createNft(umi, { name, symbol, mint, uri, sellerFeeBasisPoints });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);
  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );
  console.log("Mint Address: ", mint.publicKey);
})();
