import { privateKeyToAccount } from "viem/accounts";
import { getContractAddress, http } from "viem";
import { createTestClient, createWalletClient, publicActions, walletActions } from "viem";
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
    public walletClient = createWalletClient({
        chain: foundry,
        transport: http("http://localhost:8545"),
      })
    private abi: any;
    private bytecode: `0x${string}`;
    private privateKey: `0x${string}`;
    private publicAddress: `0x${string}`;
    private contractArgs: any[];


    
    constructor(abi: any, bytecode: `0x${string}`, privateKey: `0x${string}`, publicAddress: `0x${string}`, port: number, args: any[]) {
        this.abi = abi;
        this.bytecode = bytecode;
        this.privateKey = privateKey;
        this.publicAddress = publicAddress;
        this.walletClient = createWalletClient({
            chain: foundry,
            transport: http(`http://localhost:${port}`),
          });
        this.client = createTestClient({
            chain: foundry,
            mode: "anvil",
            transport: http(`http://localhost:${port}`),
          })
            .extend(publicActions)
            .extend(walletActions);
            this.contractArgs = args;
    }

    async deployContract() {
      const contract = await this.client.deployContract({
        abi: this.abi,
        bytecode: this.bytecode,
        account: privateKeyToAccount(this.privateKey),
        args:this.contractArgs,
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

    async deployContractWithoutArguments() {
      const contract = await this.walletClient.deployContract({
        abi: this.abi,
        bytecode: this.bytecode,
        account: privateKeyToAccount(this.privateKey),
        args: [],
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