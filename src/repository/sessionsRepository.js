import { userModel } from "../dao/models/user.model.js";

class SessionsRepository {
    async getBy(filter) {
        return await userModel.findOne(filter).lean();
    }

    async create(user) {
        let nuevoUsuario = await userModel.create(user);        
        return nuevoUsuario.toJSON();
    }

    async update(filter, update) {
        return await userModel.findOneAndUpdate(filter, update, { new: true }).lean();
    }
}

export default new SessionsRepository();

