"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function TicketList({ tickets }) {
    if (!tickets || tickets.length === 0) {
        return <div className="alert alert-ghost">Belum ada riwayat tiket.</div>;
    }

    const getBadge = (status) => {
        switch (status) {
            case "OPEN": return "badge-error";
            case "ON_PROGRESS": return "badge-warning";
            case "RESOLVED": return "badge-success";
            default: return "badge-ghost";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tanggal</th>
                        <th>Gangguan</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((t) => (
                        <tr key={t._id}>
                            <td className="font-mono text-xs">{t.ticketId}</td>
                            <td className="text-sm">
                                {t.createdAt ? format(new Date(t.createdAt), "dd MMM yyyy, HH:mm", { locale: id }) : "-"}
                            </td>
                            <td>{t.jenisGangguan}</td>
                            <td>
                                <span className={`badge ${getBadge(t.status)} gap-2`}>
                                    {t.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
