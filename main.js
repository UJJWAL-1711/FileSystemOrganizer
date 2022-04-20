let path = require("path");
let fs = require("fs");
//in js there are single line strings only 
//so we use literals
// to take input 
let inputArr = process.argv.slice(2);//its first 2 index node filename
// console.log(inputArr);
let command = inputArr[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("\n 😆 Enter valid command");
        break;
}

function treeFn(dirPath) {
    console.log("Organize command implemented for ", dirPath);
    //inputpath,if path undef log error, create org dir , 
    // identify category , send files to he respective folders
    if (dirPath == undefined) {
        console.log("Enter the path");
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        let destPath;
        if (doesExist) {
            // create
             treeHelper(dirPath,"");
        }
        else {
            console.log("Kindly enter the correct path");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
}

function treeHelper(dirPath,indent) {
    //if folder read further if file read only
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent + "+---" + fileName);
    }
    else{
        console.log(indent + "|-----");
    }
}

function organizeFn(dirPath) {
    //create org dir 
    console.log("Organize command implemented for ", dirPath);
    //inputpath,if path undef log error, create org dir , 
    // identify category , send files to he respective folders
    if (dirPath == undefined) {
        console.log("Enter the path");
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        let destPath;
        if (doesExist) {
            // create
            destPath = path.join(dirPath, "organized_files");
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath); //makes a dir for org files
                //on the path orginal+organized files
                //first we take in the path(dirpath) of folder we want to org 
                //then make a dest path using dirpath+orgfiles
                //ten create a dir named dest path
                //in orghelper we copy those files to in this folder
            }
        }
        else {
            console.log("Kindly enter the correct path");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
}
//read type and send to correct folder
function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);
    //this givs us names but we need paths
    console.log(childNames);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        //gives us initialpath of each file
        //lstat to check file/folder or type
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            // console.log(childNames[i]);
            //copy/cut and place in category
            let category = getCategory(childNames[i]);
            console.log(childNames[i] + "belongs to " + category);

            sendFiles(childAddress, dest, category);
        }

    }
}

function helpFn() {
    console.log(
        `List of all commands:
        // node main.js tree "diectoryPath"
        // node main.js organize "diectoryPath"
        // node main.js help 
        
        `
    );
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1)//to remove dot
    for (let type in types) {
        let cType = types[type];
        for (let i = 0; i < cType.length; i++) {
            if (ext == cType[i]) {
                return type;
            }
        }
    }
    return "others";
}
function sendFiles(srcFilePath, dest, category) {
    // fs.mkdir
    let categoryPath = Path.join(dest,category);
    if(fs.existsSync(categoryPath)){
        fs.mkdir(categoryPath);
    }
    let fileName =  path.basename(srcFilePath);
    let destFilePath = path.join(fileName,categoryPath);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);//for cut
    return;
}