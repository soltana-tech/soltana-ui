import { execSync } from 'node:child_process';

export default function globalSetup() {
  if (!process.env.CI) {
    execSync('pnpm run build', { stdio: 'inherit' });
  }
}
