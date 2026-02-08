import fs from 'node:fs';

import writeUserFile from './writeUserFile.js';

async function readUserFile(path, data = '') {
        // let result = '';
        // console.log(path);
        // await readFile(`${path}`, 'utf8', (err, data) => {
        //         if (err) {
        //                 let data = { request: '', response: '' };
        //                 writeUserFile(data, path);
        //         }
        //         console.log('read_file: ', data);
        //         result = data;
        // });
        // console.log('read_result: ', result);
        // return result;
        try {
                return (data = fs.readFileSync(path, 'utf8'));
        } catch (err) {
                console.error('Failed to read file ', err);
        }
}

export default readUserFile;
