const uint = (new Array(256))
    .fill(0)
    .map((_, index) => index + 1)
    .filter(item => item % 8 === 0)
    .map(item => 'uint' + (item));

const int = (new Array(256))
    .fill(0)
    .map((_, index) => index + 1)
    .filter(item => item % 8 === 0)
    .map(item => 'int' + (item));

const fixed = (new Array(256))
    .fill(0)
    .map((_, index) => index + 1)
    .filter(item => item % 8 === 0)
    .map(item => 'int' + (item));

const bytes = (new Array(32))
    .fill(0)
    .map((_, index) => index + 1)
    .filter(item => item % 8 === 0)
    .map(item => 'bytes' + (item));


const solidityTypes = [
    'bool',
    'address',
    'function',
    'uint',
    ...uint,
    'int',
    ...int,
    ...bytes,
];

export {
    solidityTypes
};
