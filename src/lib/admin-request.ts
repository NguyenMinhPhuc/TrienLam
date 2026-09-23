'use client';

/** Admin mutations report failures and notify public tabs only after a successful save. */
export async function adminRequest(url: string, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, { ...init, cache: 'no-store' });
    if (!response.ok) {
      const data = await response.clone().json().catch(() => ({}));
      throw new Error(response.status === 401
        ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        : data.error || 'Không thể lưu thay đổi. Vui lòng thử lại.');
    }
    if (init?.method && init.method !== 'GET') {
      try { localStorage.setItem('lhu-content-updated', String(Date.now())); } catch {}
      window.dispatchEvent(new Event('lhu-content-updated'));
    }
    return response;
  } catch (error) {
    window.alert(error instanceof Error ? error.message : 'Mất kết nối máy chủ. Vui lòng thử lại.');
    return new Response(JSON.stringify({ error: 'Yêu cầu không thành công.' }), { status: 503 });
  }
}
