import { describe, it, expect } from "vitest";
import { runCommand } from "./utils";

describe('Help', () => {
  it('bit-ship -h', async () => {
    const {code, output} = await runCommand(`-h`);
    expect(code).toBe(0)
    expect(output).toMatchSnapshot()
  });
  it('bit-ship -h', async () => {
    const {code, output} = await runCommand(`run -h`);
    expect(code).toBe(0)
    expect(output).toMatchSnapshot()
  });
  it('bit-ship -h', async () => {
    const {code, output} = await runCommand(`exec -h`);
    expect(code).toBe(0)
    expect(output).toMatchSnapshot()
  });
});
