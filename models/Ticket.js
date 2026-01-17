import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    daerah: {
        type: String,
        required: true,
    },
    jenisGangguan: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['OPEN', 'ON_PROGRESS', 'RESOLVED'],
        default: 'OPEN',
    },
    pesan: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
