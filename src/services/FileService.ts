import { existsSync, writeFileSync, mkdirSync, copyFileSync, renameSync } from 'fs';
import { TemplateSetOpt } from '../types';
import { ux } from '@oclif/core';

export default class FileService {
    public static async setupTemplate(path: string, templates: TemplateSetOpt, folder: string) {
        switch (templates.template) {
            case 'html':
                this.move(`../templates/html`, path)
                renameSync(`${path}\\html`, `${path}\\${folder}`)
                break;
            case 'html-css':
                this.move(`../templates/html-css`, path)
                renameSync(`${path}\\html-css`, `${path}\\${folder}`)
                break;
            case 'html-js':
                this.move(`../templates/html-js`, path)
                renameSync(`${path}\\html-js`, `${path}\\${folder}`)
                break;
            case 'html-css-js':
                this.move(`../templates/html-css-js`, path)
                renameSync(`${path}\\html-css-js`, `${path}\\${folder}`)
                break;
            default:
                this.move(`../templates/html-css-js`, path)
                renameSync(`${path}\\html-css-js`, `${path}\\${folder}`)
        }
    }

    public static async checkIfPathExist(path: string) {
        if (existsSync(path)) {
            return true
        } else {
            return false
        }
    }

    public static async writeDataInFile(filePath: string, data: string) {
        writeFileSync(filePath, data)
    }

    private static async createDir(path: string) {
        if (existsSync(path)) {
            return
        } else {
            mkdirSync(path)
        }
    }

    private static async move(path: string, destination: string) {
        if (!existsSync(path) || !existsSync(destination)) {
            ux.error('Invalid Path')
        } else {
            copyFileSync(path, destination)
        }
    }
}