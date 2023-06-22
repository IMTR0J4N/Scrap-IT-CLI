import { Args, Command, Flags, ux } from '@oclif/core';
import * as inquirer from 'inquirer';

import { homedir, tmpdir } from 'os';

import FileService from '../services/FileService';
import ScrapService from '../services/ScrapService';
import { existsSync, mkdirSync } from 'fs';

const userPath = homedir()

const userDocuments = `${userPath}\\Documents\\Scrap-IT\\`;
const userDownloads = `${userPath}\\Downloads\\Scrap-IT\\`;
const userTmpFile = `${tmpdir()}\\Scrap-IT\\`;

export default class Scrap extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    js: Flags.boolean(),
    css: Flags.boolean(),
  }

  static args = {
    url: Args.string({ default: "" }),
    pathToDocuments: Args.directory({ default: userDocuments }),
    pathToDownloads: Args.directory({ default: userDownloads }),
    pathToTmpFiles: Args.directory({ default: userTmpFile }),
    customPath: Args.directory(),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Scrap)

    if (!args.url) {
      const urlResponse: any = await inquirer.prompt([{
        name: 'url',
        message: 'Which URL you want Scrap-IT to scrap ?',
        type: 'input',
        default: ' https://example.com',
      }]).then(async (res) => {
        if (!this.isUrl(res.url)) {
          ux.error('Given URL is invalid')
        } else {
          args.url = res.url
        }
      }).then(async (res) => {

        const optResponse: any = await inquirer.prompt([{
          name: 'options',
          message: 'Select the options that suit you best',
          type: 'checkbox',
          choices: [
            {
              name: 'Scrap Style',
              checked: flags.css
            },
            {
              name: 'Scrap Script',
              checked: flags.js
            }
          ]
        }]).then(async res => {

          flags.css = res.options[0];
          flags.js = res.options[1];

          const pathResponse: any = inquirer.prompt([{
            name: "path",
            message: "Select the path where you want to save scrap data",
            type: "list",
            choices: [
              {
                name: "Documents",
                value: args.pathToDocuments
              },
              {
                name: "Downloads",
                value: args.pathToDownloads
              },
              {
                name: "Temp Files",
                value: args.pathToTmpFiles
              },
              {
                name: "Custom Path",
                value: "custom",
              }
            ]
          }]).then(async res => {

            if (res.path === 'custom') {
              const customPathResponse: any = inquirer.prompt([{
                name: 'customPath',
                type: 'input',
                message: "Enter the custom path you want"
              }]).then(async res => {
                await FileService.checkIfPathExist(res.customPath) ? new ScrapService().scrapURL(args.url, `${res.customPath}\\Scrap-IT`, 'html', { includeScript: flags.js, includeStyle: flags.css }) : ux.error('Given path not exists')
                new inquirer.ui.BottomBar().updateBottomBar('Scraping');
              })
            } else {
              if (!existsSync(`${res.path}`)) {
                mkdirSync(`${res.path}`)
              }
              new ScrapService().scrapURL(args.url, res.path, 'html', { includeScript: flags.js, includeStyle: flags.css})
            }
          })

        })
      })
    }
  }

  private async isUrl(url: string): Promise<boolean> {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  }
}
