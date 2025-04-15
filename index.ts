#!/usr/bin/env node
import prompts from 'prompts';
import { execSync } from 'child_process';

async function main() {
  const stdout = execSync('git branch --list | cat').toString();
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
        execSync(`git checkout ${response.branch}`, { stdio: 'pipe' });
        console.log(`Switched to branch '${response.branch}'`);
    } catch (error: any) {
        let errorMessage = "Unknown error";
        if (error && error.stderr) {
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