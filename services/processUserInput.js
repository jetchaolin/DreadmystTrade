function processUserInput(file, userFileKey) {
        file = JSON.parse(file);
        file = file[`${userFileKey}`];
        file = JSON.stringify(file);
        console.log('file: ', file);
        file = file.replace('[', '').replace(']', '').replace(/"/g, '');
        return file.split(',');
}

export default processUserInput;
