import EcommerceDAOMongo from "../dao/EcommerceDao.js";

export default class EcommerceFactory {
    static createDAO(type) {
        switch (type) {
            case "mongo":
                return EcommerceDAOMongo.getEcommerceDAOInstance();
            default:
                return EcommerceDAOMongo.getEcommerceDAOInstance();
            break;
        }
    }
}