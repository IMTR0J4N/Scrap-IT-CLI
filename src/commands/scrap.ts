import { Command, Flags, ux } from '@oclif/core'
import * as inquirer from 'inquirer';

export default class Scrap extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    url: Flags.string({})
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Scrap)

    let url = flags.url

    if (!url) {
      const response: any = await inquirer.prompt([{
        name: 'url',
        message: 'Which URL you want Scrap-IT to scrap ?',
        type: 'input',
      }])

      await this.isUrl(response.url)
      
      url = response.url
    }
    ux.log(`The stage is: ${url}`)
  }
  
  private async isUrl(url: string): Promise<boolean> {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  }
}
