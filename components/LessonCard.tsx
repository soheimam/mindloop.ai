"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Language } from "@11labs/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";

interface LessonCardProps {
    id: string;
    topic: string;
    language: string;
    username: string;
    difficulty: number;
    reward?: {
        amount: number;
        currency: string;
    };
    sourceUrl?: string;
}

export const LessonCard = ({ id, topic, username, language, difficulty, reward, sourceUrl }: LessonCardProps) => {
    const router = useRouter();
    const { address } = useAccount();
    const { connect, send, isConnected } = useWebSocket(address as `0x${string}`, id);
    const [isLoading, setIsLoading] = useState(false);

    const getDifficultyColor = (level: number) => {
        if (level <= 2) return "bg-green-100 text-green-800";
        if (level <= 4) return "bg-blue-100 text-blue-800";
        if (level <= 6) return "bg-yellow-100 text-yellow-800";
        if (level <= 8) return "bg-orange-100 text-orange-800";
        return "bg-red-100 text-red-800";
    };

    const getDifficultyLabel = (level: number) => {
        if (level <= 2) return "Beginner";
        if (level <= 4) return "Easy";
        if (level <= 6) return "Intermediate";
        if (level <= 8) return "Advanced";
        return "Expert";
    };

    const getLanguageIcon = (lang: string) => {
        const lowerLang = lang.toLowerCase();
        if (lowerLang === "en") return "🇬🇧";
        if (lowerLang === "nl") return "🇳🇱";
        if (lowerLang === "de") return "🇩🇪";
        if (lowerLang === "es") return "🇪🇸";
        if (lowerLang === "fr") return "🇫🇷";
        if (lowerLang === "it") return "🇮🇹";
        if (lowerLang === "pt") return "🇵🇹";
        if (lowerLang === "ru") return "🇷🇺";
        if (lowerLang === "ja") return "🇯🇵";
        if (lowerLang === "zh") return "🇨🇳";
        if (lowerLang === "ko") return "🇰🇷";
        if (lowerLang === "ar") return "🇸🇦";
        if (lowerLang === "hi") return "🇮🇳";
        if (lowerLang === "tr") return "🇹🇷";
        if (lowerLang === "pl") return "🇵🇱";
        return "🌍"; // World globe as fallback
    };

    const handleCardClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (!isConnected) {
                connect();
                if (!isConnected) {
                    throw new Error("Failed to establish connection");
                }
            }

            send({
                user_id: address as string,
                name: username || address as string,
                id,
                url: sourceUrl || "",
                language: language.toLowerCase() as Language,
                difficulty,
            });

            router.push(`/lesson/${id}`);
        } catch (error) {
            console.error('Error preparing lesson:', error);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`cursor-pointer h-full ${isLoading ? 'opacity-70' : ''}`}
            onClick={handleCardClick}
        >
            <Card className="bg-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden h-full transition-shadow hover:shadow-md">
                <div className="h-3 bg-purple-600 w-full"></div>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-start">
                        <div className="flex-grow pr-3">
                            <h3 className="text-xl font-bold text-purple-900 leading-tight line-clamp-2">{topic}</h3>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0 mt-0.5">
                            {sourceUrl && (
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-center p-1 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                    aria-label="View source"
                                    title="View source"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" />
                                    </svg>
                                </a>
                            )}
                            <span className="text-2xl flex items-center justify-center" role="img" aria-label={language}>
                                {getLanguageIcon(language)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                            {getDifficultyLabel(difficulty)} ({difficulty}/10)
                        </span>
                        {reward && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {reward.amount} {reward.currency} reward
                            </span>
                        )}
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center mt-2">
                            <div className="flex space-x-1">
                                <div className="h-1.5 w-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="h-1.5 w-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="h-1.5 w-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}; 