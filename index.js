#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dirPath =  path.join(__dirname, '.gitlet');

const command = process.argv[2];

if (process.argv.length < 3) {
    console.log('Please enter a command.');
    process.exit(1);
}
switch (command) {
    case 'init':
        initial();
        break;
    case 'status':
        status();
        break;
    default:
        console.log('No command with that name exists.')
        process.exit(1);
}

function assertInitialed() {
    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
    } catch (error) {
        console.log('Not in an initialized Gitlet directory.');
        process.exit(1);
    }
}
function isGitletFile(file) {
    return ['.gitlet', 'index.js'].includes(file);
}

function status() {
    assertInitialed();
    fs.readdir(__dirname, (err, files) => {
        if (err) {
            throw err;
        }
        console.log('=== Untracked Files ===');
        files.forEach(file => {
            if (!isGitletFile(file)) {
                console.log(file)
            }
        })
    })
}
// process.exit(0);


function initial() {
    try {
        fs.accessSync(dirPath, fs.constants.F_OK);
        console.log('This is already initialized.');
    } catch (error) {
        fs.mkdir(dirPath, console.log)
    }
}

// A commit, therefore, will consist of 
// a log message, 
// timestamp, 
// a mapping of file names to blob references, 
// a parent reference, 
// and (for merges) a second parent reference.
let HEAD = null;
function commit(message) {
    // get change files
    const fileNames = null;
    const commit = {
        message,
        timestamp: Date.now(),
        fileMap: null,
        parent: HEAD,
        secondParent: null,
    }
    HEAD = commit;
    return commit
}


 function sha1Content(content) {
    const hash = crypto.createHash('SHA1');
    hash.update(content);
    return hash.digest('hex');
 }

 function hashFile(file, callback) {
    const input = fs.createReadStream(file);
    input.on('readable', () => {
        const data = input.read();
        if (data) {
            callback(null, sha1Content(data))
        }
    })
 }

//  fs.readdir(path.resolve(__dirname, '.'), (err, files) => {
//     files.map(file => {
//         console.log(file)
//         if (file !== 'index.js') {
//             hashFile(file, (e, hash) => {
//                 console.log('file: ' + file + ', hash: ', hash)
//             });
//         }
//     })
//  });