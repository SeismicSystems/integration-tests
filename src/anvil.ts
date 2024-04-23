import { exec } from 'child_process';

export function runAnvil(port: number) {
  exec(`anvil -p ${port}`);
}

export async function stopAnvil(port: number) {
    exec(`kill -9 $(lsof -ti:${port})`);
  }
