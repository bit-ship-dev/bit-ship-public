class BitShip < Formula
  desc "My custom npm tool with Docker dependency"
  homepage "https://github.com/yourusername/my-npm-tool"
  url "https://registry.npmjs.org/bit-ship/-/bit-ship-0.1.2.tgz"
  version "1.0.0"


  # Skip url and sha256 since we're installing directly from npm

  # Define dependencies
  depends_on "node"
  depends_on "docker"

  def install
    # Install the package globally using npm
    system "npm", "i", "-g", "bit-ship"
  end

  test do
    # Add a basic test to ensure the command exists and runs
    system bin/"my-npm-tool", "--version"
  end
end
