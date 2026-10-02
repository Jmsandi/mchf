import {env} from 'cloudflare:workers';
export {env};
export const isDevelopment = import.meta.env.DEV;
export const runtimePlatform = 'cloudflare';
export const supportsPlatformAuth = true;
