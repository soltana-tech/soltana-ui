import { execSync } from 'node:child_process';

export default function globalSetup() {
  execSync('pnpm run build', { stdio: 'inherit' });
}
