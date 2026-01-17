"use client";

import { updateTicketStatus } from "@/app/actions";
import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminTicketTable({ tickets }) {
    const [filter, setFilter] = useState("ALL");

    const filteredTickets = filter === "ALL"
        ? tickets
        : tickets.filter(t => t.status === filter);

    const handleUpdate = async (ticketId, newStatus) => {
        await updateTicketStatus(ticketId, newStatus);
        // Optimistic update handled by Next.js revalidatePath but for smoother UX we could use local state or useOptimistic
        // For now, revalidatePath is fast enough usually.
    };

    const statusColors = {
        OPEN: "text-error",
        ON_PROGRESS: "text-warning",
        RESOLVED: "text-success"
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title">Manajemen Tiket</h3>
                    <select
                        className="select select-bordered select-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="OPEN">Open</option>
                        <option value="ON_PROGRESS">On Progress</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Detail Tiket</th>
                                <th>User / Daerah</th>
                                <th>Gangguan</th>
                                <th>Status (Update)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((t) => (
                                <tr key={t._id}>
                                    <td>
                                        <div className="font-bold">{t.ticketId}</div>
                                        <div className="text-xs text-gray-500">
                                            {format(new Date(t.createdAt), "dd MMM HH:mm", { locale: id })}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold text-xs">{t.userId?.name || "Unknown"}</div>
                                        <div className="text-xs">{t.daerah}</div>
                                    </td>
                                    <td>
                                        <div className="badge badge-outline badge-sm">{t.jenisGangguan}</div>
                                        <div className="text-xs mt-1 truncate max-w-xs" title={t.pesan}>
                                            {t.pesan}
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            className={`select select-bordered select-xs w-full max-w-xs font-bold ${statusColors[t.status]}`}
                                            value={t.status}
                                            onChange={(e) => handleUpdate(t.ticketId, e.target.value)}
                                        >
                                            <option value="OPEN" className="text-error">OPEN</option>
                                            <option value="ON_PROGRESS" className="text-warning">ON PROGRESS</option>
                                            <option value="RESOLVED" className="text-success">RESOLVED</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTickets.length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">Tidak ada tiket.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
