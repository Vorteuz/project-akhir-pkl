"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, X } from "lucide-react";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Halo! Ada yang bisa kami bantu seputar koneksi WiFi Anda?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMsg = { id: Date.now(), text: input, sender: "user" };
        setMessages(prev => [...prev, newMsg]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            let botResponse = "Terima kasih. Laporan Anda kami catat. Mohon buat tiket jika kendala berlanjut.";
            if (input.toLowerCase().includes("lemot") || input.toLowerCase().includes("lambat")) {
                botResponse = "Untuk koneksi lambat, silakan coba restart modem Anda selama 5 menit.";
            } else if (input.toLowerCase().includes("mati") || input.toLowerCase().includes("merah")) {
                botResponse = "Jika lampu LOS merah berkedip, kemungkinan ada gangguan kabel putus di area Anda.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className="fixed bottom-6 right-6 btn btn-circle btn-primary btn-lg shadow-lg z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <MessageSquare />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-base-100 shadow-2xl rounded-xl z-50 flex flex-col border border-base-300">
                    <div className="bg-primary text-primary-content p-3 rounded-t-xl font-bold flex justify-between items-center">
                        <span>Live Chat Support</span>
                        <span className="text-xs font-normal opacity-80">Online</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200">
                        {messages.map((m) => (
                            <div key={m.id} className={`chat ${m.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
                                <div className={`chat-bubble text-sm ${m.sender === 'user' ? 'chat-bubble-primary' : 'bg-white text-black'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-base-100 border-t flex gap-2">
                        <input
                            type="text"
                            className="input input-sm input-bordered w-full"
                            placeholder="Tulis pesan..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="btn btn-sm btn-square btn-primary" onClick={handleSend}>
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
