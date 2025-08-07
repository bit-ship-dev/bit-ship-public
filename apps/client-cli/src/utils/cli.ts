import chalk from 'chalk';

export const loader = (message: () => string): () => void => {
  const P = ['◐', '◓', '◑', '◒'];
  let x = 0;
  const interval = setInterval(() => {
    process.stdout.write(chalk.magenta(`\r${P[x++]} ${message()}`));
    x &= 3;
  }, 250);
  return () => {
    clearInterval(interval)
  }
}
