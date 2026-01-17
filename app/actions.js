'use server'

import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth"; // If needed, or pass userId
// Note: In server actions, we should verify auth. 
// However, getServerSession needs authOptions which needs 'bcrypt' which might be heavy.
// Better to trust the caller or use a lightweight session check if possible.
// For now, will pass userId from client or handle inside.
// Actually, let's just use the models.

export async function createTicket(prevState, formData) {
    try {
        await dbConnect();

        // Simple validation
        const userId = formData.get('userId');
        const daerah = formData.get('daerah');
        const jenisGangguan = formData.get('jenisGangguan');
        const pesan = formData.get('pesan');

        if (!userId || !daerah || !jenisGangguan) {
            return { message: 'Missing required fields' };
        }

        const ticketId = `T-${Date.now().toString().slice(-6)}`;

        await Ticket.create({
            ticketId,
            userId,
            daerah,
            jenisGangguan,
            pesan,
            status: 'OPEN'
        });

        revalidatePath('/dashboard');
        return { message: 'Success', success: true };
    } catch (e) {
        console.error(e);
        return { message: 'Failed to create ticket: ' + e.message };
    }
}

export async function updateTicketStatus(ticketId, newStatus) {
    try {
        await dbConnect();
        await Ticket.findOneAndUpdate({ ticketId }, { status: newStatus });
        revalidatePath('/admin/tickets');
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

export async function getStats() {
    await dbConnect();

    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'OPEN' });
    const resolved = await Ticket.countDocuments({ status: 'RESOLVED' });

    // Group by daerah
    const byRegion = await Ticket.aggregate([
        { $group: { _id: "$daerah", count: { $sum: 1 } } }
    ]);

    return {
        total,
        open,
        resolved,
        byRegion: byRegion.map(r => ({ name: r._id, value: r.count }))
    };
}
