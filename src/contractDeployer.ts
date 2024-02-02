import { privateKeyToAccount } from "viem/accounts";
import { getContractAddress, http } from "viem";
import { createTestClient, publicActions, walletActions } from "viem";
import {foundry} from "viem/chains";


export class ContractDeployer {
    private deployedAddress: `0x${string}` | null = null;
    public client = createTestClient({
        chain: foundry,
        mode: "anvil",
        transport: http("http://localhost:8545"),
      })
        .extend(publicActions)
        .extend(walletActions);
    private abi: any;
    private bytecode: `0x${string}`;
    private privateKey: `0x${string}`;
    private publicAddress: `0x${string}`;

    constructor(abi: any, bytecode: `0x${string}`, privateKey: `0x${string}`, publicAddress: `0x${string}`, port: number) {
        this.abi = abi;
        this.bytecode = bytecode;
        this.privateKey = privateKey;
        this.publicAddress = publicAddress;
        this.client = createTestClient({
            chain: foundry,
            mode: "anvil",
            transport: http(`http://localhost:${port}`),
          })
            .extend(publicActions)
            .extend(walletActions);
    }

    async deployContract() {
      const contract = await this.client.deployContract({
        abi: this.abi,
        bytecode: this.bytecode,
        account: privateKeyToAccount(this.privateKey),
        args:[],
      });
  
      const nonce = BigInt(
        await this.client.getTransactionCount({
          address: this.publicAddress,
        }),
      );
  
      this.deployedAddress = getContractAddress({
        from: this.publicAddress,
        nonce: nonce - BigInt(1),
      });
    }
  
    getDeployedAddress() {
      if (this.deployedAddress === null) {
        throw new Error("No contract deployed yet.");
      }
      return this.deployedAddress;
    }
  }