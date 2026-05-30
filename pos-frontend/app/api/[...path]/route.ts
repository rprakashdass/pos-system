import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getBackendOrigin() {
  const rawBackendOrigin = process.env.API_PROXY_TARGET || "http://localhost:8082";
  return rawBackendOrigin.replace(/\/+$/, "").replace(/\/api$/, "");
}

async function proxy(request: NextRequest, pathParts: string[]) {
  const backendOrigin = getBackendOrigin();
  const upstreamUrl = new URL(`${backendOrigin}/api/${pathParts.join("/")}`);
  upstreamUrl.search = request.nextUrl.search;

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.delete("host");
  upstreamHeaders.delete("connection");
  upstreamHeaders.delete("content-length");

  const upstreamResponse = await fetch(upstreamUrl, {
    method,
    headers: upstreamHeaders,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstreamResponse.headers);

  // Some headers should not be forwarded as-is.
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  // Next/undici may expose multi Set-Cookie values via getSetCookie().
  type HeadersWithSetCookie = Headers & { getSetCookie?: () => string[] };
  const headersWithSetCookie = upstreamResponse.headers as HeadersWithSetCookie;
  const setCookies: string[] =
    typeof headersWithSetCookie.getSetCookie === "function"
      ? headersWithSetCookie.getSetCookie()
      : [];

  if (setCookies.length === 0) {
    const single = upstreamResponse.headers.get("set-cookie");
    if (single) setCookies.push(single);
  }
  if (setCookies.length > 0) {
    responseHeaders.delete("set-cookie");
  }

  const body = await upstreamResponse.arrayBuffer();
  const response = new Response(body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });

  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}
