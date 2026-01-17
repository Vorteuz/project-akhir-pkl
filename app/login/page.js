"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Wifi } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Email atau password tidak ditemukan.");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8 animate-fade-in-up">
                    <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-content rounded-xl mb-4 shadow-lg shadow-primary/30">
                        <Wifi size={24} />
                    </Link>
                    <h2 className="text-2xl font-bold">Selamat Datang Kembali</h2>
                    <p className="text-gray-500 text-sm mt-1">Masuk untuk mengelola layanan internet Anda</p>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-200 rounded-3xl overflow-hidden">
                    <div className="card-body p-8 pt-10">

                        {error && (
                            <div role="alert" className="alert alert-error text-xs py-2 rounded-xl mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold pl-1">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="input input-lg input-bordered w-full rounded-2xl text-sm bg-base-200/30 focus:bg-base-100 transition-all border-base-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold pl-1">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input input-lg input-bordered w-full rounded-2xl text-sm bg-base-200/30 focus:bg-base-100 transition-all border-base-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="text-right mt-2">
                                    <span className="text-xs text-gray-400 hover:text-primary cursor-pointer font-medium transition-colors">
                                        Lupa password?
                                    </span>
                                </div>
                            </div>

                            <button className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/25 text-white mt-4" disabled={loading}>
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Masuk ke Akun"}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}
