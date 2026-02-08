import fs from 'fs';

function writeUserFile(data, path) {
        data = JSON.stringify(data);
        fs.writeFile(path, data, (err) => {
                if (err) {
                        console.error('Failed', err);
                }
        });
}

export default writeUserFile;
