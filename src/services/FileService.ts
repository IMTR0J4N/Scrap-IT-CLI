import * as fs from 'fs';

export default class FileService {
    public static async isFolderExist(path: string) {
        if (fs.existsSync(path)) {
            return
        } else {
            this.createDir(path)
        }
    }

    public static async writeDataInFile(filePath: string, data: string) {
        fs.writeFileSync(filePath, data)
    }

    private static async createDir(path: string) {
        if (fs.existsSync(path)) {
            return
        } else {
            fs.mkdirSync(path)
        }
    }
}