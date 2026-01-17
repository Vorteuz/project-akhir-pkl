import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import TicketForm from "@/components/TicketForm";
import TicketList from "@/components/TicketList";
import LogoutButton from "@/components/LogoutButton";
import ChatWidget from "@/components/ChatWidget";
import DarkModeToggle from "@/components/DarkModeToggle";
import { redirect } from "next/navigation";
import { User as UserIcon, MapPin, Package, Bell, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role === 'admin') {
        redirect("/admin");
    }

    await dbConnect();
    const tickets = await Ticket.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return (
        <div className="min-h-screen bg-base-200/50">
            {/* Top Navigation */}
            <nav className="bg-base-100 border-b border-base-200 px-6 py-4 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="font-black text-xl tracking-tight text-primary">ISP<span className="text-base-content">PORTAL</span></div>
                    <div className="flex items-center gap-4">
                        <DarkModeToggle />
                        <button className="btn btn-ghost btn-circle btn-sm text-gray-500">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-base-200">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold leading-tight">{session.user.name}</div>
                                <div className="text-xs text-gray-400">{session.user.email}</div>
                            </div>
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-10">
                                    <span className="text-sm uppercase">{session.user.name.charAt(0)}</span>
                                </div>
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Area (Left) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="card bg-base-100 shadow-sm border border-base-200 rounded-3xl overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
                            <div className="card-body p-6 pt-0 relative">
                                <div className="avatar absolute -top-12">
                                    <div className="w-24 rounded-2xl border-4 border-base-100 bg-white shadow-md">
                                        <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${session.user.email}&backgroundColor=c0aede`} alt="Avatar" />
                                    </div>
                                </div>
                                <div className="mt-14 mb-4">
                                    <h2 className="text-xl font-bold">{session.user.name}</h2>
                                    <div className="badge badge-success badge-sm gap-1 mt-1 font-semibold text-white">Active</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                        <MapPin size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">Lokasi</div>
                                            <div className="text-sm font-semibold">{session.user.daerah}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                        <Package size={18} className="text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase">Paket Aktif</div>
                                            <div className="text-sm font-semibold">{session.user.paket}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card bg-primary text-primary-content shadow-lg shadow-primary/20 rounded-3xl">
                            <div className="card-body p-6">
                                <h3 className="card-title text-lg mb-2">Butuh Bantuan?</h3>
                                <p className="text-sm opacity-90 mb-4">Tim teknis kami siap membantu menyelesaikan kendala jaringan Anda.</p>
                                <button className="btn btn-white text-primary border-none hover:bg-gray-100 w-full rounded-xl">
                                    Hubungi CS
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area (Right) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <h1 className="text-2xl font-bold mb-6">Layanan Pelanggan</h1>
                            <TicketForm user={session.user} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Riwayat Laporan</h3>
                                <button className="btn btn-sm btn-ghost">Lihat Semua</button>
                            </div>
                            <div className="card bg-base-100 shadow-sm border border-base-200 rounded-3xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <TicketList tickets={JSON.parse(JSON.stringify(tickets))} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ChatWidget />
        </div>
    );
}
