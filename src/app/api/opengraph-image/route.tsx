import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getNeynarUser } from "~/lib/neynar";
import { APP_NAME, APP_DESCRIPTION, APP_ICON_URL } from "~/lib/constants";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');

  const user = fid ? await getNeynarUser(Number(fid)) : null;

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 text-white relative"
      >
        <div tw="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        <div tw="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div tw="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div tw="relative flex flex-col items-center">
          <img src={APP_ICON_URL} alt="Logo" tw="w-32 h-32 mb-6 rounded-lg" />
          {user?.pfp_url && (
            <div tw="w-44 h-44 mb-6 rounded-full overflow-hidden border-4 border-white">
              <img src={user.pfp_url} alt="Profile" tw="w-full h-full object-cover" />
            </div>
          )}
          <h1 tw="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {APP_NAME}
          </h1>
          <p tw="mt-4 text-4xl opacity-80 text-center">{APP_DESCRIPTION}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}