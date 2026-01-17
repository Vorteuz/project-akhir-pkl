'use server'

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createUser(prevState, formData) {
    try {
        await dbConnect();

        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');
        const daerah = formData.get('daerah');
        const paket = formData.get('paket');

        if (!name || !email || !password) {
            return { success: false, message: 'Semua field wajib diisi' };
        }

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'Email sudah terdaftar' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            daerah: daerah || '-',
            paket: paket || 'Home Basic 20Mbps'
        });

        revalidatePath('/admin/users');
        return { success: true, message: 'User berhasil ditambahkan' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Gagal menambahkan user: ' + e.message };
    }
}

export async function updateUser(userId, formData) {
    try {
        await dbConnect();

        const name = formData.get('name');
        const email = formData.get('email');
        const role = formData.get('role');
        const daerah = formData.get('daerah');
        const paket = formData.get('paket');
        const password = formData.get('password');

        const updateData = {
            name,
            email,
            role,
            daerah,
            paket
        };

        // Only update password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(userId, updateData);

        revalidatePath('/admin/users');
        return { success: true, message: 'User berhasil diupdate' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Gagal mengupdate user: ' + e.message };
    }
}

export async function deleteUser(userId) {
    try {
        await dbConnect();
        await User.findByIdAndDelete(userId);
        revalidatePath('/admin/users');
        return { success: true, message: 'User berhasil dihapus' };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Gagal menghapus user: ' + e.message };
    }
}

export async function searchUsers(query) {
    try {
        await dbConnect();

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { daerah: { $regex: query, $options: 'i' } }
            ]
        }).select('-password').sort({ createdAt: -1 });

        return { success: true, users: JSON.parse(JSON.stringify(users)) };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Gagal mencari user: ' + e.message };
    }
}
