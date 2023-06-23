import { existsSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, appendFileSync } from 'fs';
import { TemplateSetOpt } from '../types';
import { ux } from '@oclif/core';
import { log } from 'console';
import path = require('path');

export default class FileService {
    public static async setupTemplate(path: string, templates: TemplateSetOpt, folder: string) {
        switch (templates.template) {
            case 'html':
                this.createDir(`${path}${folder}`)
                this.move(`${process.cwd()}/src/templates/html/`, `${path}${folder}`)
                break;
            case 'html-css':
                this.createDir(`${path}${folder}`)
                this.move(`${process.cwd()}/src/templates/html-css/`, `${path}${folder}`)
                break;
            case 'html-js':
                this.createDir(`${path}${folder}`)
                this.move(`${process.cwd()}/src/templates/html-js/`, `${path}${folder}`)
                break;
            case 'html-css-js':
                this.createDir(`${path}${folder}`)
                this.move(`${process.cwd()}/src/templates/html-css-js/`, `${path}${folder}`)
                break;
            default:
                this.move(`${process.cwd()}/src/templates/html-css-js/`, `${path}${folder}`)
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

    public static async appendDataInFile(filePath: string, data: string) {
        appendFileSync(filePath, data)
    }

    private static async createDir(path: string) {
        if (existsSync(path)) {
            return
        } else {
            mkdirSync(path)
        }
    }

    private static async move(srcPath: string, destination: string) {
        mkdirSync(destination, { recursive: true })
        for (const file of readdirSync(srcPath)) {
            const srcFile = path.resolve(srcPath, file)
            const destFile = path.resolve(destination, file)
            this.copy(srcFile, destFile)
        }
    }

    private static async copy(src: string, dest: string) {
        const stat = statSync(src)
        if (stat.isDirectory()) {
            this.move(src, dest)
        } else {
            copyFileSync(src, dest)
        }
    }
}