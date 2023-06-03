let id = 0;

function createId(name = '') {
    return name + ++id;
}

export {
    id,
    createId
};
