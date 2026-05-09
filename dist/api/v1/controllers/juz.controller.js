"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuzController = void 0;
const juz_repository_1 = require("../../../repositories/juz.repository");
const response_util_1 = require("../../../utils/response.util");
class JuzController {
    juzRepository;
    constructor() {
        this.juzRepository = new juz_repository_1.JuzRepository();
    }
    getAllJuz = async (_req, res) => {
        const juzList = await this.juzRepository.findAll();
        return response_util_1.ApiResponse.success(res, juzList);
    };
    getJuzById = async (req, res) => {
        const id = parseInt(req.params.id);
        const juz = await this.juzRepository.findById(id);
        if (!juz) {
            return response_util_1.ApiResponse.error(res, 'NOT_FOUND', `Juz ${id} not found`, null, 404);
        }
        return response_util_1.ApiResponse.success(res, juz);
    };
}
exports.JuzController = JuzController;
