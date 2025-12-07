class BitShip < Formula
  desc "From 1st line to production faster | Bit-Ship CLI is tool that helps you manage your local dev stack"
  homepage "https://www.bit-ship.dev/"
  url "https://registry.npmjs.org/bit-ship/-/bit-ship-0.5.0.tgz"
  version "0.5.0"
  license "MIT"

  # Skip url and sha256 since we're installing directly from npm

  # Define dependencies
  depends_on "node"
  depends_on "docker"

  test do
    assert_match "Docker version", shell_output("docker --version")
    assert_match "npm", shell_output("npm --version")
    assert_match "bit-ship", shell_output("bit-ship -v")
  end
end
