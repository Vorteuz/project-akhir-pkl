"use client";

import { useFormStatus } from "react-dom";
import { createTicket } from "@/app/actions";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button className="btn btn-primary w-full" disabled={pending}>
            {pending ? "Mengirim..." : "Kirim Laporan"}
        </button>
    );
}

export default function TicketForm({ user }) {
    const [msg, setMsg] = useState(null);

    async function clientAction(prevState, formData) {
        const res = await createTicket(prevState, formData);
        if (res.success) {
            setMsg("Laporan berhasil dikirim! Status tiket: OPEN");
            // Optional: Reset form or close modal
            document.getElementById("ticket_form").reset();
        } else {
            setMsg("Gagal: " + res.message);
        }
    }

    // useActionState in Next.js 15 / React 19, but for 14 it is useFormState.
    // Assuming Next.js 15 based on 'next' version 16 in package.json (likely 15.1).
    // React 19 creates 'useActionState'. If not available, use 'useFormState' (react-dom).
    // Let's stick to simple form action for now to be safe.

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <h3 className="card-title">Lapor Gangguan</h3>
                <form action={async (formData) => {
                    const res = await createTicket(null, formData);
                    if (res.success) setMsg("Laporan berhasil dikirim!");
                    else setMsg("Gagal: " + res.message);
                }} id="ticket_form" className="space-y-4">

                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="daerah" value={user.daerah} />

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Jenis Gangguan</span>
                        </label>
                        <select name="jenisGangguan" className="select select-bordered" required defaultValue="">
                            <option value="" disabled>Pilih Kendala</option>
                            <option value="Internet Mati Total">Internet Mati Total</option>
                            <option value="Koneksi Lambat">Koneksi Lambat</option>
                            <option value="Putus-Putus (RTO)">Putus-Putus (RTO)</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Detail Keluhan</span>
                        </label>
                        <textarea
                            name="pesan"
                            className="textarea textarea-bordered h-24"
                            placeholder="Contoh: Lampu modem merah..."
                            required
                        ></textarea>
                    </div>

                    {msg && <div className="alert alert-info text-sm py-2">{msg}</div>}

                    <div className="form-control mt-4">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
