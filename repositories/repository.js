const fs = require('fs');
const crypto = require('crypto');



module.exports = class Repository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename')
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async create(attrs) {
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);
        await this.writeaAll(records);

        return attrs;

    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        })
    );
}

    async writeaAll(records) {
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records, null, 2)
        );
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex'); // create random id
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(records => records.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeaAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id)

        if(!record) {
            throw new Error(`Record with id ${id} not found`)
        }
        //record == { email: 'test@test.com }
        // record === { password: 'mypassword' }
        Object.assign(record, attrs);
        // record === { email: 'test@test.com, password: 'myapassword'}
        await this.writeaAll(records)
    }

    async getOneBy (filters) {
        const records = await this.getAll();

        for (let record of records) { // of - iterating through arrays
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}