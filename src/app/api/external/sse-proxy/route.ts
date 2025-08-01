import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { pathToRegexp } from 'path-to-regexp';

const knownExternalApiSseEndpoints = [
  pathToRegexp('/inbox/messages/live').regexp.source,
];

export async function GET(req: Request, res: Response) {
  // Access token
  const token = req.headers.get('x-authorization');

  if (typeof token !== 'string' || token.trim().length === 0) {
    return new Response(
      JSON.stringify({
        status: StatusCodes.UNAUTHORIZED,
        statusText: ReasonPhrases.UNAUTHORIZED,
        message: 'Missing access token in headers',
      }),
      {
        status: StatusCodes.UNAUTHORIZED,
        statusText: ReasonPhrases.UNAUTHORIZED,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  }

  // Incoming url
  const reqURL = new URL(req.url);

  // Get targeted endpoint pathname
  const targetPathname = reqURL.searchParams.get('endpoint');

  if (
    targetPathname === null ||
    !knownExternalApiSseEndpoints.some((reg) =>
      new RegExp(reg).test(targetPathname),
    )
  ) {
    return new Response(
      JSON.stringify({
        status: StatusCodes.BAD_REQUEST,
        statusText: ReasonPhrases.BAD_REQUEST,
        message: 'Unknown endpoint',
      }),
      {
        status: StatusCodes.BAD_REQUEST,
        statusText: ReasonPhrases.BAD_REQUEST,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  }

  try {
    const targetURL = new URL(targetPathname, process.env.NEXT_PUBLIC_API_URL);

    const response = await fetch(targetURL.href, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Request failed with status code ' + response.status);
    }

    if (!response.body) {
      throw new Error('Response body is not readable');
    }

    // req.on
  } catch (_error) {
    // Catch me if u can
  }

  return new Response(
    JSON.stringify({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    }),
    {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
  );
}
