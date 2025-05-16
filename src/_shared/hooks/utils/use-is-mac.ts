'use client';

export const useIsMac = () => {
  try {
    // @ts-ignore
    return navigator.userAgentData.platform.toUpperCase().includes('MAC');
  } catch (_serverException) {
    return false;
  }
};
