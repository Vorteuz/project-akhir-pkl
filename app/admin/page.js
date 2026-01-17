import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import AdminStats from "@/components/AdminStats";
import DownloadReportButton from "@/components/DownloadReportButton";
import DarkModeToggle from "@/components/DarkModeToggle";
import { redirect } from "next/navigation";
import { LayoutDashboard, Ticket as TicketIcon, Users, Settings, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        redirect("/login");
    }

    await dbConnect();

    const tickets = await Ticket.find({});
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED').length;

    const regionMap = tickets.reduce((acc, t) => {
        acc[t.daerah] = (acc[t.daerah] || 0) + 1;
        return acc;
    }, {});
    const byRegion = Object.keys(regionMap).map(k => ({ name: k, value: regionMap[k] }));

    const typeMap = tickets.reduce((acc, t) => {
        acc[t.jenisGangguan] = (acc[t.jenisGangguan] || 0) + 1;
        return acc;
    }, {});
    const byType = Object.keys(typeMap).map(k => ({ name: k, value: typeMap[k] }));

    const dateMap = tickets.reduce((acc, t) => {
        const date = t.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const daily = Object.keys(dateMap).sort().map(k => ({ date: k, count: dateMap[k] }));

    return (
        <div className="min-h-screen bg-base-200/50 flex flex-col md:flex-row font-sans">

            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 bg-base-100 border-r border-base-200 flex flex-col h-auto md:h-screen sticky top-0">
                <div className="p-6 border-b border-base-200">
                    <div className="text-xl font-black text-primary tracking-tighter">ISP<span className="text-base-content">ADMIN</span></div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold transition-colors">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-gray-600 hover:text-base-content rounded-xl font-medium transition-colors">
                        <TicketIcon size={20} /> Tiket Masuk
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-gray-600 hover:text-base-content rounded-xl font-medium transition-colors">
                        <Users size={20} /> Users
                    </Link>
                </nav>
                <div className="p-4 border-t border-base-200">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-xs">A</span>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">Administrator</div>
                            <div className="text-xs text-gray-400 truncate">admin@isp.test</div>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-base-content">Dashboard Overview</h1>
                            <p className="text-gray-500 mt-1">Pantau kinerja jaringan dan laporan pelanggan secara realtime.</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <DarkModeToggle />
                            <DownloadReportButton
                                stats={{ total, open, resolved, byRegion, byType, daily }}
                                tickets={JSON.parse(JSON.stringify(tickets))}
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <TicketIcon size={24} />
                                </div>
                                <span className="badge badge-ghost text-xs font-bold">+2.5%</span>
                            </div>
                            <div className="text-4xl font-bold mb-1">{total}</div>
                            <div className="text-sm text-gray-500 font-medium">Total Laporan</div>
                        </div>

                        <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                    <Activity size={24} />
                                </div>
                                <span className="badge badge-error badge-outline text-xs font-bold">{open} Active</span>
                            </div>
                            <div className="text-4xl font-bold mb-1">{open}</div>
                            <div className="text-sm text-gray-500 font-medium">Perlu Penanganan</div>
                        </div>

                        <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <CheckCircle size={24} />
                                </div>
                                <span className="badge badge-success badge-outline text-xs font-bold">Good Job!</span>
                            </div>
                            <div className="text-4xl font-bold mb-1">{resolved}</div>
                            <div className="text-sm text-gray-500 font-medium">Masalah Teratasi</div>
                        </div>
                    </div>

                    {/* Analytics Charts */}
                    <div className="grid gap-6">
                        <AdminStats data={{ byRegion, byType, daily }} />
                    </div>

                </div>
            </main>
        </div>
    );
}

// Helper icons
import { Activity, CheckCircle } from "lucide-react";
