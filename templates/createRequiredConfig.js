/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* global console */
const fs = require('fs');
const configExample = require('./config.example.json');

const configJsonPath = './config.json';
const examplePath = configJsonPath.replace('.json', '.example.json');

fs.stat(configJsonPath, function(err) {
    if (err === null) {
        console.log(`${configJsonPath} file exists.`);
    } else if (err.code === 'ENOENT') {
        console.log(`${configJsonPath} file does NOT exists.`);
        fs.writeFile(configJsonPath, JSON.stringify(configExample), error => {
            if (error) {
                console.log(`Error creating file ${configJsonPath} from ${examplePath}: ${error.code}`);
            }
        });
        console.log(`Created file ${configJsonPath} from ${examplePath}`);
    } else {
        console.log(`Error looking for file ${configJsonPath}: ${err.code}`);
    }
});
