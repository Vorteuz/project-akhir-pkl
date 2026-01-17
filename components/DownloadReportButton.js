"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DownloadReportButton({ stats, tickets }) {
    const handleDownload = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("ISP Portal - Laporan Gangguan", 14, 20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Tanggal: ${format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })}`, 14, 28);

        // Summary Stats
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Ringkasan Statistik", 14, 40);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Laporan: ${stats.total}`, 14, 48);
        doc.text(`Status Open: ${stats.open}`, 14, 54);
        doc.text(`Status Resolved: ${stats.resolved}`, 14, 60);
        doc.text(`On Progress: ${stats.total - stats.open - stats.resolved}`, 14, 66);

        // Laporan per Daerah
        if (stats.byRegion && stats.byRegion.length > 0) {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Laporan per Daerah", 14, 78);

            const regionData = stats.byRegion.map(r => [r.name, r.value]);

            autoTable(doc, {
                startY: 82,
                head: [['Daerah', 'Jumlah Laporan']],
                body: regionData,
                theme: 'grid',
                headStyles: { fillColor: [66, 135, 245] },
                margin: { left: 14 }
            });
        }

        // Laporan per Jenis Gangguan
        if (stats.byType && stats.byType.length > 0) {
            const finalY = doc.lastAutoTable?.finalY || 100;

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Laporan per Jenis Gangguan", 14, finalY + 10);

            const typeData = stats.byType.map(t => [t.name, t.value]);

            autoTable(doc, {
                startY: finalY + 14,
                head: [['Jenis Gangguan', 'Jumlah']],
                body: typeData,
                theme: 'grid',
                headStyles: { fillColor: [66, 135, 245] },
                margin: { left: 14 }
            });
        }

        // Detail Tiket (New Page)
        if (tickets && tickets.length > 0) {
            doc.addPage();

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Detail Semua Tiket", 14, 20);

            const ticketData = tickets.slice(0, 50).map(t => [
                t.ticketId,
                t.daerah,
                t.jenisGangguan,
                t.status,
                format(new Date(t.createdAt), "dd/MM/yy", { locale: id })
            ]);

            autoTable(doc, {
                startY: 26,
                head: [['ID Tiket', 'Daerah', 'Gangguan', 'Status', 'Tanggal']],
                body: ticketData,
                theme: 'striped',
                headStyles: { fillColor: [66, 135, 245] },
                styles: { fontSize: 8 },
                margin: { left: 14, right: 14 }
            });
        }

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont("helvetica", "italic");
            doc.text(
                `Halaman ${i} dari ${pageCount} - ISP Portal © ${new Date().getFullYear()}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Save
        doc.save(`Laporan-Gangguan-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`);
    };

    return (
        <button
            onClick={handleDownload}
            className="btn btn-primary btn-sm rounded-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
            <Download size={16} />
            Download Report
        </button>
    );
}
