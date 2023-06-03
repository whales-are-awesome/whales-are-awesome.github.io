// @ts-nocheck
// eslint-disable

function snakelize(dataObj: any) {
    return JSON.parse(JSON.stringify(dataObj).replace(
        /([a-z][A-Z])/g,
        match => match[0] + '_' + match[1].toLowerCase()
    ));
}

export default snakelize;
