import dotenv from 'dotenv';
// Trigger Dev Server Restart
import path from 'path';

dotenv.config();

export class Config {
    static GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY;

    static GEMINI_MODEL_NAME = "gemini-2.5-flash";

    static BASE_DIR = process.cwd();
    static DATA_DIR = path.join(this.BASE_DIR, 'data');
    static INPUT_DIR = path.join(this.DATA_DIR, 'input');
    static PROCESSED_DIR = path.join(this.DATA_DIR, 'processed');

    static validate() {
        if (!Config.GOOGLE_API_KEY) {
            console.warn(
                "❌ GOOGLE_API_KEY is missing. " +
                "Check that .env exists in project root and contains a valid key."
            );
        }
    }
}
