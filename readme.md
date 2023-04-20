# Wifi Signal Strengh

<p align="center">
<img src="doc/images/signal-strength.png" alt="banner" height="300px"/>
</p>

## Stack

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=339933&logo=Node.js&logoColor=FFFFFF&label=16.19)
![React](https://img.shields.io/static/v1?style=for-the-badge&message=React&color=222222&logo=React&logoColor=61DAFB&label=18.2)
![React Native](https://img.shields.io/static/v1?style=for-the-badge&message=React%20Native&color=222222&logo=React&logoColor=61DAFB&label=71.6)
![Expo](https://img.shields.io/static/v1?style=for-the-badge&message=Expo&color=000020&logo=Expo&logoColor=FFFFFF&label=SDK%2048)
![Expo](https://img.shields.io/static/v1?style=for-the-badge&message=Expo%20EAS&color=000020&logo=Expo&logoColor=FFFFFF&label=)
![TypeScript](https://img.shields.io/static/v1?style=for-the-badge&message=TypeScript&color=3178C6&logo=TypeScript&logoColor=FFFFFF&label=4.9)

## Intro 

This app allow to see the signal strengh of a wifi connexion. Its available only on Play store / Android.

## Get started

```sh
npm i
npm run postinstall
npm start
```

this App is powered by expo. you just have to scan the Qrcode provide after `npm start` to begin work on it

## Publish

### Pre-work

you will maybe need to add the `serviceAccountKeyPath` to the repo. From the root directory :
- `mkdir .secret`
- put your json file given by the play store inside.
- adjust `./eas.json` file at the key `serviceAccountKeyPath` with the path to it.

### Publish to Play Store

```sh
npm run publish
```

## Showcase

<div align="center">
<img src="doc/images/Screenshot_20230419-191004_signalstrengh.jpg" alt="banner" width="30%"/>
<img src="doc/images/Screenshot_20230419-191047_signalstrengh.jpg" alt="banner" width="30%"/>
</div>
