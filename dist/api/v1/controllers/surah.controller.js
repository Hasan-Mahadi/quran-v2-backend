"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurahController = void 0;
const surah_service_1 = require("../../../services/quran/surah.service");
const response_util_1 = require("../../../utils/response.util");
class SurahController {
    constructor() {
        this.getAllSurahs = async (_req, res) => {
            const surahs = await this.surahService.getAllSurahs();
            return response_util_1.ApiResponse.success(res, surahs);
        };
        this.getSurahById = async (req, res) => {
            const params = req.params;
            const query = req.query;
            const surah = await this.surahService.getSurahById(params.id, query.language);
            return response_util_1.ApiResponse.success(res, surah);
        };
        this.getSurahAyahs = async (req, res) => {
            const params = req.params;
            const query = req.query;
            const ayahs = await this.surahService.getSurahAyahs(params.id, query.from, query.to, query.language);
            return response_util_1.ApiResponse.success(res, ayahs);
        };
        this.getSurahInfo = async (req, res) => {
            const params = req.params;
            const surahInfo = await this.surahService.getSurahInfo(params.id);
            return response_util_1.ApiResponse.success(res, surahInfo);
        };
        this.surahService = new surah_service_1.SurahService();
    }
}
exports.SurahController = SurahController;
