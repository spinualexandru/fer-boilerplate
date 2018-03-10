const before = require('./hooks/before');
module.exports = {
    before,
    after: {
        all: [],
        find: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    }
};