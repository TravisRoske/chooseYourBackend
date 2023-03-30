"use strict";
//jest.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
exports.default = config;
