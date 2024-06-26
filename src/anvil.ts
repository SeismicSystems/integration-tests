import { exec } from 'child_process';

export function runAnvil(port: number) {
  exec(`anvil -p ${port}`, (error) => {
    if (error) {
      console.log(`exec error: ${error}`);
    }
  });
}

export async function stopAnvil(port: number) {
    exec(`./src/killanvil.sh ${port}`, (error) => {
      if (error) {
        console.log(`exec error: ${error}`);
      }
    });
  }
