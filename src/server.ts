import express from 'express';
import { createServer } from 'http';
import { createTestClient, publicActions, walletActions, webSocket } from 'viem';
import { foundry } from 'viem/chains';
import { exec } from 'child_process';

export class EventListenerServer {
  private app = express();
  private server = createServer(this.app);
  private port: number;
  private _variable: any;

  constructor(abi: any, address: `0x${string}`, port: number = 3000, anvilPort: number) {
    this.port = port;
    this.initializeServer(abi, address, anvilPort);
  }

  private initializeServer(abi: any, address: `0x${string}`, anvilPort: number) {
    const listener = createTestClient({
      chain: foundry,
      mode: "anvil",
      transport: webSocket(`ws://localhost:${anvilPort}`),
    })
      .extend(publicActions)
      .extend(walletActions);

    console.log("Server listening to contract deployed at ", address);
    console.log("Listening for events");

    listener.watchContractEvent({
      address: address,
      abi: abi,
      onLogs: (logs) => {
        console.log(logs);
        console.log("Test:" + logs[0].data)
        this._variable = logs[0].data; // Assuming logs contain the variable value you're interested in
      },
    });


    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public set variable(value: any) {
    this._variable = value;
  }

  public get variable(): any {
    return this._variable;
  }

  public stopServer() {
    this.server.close(() => {
      console.log(`Server on port ${this.port} has been stopped.`);
    });
  }
}


