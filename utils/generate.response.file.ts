import fs from 'fs-extra';

import { showGenerate, showCreate, showUpdate, showError, checkIfDirExistElseMakeDir, checkExistence, showInfo } from './index';

export function generateResponseFile(fileContent: string, filePath:string, fileNameWithExt: string): void | Promise<void> {
    showGenerate(fileNameWithExt);
    checkIfDirExistElseMakeDir(filePath);

    const fileExists = checkExistence(`${filePath}/${fileNameWithExt}`)

    if (!fileExists) return createFile(filePath, fileNameWithExt, fileContent);
    return overwriteFileOrThrowError(filePath, fileNameWithExt, fileContent);
}

export function createFile(filePath: string, fileName: string, fileContent: string, fileAlreadyExists = false): void {
    const filepath: string = process.cwd() + `${filePath}/${fileName}`;
    showInfo(filepath);
    fs.writeFile(filepath, fileContent, (error: Error) => {
        if (!error && !fileAlreadyExists) return showCreate(fileName, filePath);
        if (!error && fileAlreadyExists) return showUpdate(fileName, filePath);
        return showError(error);
    });
}

async function overwriteFileOrThrowError(filePath: string, fileNameWithExt: string, fileContent: string): Promise<void> {
    return createFile(filePath, fileNameWithExt, fileContent, true);
}
