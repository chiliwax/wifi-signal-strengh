#!/bin/node
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { execSync } from 'child_process';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer/lib/smtp-transport/index.js';

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

interface IMailInfo {
  "android": {
    "internal_app": string;
    "internal": Array<string>;
  }
}


const createFile = (filePath: string, content: string) => {
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' })
}

const execReturn = (command: string, silent: boolean = true): any => {
  const resOutput = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
  if (!silent) {
    console.log(resOutput)
  }
  return resOutput
}

const main = async () => {
  //fs
  const rootDirectory = `${process.cwd()}/scripts/share`
  const distDirectory = `${rootDirectory}/dist`
  const tempDirectory = `${rootDirectory}/temp`
  fs.ensureDirSync(distDirectory);
  fs.ensureDirSync(tempDirectory);
  const _app = fs.readJsonSync('./app.json', { encoding: 'utf-8' }) as IApp
  const _mail = fs.readJsonSync('./.secret/emailList.json', { encoding: 'utf-8' }) as IMailInfo
  // auto-gangelog
  execSync(`auto-changelog -p -c '${rootDirectory}/template/.release-note-config' -t '${rootDirectory}/template/changelog.hbs' -o '${tempDirectory}/RN.html'`)
  const releasenote = fs.readFileSync(`${tempDirectory}/RN.html`, { encoding: 'utf8' });
  // Handlebars
  const template = fs.readFileSync(`${rootDirectory}/template/template.hbs`, { encoding: 'utf-8' })
  console.log(template)
  const data = { "projectName": _app.expo.name, "releaseNote": releasenote, "version": _app.expo.version, "background": _app.expo.splash.backgroundColor, "href": _mail.android.internal_app }
  const HbsElement = Handlebars.compile(template, { noEscape: true })
  createFile(`${distDirectory}/index.html`, HbsElement(data))
  fs.copyFileSync(`${rootDirectory}/template/banner.png`, `${distDirectory}/banner.png`)
}

main();
