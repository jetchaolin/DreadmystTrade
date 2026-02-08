export function filterItemsListWithUserInput(userRequestFilterFile, itemsListJSON, firstFilter) {
        let item = [];
        for (let i = 0; i < userRequestFilterFile.length; i++) {
                item = itemsListJSON.filter((a) => a.item === userRequestFilterFile[i])[0];

                if (!firstFilter.includes(item) && item !== undefined) {
                        firstFilter.push(item);
                        console.log('result: ', firstFilter);
                }
        }
        return firstFilter;
}
