import { Command, Flags, ux } from '@oclif/core';
import * as inquirer from 'inquirer';

import * as fs from 'fs';
import PuppeteerService from '../services/PuppeteerService';

import { ScrapFiles } from "../interfaces"

// const shell = new ActiveXObject('WScript.Shell');
// const pathToMyDocuments = shell.SpecialFolders('MyDocuments');

export default class Scrap extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    url: Flags.string({})
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Scrap)

    let url = flags.url

    if (!url) {
      const urlResponse: any = await inquirer.prompt([{
        name: 'url',
        message: 'Which URL you want Scrap-IT to scrap ?',
        type: 'input',
        default: ' https://example.com'
      }]).then(async (data) => {
        if (await this.isUrl(data.url) === false) {
          ux.error('Given URL is invalid')
        } else {
          url = data.url
        }
      }).then(() => {
        new PuppeteerService().scrap("html", { includeScript: true, includeStyle: true })
      })
    }
  }
  
  private async isUrl(url: string): Promise<boolean> {
    const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return urlRegex.test(url);
  }
}
