"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurahController = void 0;
const surah_service_1 = require("../../../services/quran/surah.service");
const response_util_1 = require("../../../utils/response.util");
class SurahController {
    surahService;
    constructor() {
        this.surahService = new surah_service_1.SurahService();
    }
    getAllSurahs = async (_req, res) => {
        const surahs = await this.surahService.getAllSurahs();
        return response_util_1.ApiResponse.success(res, surahs);
    };
    getSurahById = async (req, res) => {
        const params = req.params;
        const query = req.query;
        const surah = await this.surahService.getSurahById(params.id, query.language);
        return response_util_1.ApiResponse.success(res, surah);
    };
    getSurahAyahs = async (req, res) => {
        const params = req.params;
        const query = req.query;
        const ayahs = await this.surahService.getSurahAyahs(params.id, query.from, query.to, query.language);
        return response_util_1.ApiResponse.success(res, ayahs);
    };
    getSurahInfo = async (req, res) => {
        const params = req.params;
        const surahInfo = await this.surahService.getSurahInfo(params.id);
        return response_util_1.ApiResponse.success(res, surahInfo);
    };
}
exports.SurahController = SurahController;
