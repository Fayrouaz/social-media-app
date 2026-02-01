"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options }) {
        return await this.model.create(data, options);
    }
    async findOne({ filter, select, options }) {
        const doc = this.model.findOne(filter).select(select || "");
        if (options?.populate) {
            doc.populate(options.projection);
        }
        return await doc.exec();
    }
    async paginate({ filter = {}, select = {}, options = {}, page = 1, size = 5 }) {
        let docsCount = undefined;
        let pages = undefined;
        page = Math.floor(page < 1 ? 1 : page);
        options.limit = Math.floor(size < 1 || !size ? 5 : size);
        options.skip = (page - 1) * options.limit;
        docsCount = await this.model.countDocuments(filter);
        pages = Math.ceil((docsCount || 0) / (options.limit || 5));
        const result = await this.find({ filter, select, options: options });
        return { docsCount, pages, limit: options.limit, currentPage: page, result };
    }
    async findById({ id, select, options }) {
        const query = this.model
            .findById(id)
            .select(select || " ");
        if (options?.populate) {
            query.populate(options.populate);
        }
        if (options?.lean) {
            query.lean();
        }
        return await query.exec();
    }
    async updateOne({ filter, update, options }) {
        const updateWithInc = {
            ...update,
            $inc: {
                _v: 1,
                ...(update.$inc || {})
            }
        };
        return await this.model.updateOne(filter, updateWithInc, options);
    }
    async findOneAndUpdate({ filter, update, select, options }) {
        let query = this.model.findOneAndUpdate(filter, update, { new: options?.new ?? true });
        if (select)
            query = query.select(select);
        if (options?.populate)
            query = query.populate(options.populate);
        if (options?.lean) {
            return (await query.lean());
        }
        return await query.exec();
    }
    async deleteOne({ filter }) {
        return await this.model.deleteOne(filter);
    }
    async deleteMeny({ filter }) {
        return await this.model.deleteMany(filter);
    }
    async findOneAndDeltete({ filter }) {
        return await this.model.findOneAndDelete(filter);
    }
    async insertMany({ data }) {
        return (await this.model.insertMany(data));
    }
    async find({ filter, select, options }) {
        const query = this.model.find(filter || {});
        if (select) {
            query.select(select);
        }
        if (options?.populate) {
            query.populate(options.populate);
        }
        if (options?.limit)
            query.limit(options.limit);
        if (options?.skip)
            query.skip(options.skip);
        if (options?.sort)
            query.sort(options.sort);
        if (options?.lean) {
            query.lean();
        }
        return await query.exec();
    }
}
exports.DatabaseRepository = DatabaseRepository;
