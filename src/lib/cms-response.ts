import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/** Invalidate the shared navigation/footer as well as both public pages. */
export function cmsResponse(data: unknown, status = 200) {
  revalidatePath('/', 'layout');
  return NextResponse.json(data, { status });
}
