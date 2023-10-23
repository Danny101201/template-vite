#!/usr/bin/env node
import fs from 'fs'
import inquirer, { QuestionCollection } from 'inquirer'
import path from 'path'
import chalk from 'chalk'

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'))
const QUESTION: QuestionCollection = [
  {
    name: 'template',
    type: 'list',
    message: 'What project template would you like to use?',
    choices: CHOICES
  },
  {
    name: 'name',
    type: 'input',
    message: 'New project name?',
    default: 'default'
  }
]
const CURR_DIR = process.cwd()
inquirer.prompt(QUESTION)
  .then((answers) => {
    const projectChoice = answers['template']
    const projectName = answers['name']
    const templatePath = path.join(__dirname, 'templates', projectChoice)
    const tartgetPath = path.join(CURR_DIR, projectName)
    const options = {
      projectName,
      templateName: projectChoice,
      templatePath,
      tartgetPath
    }
    if (!createProjectPath(tartgetPath)) return
    createDirectoryContents(templatePath, projectName)
    console.log(`cd ${projectName} \n npm install \n npm run dev`);

  })
const createProjectPath = (projectPath: string) => {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`project ${projectPath} is exist`))
    return false
  }
  fs.mkdirSync(projectPath)
  return true
}
const SKIP_FILES = ['node_modules', '.template.json'];
const createDirectoryContents = (templatePath: string, projectName: string) => {
  const fileToCreate = fs.readdirSync(templatePath)
  for (let file of fileToCreate) {
    // skip file
    if (SKIP_FILES.includes(file)) continue
    const writePath = path.join(CURR_DIR, projectName, file)
    const origFilePath = path.join(templatePath, file)
    const fileStatus = fs.statSync(origFilePath)
    if (fileStatus.isFile()) {
      let context = fs.readFileSync(origFilePath, 'utf-8')
      fs.writeFileSync(writePath, context, 'utf-8')
    } else if (fileStatus.isDirectory()) {
      fs.mkdirSync(writePath)
      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file))
    }

  }
}
