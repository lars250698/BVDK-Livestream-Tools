export interface IUtil {
  getPlatform: () => string
}

export const util: IUtil = {
  getPlatform() {
    return process.platform
  }
}
