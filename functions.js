import fs from 'fs/promises';

async function listDirectory2(path) {
    const dirents = await fs.readdir(path, { withFileTypes: true });
    const tabFiles = await Promise.all(dirents.map(dirent => transformDirent(dirent, path)));
    return tabFiles;
}

async function transformDirent2(dirent, path) {
    const file = {
        name: dirent.name,
        isFolder: dirent.isDirectory(),
    }
    if (dirent.isFile()) {
        const statsFile = await getStatsFile(dirent, path);
        file.size = statsFile.size;
    }
    return file;
}

function getStatsFile2(dirent, path) {
    return fs.stat(path + dirent.name)
}

function listDirectory(path) {
    return fs.readdir(path, { withFileTypes: true })
        .then(dirents => Promise.all(dirents.map(dirent => transformDirent(dirent, path))));
}

function transformDirent(dirent, path) {
    const file = {
        name: dirent.name,
        isFolder: dirent.isDirectory(),
    }
    if (dirent.isFile()) {
        return getStatsFile(dirent, path)
            .then(statsFile=>{
                file.size = statsFile.size;
                return file;
            });
    }
    return file;
}

function getStatsFile(dirent, path) {
    return fs.stat(path + dirent.name);
}

async function createDirectory(path, folderName){

    const regexFolderName = new RegExp ("^[a-zA-Z]+$","gm");
    const isAlphanum = regexFolderName.test(folderName);

    if (isAlphanum){
        fs.mkdir(path+folderName);
    } else {
        throw new Error('Ce nom de dossier n\'est pas accepté !')
    }
}

async function isFolder(path){
    const statsFile = await fs.stat(path);
    return statsFile.isDirectory();
}

async function deleteFileOrDirectory(path, objName){
    const regexObjName = new RegExp ("^[a-zA-Z.\-_]+$","gm");
    const isAlphanum = regexObjName.test(objName.length);

    if (isAlphanum){
        fs.rm(path+objName, {recursive : true} );
    } else {
        throw new Error('Ce nom de dossier n\'est pas accepté !')
    }
}

function uploadFile(path, UploadFile){
    if(!UploadFile){
        throw new Error("File was not found")
    }
    return fs.writeFile(path+UploadFile.name, UploadFile.data)
}

function uploadFileBusboy(path, UploadFile){
    if(!UploadFile){
        throw new Error("File was not found")
    }
    return fs.rename(UploadFile.file, path+UploadFile.filename)
}

export {listDirectory, isFolder, createDirectory, deleteFileOrDirectory, uploadFile, uploadFileBusboy}