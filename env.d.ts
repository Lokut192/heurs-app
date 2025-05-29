declare namespace NodeJS {
  interface ProcessEnv {
    APP_URL?: string;
    NEXT_PUBLIC_APP_URL?: string;
    API_URL?: string;
    NEXT_PUBLIC_API_URL?: string;
    NEXTAUTH_SECRET?: string;
    NEXTAUTH_URL_INTERNAL?: string;
    NEXTAUTH_URL?: string;
  }
}
