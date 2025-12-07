import { describe, it, expect } from "vitest";
import { runCommand, wait } from "./utils";
import { ofetch } from "ofetch";

describe('Demon', () => {
  it('bit-ship demon restart', async () => {
    const {code, output} = await runCommand(`demon restart`);
    expect(code).toBe(0)
    expect(output).toMatchSnapshot()
    await wait(1000)
    const response = await ofetch('http://localhost');
    expect(response).toMatchSnapshot()
  }, {timeout: 30000});
});

