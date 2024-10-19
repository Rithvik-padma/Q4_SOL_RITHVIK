import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    const image =
      "https://devnet.irys.xyz/C3pVzACAwxVsyZoZFZMWdcggmiju1oMoRiHWeh3LtKLU";
    const metadata = {
      name: "AGAROTH",
      symbol: "AGR",
      description: "The God of war",
      image: image,
      attributes: [
        { trait_type: "human", value: "30" },
        { trait_type: "god", value: "5" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
        },
      ],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log(
      "Your metadata URI: ",
      myUri.replace("arweave.net", "devnet.irys.xyz"),
    );
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
