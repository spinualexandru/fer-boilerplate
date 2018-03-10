const _ = require('underscore');

module.exports = class Users {
    constructor() {
        this.users = [];
        this.currentId = 0;
    }

    async find(filters) {
        if(filters){
            return _.where(this.users, filters);
        }
        return this.users;
    }
    async get(id, params) {
        // Find the message by id
        const user = _.find(this.users, {id});
        // Throw an error if it wasn't found
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        // Otherwise return the message
        return user;
    }
    async create(data, params) {
        this.currentId = Number(_.uniqueId());
        const newUser = Object.assign({
            id: this.currentId
        }, data);
        this.users.push(newUser);
        return newUser;
    }
    async update(id, data, params) {}
    async patch(id, data, params) {
        const user = await this.get(1);
        return Object.assign(user, data)
    }
    async remove(id, params) {
        const user = await this.get(1);
        this.users = _.reject(this.users, user => user.id === id);
        return user;
    }
}