// @ts-nocheck
// eslint-disable

function camelize(dataObj: any) {
    return JSON.parse(JSON.stringify(dataObj).replace(
        /(_\w)\w+":/g,
        match => match[1].toUpperCase() + match.substring(2)
    ));
}

export default camelize;
