"use client";

import { useState } from "react";
import { createUser, updateUser, deleteUser } from "@/app/admin/users/actions";
import { Search, UserPlus, Edit2, Trash2, X, Mail, MapPin, Package, Shield } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function UserManagement({ initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState(null);

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.daerah.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let result;
        if (editingUser) {
            result = await updateUser(editingUser._id, formData);
        } else {
            result = await createUser(null, formData);
        }

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setIsModalOpen(false);
            setEditingUser(null);
            e.target.reset();
            // Refresh page to get updated data
            window.location.reload();
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Yakin ingin menghapus user ini?')) return;

        const result = await deleteUser(userId);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            window.location.reload();
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau daerah..."
                        className="input input-bordered w-full pl-10 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary rounded-xl gap-2 shadow-lg shadow-primary/20"
                >
                    <UserPlus size={18} />
                    Tambah User Baru
                </button>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)} className="btn btn-sm btn-ghost">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Users Table */}
            <div className="card bg-base-100 shadow-sm border border-base-200 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-base-200">
                            <tr>
                                <th className="font-bold">User Info</th>
                                <th className="font-bold">Lokasi & Paket</th>
                                <th className="font-bold">Terdaftar</th>
                                <th className="font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">
                                        Tidak ada user ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-base-50">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary/10 text-primary rounded-full w-10">
                                                        <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <MapPin size={12} />
                                                    {user.daerah}
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                    <Package size={12} />
                                                    {user.paket}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-sm text-gray-500">
                                            {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy", { locale: id }) : '-'}
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="btn btn-ghost btn-sm btn-square text-primary hover:bg-primary/10"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl rounded-3xl">
                        <h3 className="font-bold text-xl mb-6">
                            {editingUser ? 'Edit User' : 'Tambah User Baru'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Nama Lengkap</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input input-bordered rounded-xl"
                                        defaultValue={editingUser?.name}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input input-bordered rounded-xl"
                                        defaultValue={editingUser?.email}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Password {editingUser && '(kosongkan jika tidak diubah)'}</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="input input-bordered rounded-xl"
                                        required={!editingUser}
                                    />
                                </div>

                                {/* Hidden role field - always set to 'user' */}
                                <input type="hidden" name="role" value="user" />

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Daerah</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="daerah"
                                        className="input input-bordered rounded-xl"
                                        defaultValue={editingUser?.daerah}
                                        placeholder="Jakarta Selatan"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Paket</span>
                                    </label>
                                    <select
                                        name="paket"
                                        className="select select-bordered rounded-xl"
                                        defaultValue={editingUser?.paket || 'Home Basic 20Mbps'}
                                    >
                                        <option value="Home Basic 20Mbps">Home Basic 20Mbps</option>
                                        <option value="Home Pro 50Mbps">Home Pro 50Mbps</option>
                                        <option value="Gamer Pro 100Mbps">Gamer Pro 100Mbps</option>
                                        <option value="Business 200Mbps">Business 200Mbps</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-action">
                                <button type="button" onClick={closeModal} className="btn btn-ghost rounded-xl">
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary rounded-xl">
                                    {editingUser ? 'Update User' : 'Tambah User'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </div>
    );
}
