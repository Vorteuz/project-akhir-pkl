import Link from "next/link";
import { Wifi, Activity, LifeBuoy, ArrowRight, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content overflow-x-hidden">
      {/* Navbar */}
      <nav className="navbar fixed top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-200 px-6 lg:px-12 h-20">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-black tracking-tight text-primary group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Activity size={20} />
            </div>
            <div>
              ISP<span className="text-base-content">CENTER</span>
              <span className="block text-[10px] font-medium text-gray-400 -mt-1 tracking-widest uppercase">Network & Support</span>
            </div>
          </Link>
        </div>
        <div className="flex-none gap-3 hidden md:flex">
          <DarkModeToggle />
          <Link href="/login" className="btn btn-sm btn-ghost font-semibold text-gray-600 hover:text-primary">Masuk</Link>
          <Link href="/login" className="btn btn-sm btn-primary rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            Lapor Gangguan
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12">
        {/* Abstract Background */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-base-100 to-transparent -z-10"></div>
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-60 mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute left-0 top-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 border border-base-200 shadow-sm text-sm font-semibold text-base-content animate-fade-in-up">
              <LifeBuoy size={16} className="text-primary" />
              <span>Pusat Bantuan & Monitoring 24/7</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-base-content">
              Solusi Cepat saat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Koneksi Terhambat.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg leading-relaxed border-l-4 border-primary/20 pl-6">
              Jangan biarkan gangguan internet menghambat produktivitas Anda. Pantau status jaringan, ajukan tiket bantuan, dan dapatkan solusi real-time langsung dari dashboard pelanggan.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/login" className="btn btn-primary btn-lg h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-3 group">
                <Wifi size={20} />
                Saya Mengalami Gangguan
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
              </Link>
            </div>
          </div>

          {/* Right Visual: Interactive Dashboard Simulation */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-2xl transform rotate-3"></div>

            {/* Main Card */}
            <div className="relative bg-base-100 rounded-[2.5rem] border border-base-200 shadow-2xl overflow-hidden p-6 transform hover:scale-[1.01] transition-transform duration-500">
              {/* Header Mockup */}
              <div className="flex items-center justify-between mb-8 border-b border-base-100 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/80"></div>
                  <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80"></div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-base-100 border border-base-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Live Monitoring
                </div>
              </div>

              {/* Dashboard grid mockup */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-base-50 p-4 rounded-3xl border border-base-200">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                    <Zap size={20} />
                  </div>
                  <div className="text-2xl font-black text-base-content">25 ms</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">Latency / Ping</div>
                </div>
                <div className="bg-base-50 p-4 rounded-3xl border border-base-200">
                  <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center mb-3">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="text-2xl font-black text-base-content">99.9%</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">System Uptime</div>
                </div>
              </div>

              {/* Ticket Mockup */}
              <div className="bg-base-200/50 rounded-3xl p-5 border border-base-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-bold text-gray-600">Terakhir Dilaporkan</div>
                  <div className="badge badge-warning text-xs font-bold">On Progress</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-warning">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Koneksi Lambat di Area Dago</div>
                    <div className="text-xs text-gray-500 mt-1">Teknisi sedang melakukan pengecekan di lokasi sentral. Est 2 jam.</div>
                  </div>
                </div>
                {/* Progress bar simulation */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-warning h-1.5 rounded-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-base-100 flex items-center gap-3 animate-bounce-slow">
              <div className="avatar-group -space-x-3">
                <div className="avatar border-white">
                  <div className="w-8">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                  </div>
                </div>
                <div className="avatar border-white">
                  <div className="w-8">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" />
                  </div>
                </div>
                <div className="avatar placeholder border-white">
                  <div className="w-8 bg-neutral text-neutral-content">
                    <span className="text-xs">+99</span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold">
                <span className="block text-primary">Teknisi Siaga</span>
                <span className="text-gray-400">Siap membantu 24 Jam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-base-200/30 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Cara Melaporkan Gangguan</h2>
            <p className="text-gray-500">Kami menyederhanakan proses pelaporan agar Anda bisa segera kembali online.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-base-200 via-primary/30 to-base-200 border-t border-dashed border-gray-300"></div>

            {[
              {
                icon: AlertCircle,
                title: "1. Login & Identifikasi",
                desc: "Masuk ke dashboard dan pilih jenis kendala yang Anda alami dari menu pelaporan."
              },
              {
                icon: Activity,
                title: "2. Diagnosa Otomatis",
                desc: "Sistem kami akan melakukan pengecekan awal pada jalur koneksi ke rumah Anda."
              },
              {
                icon: CheckCircle2,
                title: "3. Solusi & Tracking",
                desc: "Dapatkan solusi instan atau pantau pergerakan teknisi jika kunjungan diperlukan."
              }
            ].map((step, i) => (
              <div key={i} className="relative group text-center bg-base-100 p-8 rounded-3xl border border-base-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 z-10">
                <div className="w-16 h-16 rounded-2xl bg-base-200/50 border border-base-200 group-hover:bg-primary group-hover:border-primary group-hover:text-white flex items-center justify-center text-base-content/60 mx-auto mb-6 transition-all duration-300 shadow-inner">
                  <step.icon size={28} />
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-base-content/70 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}