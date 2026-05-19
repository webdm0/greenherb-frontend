import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { isAllowedCacheTag } from "@/lib/cache-tags"

type RevalidateRequestBody = {
  tag?: unknown
  secret?: unknown
}

const secret = process.env.SSG_REVALIDATE_SECRET

async function readBody(request: Request): Promise<RevalidateRequestBody> {
  try {
    return (await request.json()) as RevalidateRequestBody
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  if (!secret) {
    return NextResponse.json(
      { message: "SSG revalidation secret is not configured" },
      { status: 500 },
    )
  }

  const body = await readBody(request)

  if (body.secret !== secret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  if (typeof body.tag !== "string" || !isAllowedCacheTag(body.tag)) {
    return NextResponse.json(
      { message: "Invalid cache tag" },
      { status: 400 },
    )
  }

  revalidateTag(body.tag, "max")

  return NextResponse.json({
    revalidated: true,
    tag: body.tag,
  })
}
