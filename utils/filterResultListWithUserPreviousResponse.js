export function filterResultListWithUserPreviousResponse(
        userResponseFilterFile,
        firstFilter,
        userResultList,
        parsedFile,
) {
        for (let i = 0; i < userResponseFilterFile.length; i++) {
                if (
                        parsedFile.reseponse !== undefined &&
                        parsedFile.reseponse !== null &&
                        parsedFile.reseponse.length > 0
                ) {
                        userResponseFilterFile = processUserInput(userFile, 'response');
                }
                userResultList.push(firstFilter.filter((a) => a[i] !== userResponseFilterFile[i]));
        }
        return userResultList;
}
