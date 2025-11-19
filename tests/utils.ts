import { join } from "path";
import { spawn } from "child_process";


export const runCommand = (cmd: string): Promise<Output> =>  new Promise((resolve, reject) => {
  const child = spawn("node", [join(__dirname, '../bin/bin.js'), ...cmd.split(' ')], {
    stdio: ["pipe", "pipe", "pipe"], // stdin, stdout, stderr
  });
  let stdout = "";
  child.stdout.on("data", (data) => {
    stdout += data.toString();
  });
  child.stderr.on("data", (data) => {
    stdout += data.toString();
  });
  child.on("error", reject);
  child.on("close", (code) => {
    resolve({ code, output: stdout});
  });
})

export const wait = (time) => new Promise((res, rej) => {
  setTimeout(() => res(true), time)    
})

interface Output {
  code: number
  output: string
}
