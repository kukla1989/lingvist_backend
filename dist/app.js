"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const word_1 = __importDefault(require("./routes/word"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/words", word_1.default);
exports.default = app;
