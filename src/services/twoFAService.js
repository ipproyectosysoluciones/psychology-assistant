// Re-exports from TypeScript version - supports both default and namespace imports
import * as module from './twoFAService.ts';
export const { generateSecret, generate2FACode, verify2FACode } = module;
export default module.twoFAService;
