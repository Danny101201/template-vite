#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const CHOICES = fs_1.default.readdirSync(path_1.default.join(__dirname, 'templates'));
const QUESTION = [
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
];
const CURR_DIR = process.cwd();
inquirer_1.default.prompt(QUESTION)
    .then((answers) => {
    const projectChoice = answers['template'];
    const projectName = answers['name'];
    const templatePath = path_1.default.join(__dirname, 'templates', projectChoice);
    const tartgetPath = path_1.default.join(CURR_DIR, projectName);
    const options = {
        projectName,
        templateName: projectChoice,
        templatePath,
        tartgetPath
    };
    if (!createProjectPath(tartgetPath))
        return;
    createDirectoryContents(templatePath, projectName);
    console.log(`cd ${projectName} \n npm install \n npm run dev`);
});
const createProjectPath = (projectPath) => {
    if (fs_1.default.existsSync(projectPath)) {
        console.log(chalk_1.default.red(`project ${projectPath} is exist`));
        return false;
    }
    fs_1.default.mkdirSync(projectPath);
    return true;
};
const SKIP_FILES = ['node_modules', '.template.json'];
const createDirectoryContents = (templatePath, projectName) => {
    const fileToCreate = fs_1.default.readdirSync(templatePath);
    for (let file of fileToCreate) {
        // skip file
        if (SKIP_FILES.includes(file))
            continue;
        const writePath = path_1.default.join(CURR_DIR, projectName, file);
        const origFilePath = path_1.default.join(templatePath, file);
        const fileStatus = fs_1.default.statSync(origFilePath);
        if (fileStatus.isFile()) {
            let context = fs_1.default.readFileSync(origFilePath, 'utf-8');
            fs_1.default.writeFileSync(writePath, context, 'utf-8');
        }
        else if (fileStatus.isDirectory()) {
            fs_1.default.mkdirSync(writePath);
            createDirectoryContents(path_1.default.join(templatePath, file), path_1.default.join(projectName, file));
        }
    }
};
//# sourceMappingURL=index.js.map