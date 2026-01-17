import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import AdminTicketTable from "@/components/AdminTicketTable";
import DarkModeToggle from "@/components/DarkModeToggle";
import { redirect } from "next/navigation";
import { LayoutDashboard, Ticket as TicketIcon, Users, Settings, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        redirect("/login");
    }

    await dbConnect();

    // Need to populate userId if we use it, but since we didn't export User model as 'User' string ref in Ticket model ...
    // Wait, Ticket model has ref: 'User'. So populate('userId') works if User model is registered.
    // It is registered in User.js.
    // We need to ensure models are compiled.

    const tickets = await Ticket.find({}).populate('userId', 'name').sort({ createdAt: -1 });

    return (
        <div className="min-h-screen bg-base-200/50 flex flex-col md:flex-row font-sans">

            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 bg-base-100 border-r border-base-200 flex flex-col h-auto md:h-screen sticky top-0">
                <div className="p-6 border-b border-base-200">
                    <div className="text-xl font-black text-primary tracking-tighter">ISP<span className="text-base-content">ADMIN</span></div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-gray-600 hover:text-base-content rounded-xl font-medium transition-colors">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold transition-colors">
                        <TicketIcon size={20} /> Tiket Masuk
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 text-gray-600 hover:text-base-content rounded-xl font-medium transition-colors">
                        <Users size={20} /> Users
                    </Link>
                </nav>
                <div className="p-4 border-t border-base-200">
                    <LogoutButton />
                </div>
            </aside>

            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-2">
                                <ArrowLeft size={16} /> Kembali ke Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold">Semua Laporan Masuk</h1>
                        </div>
                        <DarkModeToggle />
                    </div>

                    <AdminTicketTable tickets={JSON.parse(JSON.stringify(tickets))} />
                </div>
            </div>
        </div>
    );
}
