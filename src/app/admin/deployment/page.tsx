import { ExternalLink, GitBranch, Rocket, ShieldCheck } from 'lucide-react';

const actionsUrl = 'https://github.com/NguyenMinhPhuc/TrienLam/actions/workflows/deploy.yml';

export default function DeploymentManager() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black text-white mb-2 md:text-4xl">Hệ Thống & Deployment</h1>
        <p className="text-slate-400">Cập nhật website bằng GitHub Desktop.</p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10">
          <Rocket className="mb-6 text-lhu-blue" size={32} aria-hidden="true" />
          <h2 className="mb-4 text-2xl font-bold text-white">Push lên main để deploy</h2>
          <p className="mb-6 leading-relaxed text-slate-400">Sau khi bạn đẩy code bằng GitHub Desktop, GitHub Actions sẽ tự kết nối server, build và khởi động lại website.</p>
          <ol className="list-decimal space-y-4 pl-5 text-slate-300 leading-relaxed">
            <li>Mở repository <strong>TrienLam</strong>, chọn nhánh <strong>main</strong>.</li>
            <li>Kiểm tra thay đổi, nhập Summary và bấm <strong>Commit to main</strong>.</li>
            <li>Bấm <strong>Push origin</strong> để gửi code và bắt đầu deploy.</li>
            <li>Mở GitHub Actions bên dưới, chọn lượt chạy mới nhất và đợi kết quả.</li>
          </ol>
          <a href={actionsUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-2xl bg-lhu-orange px-6 py-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lhu-orange">
            Xem kết quả deploy <ExternalLink size={18} aria-hidden="true" />
          </a>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">Commit chỉ lưu trên máy. Deploy bắt đầu sau Push origin; kết quả thực tế được hiển thị trên GitHub Actions.</p>
        </section>
        <aside className="space-y-6">
          <section className="rounded-[32px] border border-lhu-blue/20 bg-lhu-blue/10 p-8">
            <h2 className="mb-4 flex items-center gap-3 font-bold text-lhu-blue"><GitBranch size={20} /> Luồng triển khai</h2>
            <p className="text-sm leading-relaxed text-slate-300">GitHub Desktop → Push main → GitHub Actions → SSH / PM2.</p>
            <p className="mt-4 text-sm text-slate-400">Ứng dụng: trien-lam · Cổng: 3127</p>
          </section>
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 flex items-center gap-3 font-bold text-white"><ShieldCheck size={20} /> Cấu hình một lần</h2>
            <p className="text-sm leading-relaxed text-slate-400">Thiết lập secrets SSH trên GitHub và .env trên server theo docs/deployment.md. Không cần GITHUB_PAT trong website.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">Build có thể ảnh hưởng website đang chạy. Nếu deploy lỗi, xem log Actions; hệ thống chưa tự rollback.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
