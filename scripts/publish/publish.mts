#!/bin/node
import inquirer, { QuestionCollection } from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs-extra';

//expo app.json config
interface IPackageJSON {
  "version": string;
}
interface IApp {
  "expo": {
    "name": string,
    "slug": string,
    "version": string,
    "orientation": string,
    "icon": string,
    "userInterfaceStyle": string,
    "splash": {
      "image": string,
      "resizeMode": string,
      "backgroundColor": string
    },
    "assetBundlePatterns": Array<string>,
    "ios": {
      "supportsTablet": boolean
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": string,
        "backgroundColor": string
      },
      "package": string,
      "versionCode": number
    },
    "web": {
      "favicon": string
    },
    "extra": {
      "eas": {
        "projectId": string
      }
    },
    "owner": string
  }
}

// inquirer config

const getQuestions = (appFile: IApp) => {
  const questions: QuestionCollection<{ versionUpdate: 'low' | 'middle' | 'high' | 'skip', publishMode: 'dev' | 'prev' | 'prod' | 'skip' }> = [
    {
      name: 'versionUpdate',
      type: 'list',
      message: `update [${appFile.expo.name}] version ? ${appFile.expo.version}(${appFile.expo.android.versionCode})`,
      choices: [
        { name: 'Skip', value: 'skip' },
        { name: 'Minor', value: 'low' },
        { name: 'Major', value: 'middle' },
        { name: 'Breaking change', value: 'high' }
      ],
    },
    {
      name: 'publishMode',
      type: 'list',
      message: 'Publish app - android',
      choices: [
        { name: 'Skip', value: 'skip' },
        { name: 'Development (local build - dev Env)', value: 'dev' },
        { name: 'Preview (local build - prod env)', value: 'prev' },
        { name: 'Production (AppStore build)', value: 'prod' }
      ],
    },
  ]
  return questions
}


const exec = (command: string, silent: boolean = false): any => {
  const resOutput = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
  if (!silent) {
    console.log(resOutput)
  }
  return resOutput
}
const execReturn = (command: string, silent: boolean = false): any => {
  const resOutput = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
  if (!silent) {
    console.log(resOutput)
  }
  return resOutput
}

const publishModeHandler = (publishMode: "dev" | "prev" | "prod" | "skip") => {
  if (publishMode === 'skip') { return } else {
    switch (publishMode) {
      case 'dev':
        exec('eas build --profile development --platform android')
        break;
      case 'prev':
        exec('eas build --profile preview --platform android')
        break;
      case 'prod':
        exec('eas build --profile production --platform android && eas submit --platform android --latest')
        break;
    }
  }
}
const versionUpdateHandler = (originalFile: IApp, updateType: "skip" | "low" | "middle" | "high") => {
  if (updateType === 'skip') { return null } else {
    const packageJson = fs.readJsonSync('./package.json', { encoding: 'utf-8' }) as IPackageJSON;
    const versionAsArray = originalFile.expo.version.split('.')
    switch (updateType) {
      case 'low':
        versionAsArray[2] = (parseInt(versionAsArray[2] || '0') + 1).toString();
        break;
      case 'middle':
        versionAsArray[1] = (parseInt(versionAsArray[1] || '0') + 1).toString();
        break;
      case 'high':
        versionAsArray[0] = (parseInt(versionAsArray[0] || '0') + 1).toString();
        break;
    }
    originalFile.expo.version = versionAsArray.join('.');
    packageJson.version = versionAsArray.join('.');
    fs.writeJSONSync('./app.json', originalFile, { spaces: '\t' });
    fs.writeJSONSync('./package.json', packageJson, { spaces: '\t' });
    return versionAsArray.join('.')
  }
}

const gitCheckStatus = () => {
  const gitStatus = execReturn('git status --porcelain', true);
  return gitStatus;
}

const gitCheckStatusWithQuestion = async () => {
  const gitStatus = execReturn('git status --porcelain', true);
  if (gitStatus !== null) {
    console.log(gitStatus);
    const gitQuestionRes = await inquirer.prompt<{ git: boolean }>(
      [{
        name: 'git',
        type: 'confirm',
        message: `You have some file(s) not commited. Are you sure to continue ?`,
      }]
    );
    if (gitQuestionRes.git === false) {
      process.exit()
    } else {
      return gitStatus;
    }
  }
}

const gitGetCurrentBranch = () => {
  const currentBranch = execReturn('git rev-parse --abbrev-ref HEAD', true);
}

const gitPushNewVersionWithTag = async (version: string | null) => {
  if (version === null) { return }
  
  const gitStatus = execReturn('git status --porcelain', true);
  const gitQuestionRes = await inquirer.prompt<{ git: boolean }>(
    [{
      name: 'git',
      type: 'confirm',
      message: `Do you want to update the repo ? (tag + version update)`,
    }]
  );
  if (gitQuestionRes.git === true) {
    if (gitStatus !== null) {
      execReturn('git add .', true);
      execReturn(`git commit -m "chore: update to V${version}"`, true);
      version && execReturn(`git tag ${version}`, true);
      execReturn(`git push origin --tags`, true);
    } else {
      version && execReturn(`git tag ${version}`, true);
      execReturn(`git push origin --tags`, true);
    }
  } else {
    return;
  }
}

const main = async () => {
  await gitCheckStatusWithQuestion();
  const jsonObj = fs.readJsonSync('./app.json', { encoding: 'utf-8' }) as IApp
  const res = await inquirer.prompt(getQuestions(jsonObj));
  const version = versionUpdateHandler(jsonObj, res.versionUpdate);
  publishModeHandler(res.publishMode);
  gitPushNewVersionWithTag(version);
  exec('npm run changelog')
  exec('npm run releasenote')
}

main();