import "../config/db.js";
import { User } from "../modules/user.modules.js";
import logger from "../loggers/Log4jsLogger.js";

export class UsuarioDao {

    ID_FIELD = "_id";
    USERNAME_FIELD = 'username';
    
    async createUser(object) {
        try {
            return await User.create(object);
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
    
    async loginUser(object) {
        try {
            const user = await User.findOne({
                [this.USERNAME_FIELD] : object.username
            });
            
            if (!user) {
                logger.info(`User '${object.username}' does not exist`)
                return null;   
            } 
            
            return await user.comparePassword(object.password);
        
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
}