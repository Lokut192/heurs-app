import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { revalidateTag as nextRevalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import z, { ZodError } from 'zod';

import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';

const tagsSchema = z.array(z.string());

async function revalidateTags(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(
      JSON.stringify({
        message: ReasonPhrases.UNAUTHORIZED,
      }),
      {
        status: StatusCodes.UNAUTHORIZED,
        statusText: ReasonPhrases.UNAUTHORIZED,
      },
    );
  }

  if (!req.headers.get('content-type')?.includes('application/json')) {
    return new Response(
      JSON.stringify({
        message: ReasonPhrases.UNSUPPORTED_MEDIA_TYPE,
        error: 'Content type must be application/json',
      }),
      {
        status: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        statusText: ReasonPhrases.UNSUPPORTED_MEDIA_TYPE,
      },
    );
  }

  try {
    const json = await req.json();

    const tags = tagsSchema.parse(json);

    for (const tag of tags) {
      nextRevalidateTag(tag);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: ReasonPhrases.BAD_REQUEST,
          error:
            error.issues?.[0]?.message ??
            `Invalid json structure. Waiting for an array of strings.`,
        }),
        {
          status: StatusCodes.BAD_REQUEST,
          statusText: ReasonPhrases.BAD_REQUEST,
        },
      );
    } else if (error instanceof Error) {
      if (error.name === 'SyntaxError') {
        return new Response(
          JSON.stringify({
            message: ReasonPhrases.BAD_REQUEST,
            error: 'Invalid json',
          }),
          {
            status: StatusCodes.BAD_REQUEST,
            statusText: ReasonPhrases.BAD_REQUEST,
          },
        );
      }
    }
    return new Response(
      JSON.stringify({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      }),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      },
    );
  }
  return new Response(null, {
    status: StatusCodes.OK,
    statusText: ReasonPhrases.OK,
  });
}

export { revalidateTags as POST };
