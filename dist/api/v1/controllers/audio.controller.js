"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const audio_service_1 = require("../../../services/quran/audio.service");
const response_util_1 = require("../../../utils/response.util");
class AudioController {
    constructor() {
        this.getAudioInfo = async (req, res) => {
            const surahId = parseInt(req.params.surahId);
            const ayahNumber = parseInt(req.params.ayahNumber);
            const audioInfo = await this.audioService.getAudioInfo(surahId, ayahNumber);
            return response_util_1.ApiResponse.success(res, audioInfo);
        };
        this.streamAudio = async (req, res) => {
            const surahId = parseInt(req.params.surahId);
            const ayahNumber = parseInt(req.params.ayahNumber);
            const audioData = await this.audioService.streamAudio(surahId, ayahNumber);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.send(audioData);
        };
        this.getAudioRange = async (req, res) => {
            const surahId = parseInt(req.params.surahId);
            const range = await this.audioService.getAvailableAudioRange(surahId);
            return response_util_1.ApiResponse.success(res, range);
        };
        this.audioService = new audio_service_1.AudioService();
    }
}
exports.AudioController = AudioController;
