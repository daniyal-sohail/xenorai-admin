"use client";

import { FC, useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface ScriptModalProps {
    isOpen: boolean;
    script: string | null;
    domainName: string;
    onClose: () => void;
}

export const ScriptModal: FC<ScriptModalProps> = ({
    isOpen,
    script,
    domainName,
    onClose,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!script) return;
        await navigator.clipboard.writeText(script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen || !script) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Installation Script</h2>
                        <p className="text-indigo-100 text-sm mt-1">{domainName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Instructions */}
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2">How to Install</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Copy the script below</li>
                        <li>Paste it in your website's HTML, just before the closing {`</body>`} tag</li>
                        <li>The chatbot will appear on the bottom-right corner of your website</li>
                    </ol>
                </div>

                {/* Script Display */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            <code>{script}</code>
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="absolute top-3 right-3 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium shadow-sm"
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    Copy Script
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};