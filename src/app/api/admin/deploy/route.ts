import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const pat = process.env.GITHUB_PAT;

    if (!owner || !repo || !pat) {
      return NextResponse.json({ 
        error: 'Chưa cấu hình các tham số GitHub (PAT, Owner, Repo) trong .env' 
      }, { status: 500 });
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'LHU-Tech-Hub-CMS'
        },
        body: JSON.stringify({
          event_type: 'deploy-triggered-from-admin',
          client_payload: {
            triggered_by: 'Admin Dashboard',
            timestamp: new Date().toISOString()
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      return NextResponse.json({ 
        error: `Không thể gửi tín hiệu tới GitHub: ${errorData.message || response.statusText}` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Đã gửi tín hiệu triển khai thành công tới GitHub!' 
    });
  } catch (err) {
    console.error('Deployment Trigger Error:', err);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi gửi yêu cầu triển khai.' }, { status: 500 });
  }
}
