
import {ContractDeployer, EventListenerServer, runAnvil, stopAnvil} from 'integration-tests'
import { bytecode, abi } from './contracts/out/Contract.sol/Contract.json';
import {privateKeyToAccount} from "viem/accounts";

runAnvil(8000);

const bytecode_formatted: `0x${string}` = `0x${bytecode.object.replace(/^0x/, '')}`;
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const accountAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const c = new ContractDeployer(abi, bytecode_formatted, privateKey, accountAddress, 8000, "0x0000000000000000000000000000000000000000");

async function deployAndInteract() {
  await c.deployContract();
  console.log(c.getDeployedAddress());

  const s = new EventListenerServer(abi, c.getDeployedAddress(), 3000, 8000);

  await contractInteractionSimulation(c, s);
}

async function contractInteractionSimulation(c: ContractDeployer, s: EventListenerServer) {
  await setDummyAndValidateServerVariable(c, s, 10n);
  await setDummyAndValidateServerVariable(c, s, 15n);
  await compareServerAndContractVariable(c, s);
}

async function setDummyAndValidateServerVariable(c: ContractDeployer, s: EventListenerServer, value: bigint) {
  const { request: requestSet } = await c.client.simulateContract({
    address: c.getDeployedAddress(),
    abi: abi,
    functionName: "setDummy",
    args: [value],
  });

  const txSet = await c.client.writeContract({
    ...requestSet,
    account: privateKeyToAccount(privateKey),
  });

  await c.client.waitForTransactionReceipt({ hash: txSet });

  if (!s.variable) {
    console.error("Server variable does not exist.");
    return;
  }
  console.log(s.variable);
}

async function compareServerAndContractVariable(c: ContractDeployer, s: EventListenerServer) {
  const { request: requestGetDummy } = await c.client.simulateContract({
    address: c.getDeployedAddress(),
    abi: abi,
    functionName: "getDummy",
    args: [],
  });

  const result = await c.client.readContract({
    ...requestGetDummy,
    account: privateKeyToAccount(privateKey),
  });

  const bignumServerVariable = BigInt(s.variable);
  const bignumContractVariable = BigInt(result);

  if (bignumServerVariable !== bignumContractVariable) {
    console.error("serverVariable and contractVariable are not equal.");
  } else {
    console.log("serverVariable and contractVariable are equal.");
  }
  s.stopServer();
}

deployAndInteract().catch(console.error);

