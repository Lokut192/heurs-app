declare namespace NodeJS {
  interface ProcessEnv {
    API_URL?: string;
    NEXT_PUBLIC_API_URL?: string;
    NEXTAUTH_SECRET?: string;
    NEXTAUTH_URL_INTERNAL?: string;
    NEXTAUTH_URL?: string;
  }
}
