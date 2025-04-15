import prompts from 'prompts';
import { $ } from 'bun';

async function main() {
  const stdout = await $`git branch --list | cat`.text();
  const branches = stdout
    .split('\n')
    .map((branch: string) => branch.trim())
    .filter((branch: string) => branch && !branch.startsWith('*'))
    .map((branch: string) => ({ title: branch, value: branch }));

  if (branches.length === 0) {
    console.log("No other branches found.");
    return;
  }

  const response = await prompts({
    type: 'select',
    name: 'branch',
    message: 'Select a branch to switch to:',
    choices: branches,
  });

  if (response.branch) {
    try {
        await $`git checkout ${response.branch}`.quiet();
        console.log(`Switched to branch '${response.branch}'`);
    } catch (error: any) {
        let errorMessage = "Unknown error";
        if (error && typeof error.stderr === 'object' && error.stderr instanceof Buffer) {
           errorMessage = error.stderr.toString().trim();
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error(`Failed to switch to branch '${response.branch}': ${errorMessage}`);
    }
  } else {
    console.log("No branch selected.");
  }
}

main();