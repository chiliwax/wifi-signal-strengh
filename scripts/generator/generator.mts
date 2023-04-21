#!/bin/node
import inquirer, { QuestionCollection } from 'inquirer';
import fs from 'fs-extra';
import Handlebars from 'handlebars'

const createFile = (filePath: string, content: string) => {
  
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' })
}

const main = async () => {
  //Inquirer
  const fileQuestion = await inquirer.prompt<{ rootDirectory: string, name: string }>(
    [
      {
        name: 'rootDirectory',
        type: 'input',
        message: `choose a directory (components/pages/...)`,
        transformer: (input, answers, flags) => {
          return `${process.cwd()}/src/${input}`
        },
        validate: (input) => {
          if (!fs.existsSync(`${process.cwd()}/src/${input}`)) {
            throw new Error(`${process.cwd()}/src/${input} >> Directory don't exist`);
          } return true;
        },
      },
      {
        name: 'name',
        type: 'input',
        message: `provide the name of your new component`,
        transformer: (input: string) => {
          const no_space = input.replaceAll(' ', '_').replaceAll('-', '_');
          return no_space.charAt(0).toUpperCase() + no_space.slice(1)
        },
        filter: (input: string) => {
          const no_space = input.replaceAll(' ', '_').replaceAll('-', '_');
          return no_space.charAt(0).toUpperCase() + no_space.slice(1)
        },
        validate: (input: string) => {
          if (input.length < 3) {
            throw new Error(`filename length should be at least 3 chars `);
          }
          return true;
        }
      }]
  );

  // Handlebars
  const rootDirectory = `${process.cwd()}/src/${fileQuestion.rootDirectory}/${fileQuestion.name}`
  fs.ensureDirSync(rootDirectory);
  const template = fs.readFileSync('./scripts/generator/template.tsx.hbs', { encoding: 'utf-8' })
  const templateProps = fs.readFileSync('./scripts/generator/template.props.tsx.hbs', { encoding: 'utf-8' })
  const templateLogic = fs.readFileSync('./scripts/generator/template.logic.tsx.hbs', { encoding: 'utf-8' })
  const templateDesign = fs.readFileSync('./scripts/generator/template.design.tsx.hbs', { encoding: 'utf-8' })
  const data = { "name": fileQuestion.name }
  const HbsElement = Handlebars.compile(template)
  const HbsElementProps = Handlebars.compile(templateProps)
  const HbsElementLogic = Handlebars.compile(templateLogic)
  const HbsElementDesign = Handlebars.compile(templateDesign)
  createFile(`${rootDirectory}/${fileQuestion.name}.tsx`, HbsElement(data))
  createFile(`${rootDirectory}/${fileQuestion.name}.props.tsx`, HbsElementProps(data))
  createFile(`${rootDirectory}/${fileQuestion.name}.logic.tsx`, HbsElementLogic(data))
  createFile(`${rootDirectory}/${fileQuestion.name}.design.tsx`, HbsElementDesign(data))
}

main();
