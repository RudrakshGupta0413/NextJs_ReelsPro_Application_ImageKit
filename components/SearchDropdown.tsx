"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface SearchUser {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
    verified?: boolean;
}

interface HashtagResult {
    tag: string;
    count: number;
}

const RECENT_SEARCHES_KEY = "recentSearches";
const RECENT_HASHTAGS_KEY = "recentHashtags";
const MAX_RECENT = 5;

function getRecentSearches(): SearchUser[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveRecentSearch(user: SearchUser) {
    const recent = getRecentSearches().filter((u) => u._id !== user._id);
    recent.unshift(user);
    localStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(recent.slice(0, MAX_RECENT))
    );
}

function getRecentHashtags(): string[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(RECENT_HASHTAGS_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveRecentHashtag(tag: string) {
    const recent = getRecentHashtags().filter((t) => t !== tag);
    recent.unshift(tag);
    localStorage.setItem(
        RECENT_HASHTAGS_KEY,
        JSON.stringify(recent.slice(0, MAX_RECENT))
    );
}

function clearRecentSearches() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    localStorage.removeItem(RECENT_HASHTAGS_KEY);
}

interface SearchDropdownProps {
    className?: string;
    autoFocus?: boolean;
}

export default function SearchDropdown({ className, autoFocus }: SearchDropdownProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [hashtagResults, setHashtagResults] = useState<HashtagResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<SearchUser[]>([]);
    const [recentHashtags, setRecentHashtags] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    // Load recent searches on mount
    useEffect(() => {
        setRecentSearches(getRecentSearches());
        setRecentHashtags(getRecentHashtags());
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Debounced search
    const searchUsers = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            setHashtagResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Hashtag search mode
        if (q.startsWith("#")) {
            try {
                const tag = q.slice(1).trim();
                if (!tag) {
                    setHashtagResults([]);
                    setLoading(false);
                    return;
                }
                const res = await fetch(`/api/hashtags/trending`);
                if (res.ok) {
                    const allTags: HashtagResult[] = await res.json();
                    const filtered = allTags.filter((t) =>
                        t.tag.toLowerCase().includes(tag.toLowerCase())
                    );
                    setHashtagResults(filtered);
                    setResults([]);
                }
            } catch (err) {
                console.error("Hashtag search failed:", err);
            } finally {
                setLoading(false);
            }
            return;
        }

        // User search mode
        try {
            const res = await fetch(
                `/api/user/search?q=${encodeURIComponent(q.trim())}`
            );
            if (res.ok) {
                setResults(await res.json());
                setHashtagResults([]);
            }
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInputChange = (val: string) => {
        setQuery(val);
        setIsOpen(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchUsers(val), 300);
    };

    const handleSelectUser = (user: SearchUser) => {
        saveRecentSearch(user);
        setRecentSearches(getRecentSearches());
        setQuery("");
        setResults([]);
        setIsOpen(false);
        router.push(`/user/${user._id}`);
    };

    const handleClearRecent = () => {
        clearRecentSearches();
        setRecentSearches([]);
        setRecentHashtags([]);
    };

    const handleFocus = () => {
        setIsOpen(true);
        setRecentSearches(getRecentSearches());
        setRecentHashtags(getRecentHashtags());
    };

    const showRecent = isOpen && !query.trim() && (recentSearches.length > 0 || recentHashtags.length > 0);
    const showResults = isOpen && query.trim().length > 0;

    return (
        <div ref={containerRef} className={`relative ${className || ""}`}>
            {/* Search Input */}
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                    placeholder="Search users or #hashtags..."
                    className="pl-10 pr-8 bg-muted/50 border-input focus:border-primary"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={handleFocus}
                    autoFocus={autoFocus}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {(showRecent || showResults) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-[360px] overflow-y-auto">
                    {/* Recent Searches Header & Lists */}
                    {showRecent && (
                        <div>
                            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Recent Searches
                                </span>
                                <button
                                    onClick={handleClearRecent}
                                    className="text-xs text-primary hover:underline font-medium cursor-pointer"
                                >
                                    Clear all
                                </button>
                            </div>
                            
                            {/* Recent People */}
                            {recentSearches.length > 0 && recentSearches.map((user) => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                                    onClick={() => handleSelectUser(user)}
                                />
                            ))}

                            {/* Recent Hashtags */}
                            {recentHashtags.length > 0 && (
                                <div className="border-t border-border/5">
                                    {recentHashtags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => {
                                                saveRecentHashtag(tag);
                                                setRecentHashtags(getRecentHashtags());
                                                setQuery("");
                                                setIsOpen(false);
                                                router.push(`/explore/hashtag/${encodeURIComponent(tag)}`);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-muted/60 transition-colors text-left cursor-pointer"
                                        >
                                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0 border border-blue-500/10">
                                                <Hash className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className="text-sm font-semibold text-foreground">#{tag}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    {/* Live Results */}
                    {showResults && (
                        <div>
                            {loading ? (
                                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                    Searching...
                                </div>
                            ) : hashtagResults.length > 0 ? (
                                hashtagResults.map((ht) => (
                                    <button
                                        key={ht.tag}
                                        onClick={() => {
                                            saveRecentHashtag(ht.tag);
                                            setRecentHashtags(getRecentHashtags());
                                            setQuery("");
                                            setHashtagResults([]);
                                            setIsOpen(false);
                                            router.push(`/explore/hashtag/${encodeURIComponent(ht.tag)}`);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted/60 transition-colors text-left cursor-pointer"
                                    >
                                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                            <Hash className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-sm font-semibold text-foreground">#{ht.tag}</span>
                                            <p className="text-xs text-muted-foreground">{ht.count} posts</p>
                                        </div>
                                    </button>
                                ))
                            ) : results.length > 0 ? (
                                results.map((user) => (
                                    <UserRow
                                        key={user._id}
                                        user={user}
                                        onClick={() => handleSelectUser(user)}
                                    />
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                    No results found for &ldquo;{query}&rdquo;
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ── Shared User Row ── */
function UserRow({
    user,
    icon,
    onClick,
}: {
    user: SearchUser;
    icon?: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted/60 transition-colors text-left cursor-pointer"
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <Avatar className="h-9 w-9 shrink-0">
                <img
                    src={user.profilePicture || "/default-avatar.jpg"}
                    alt={user.name}
                    className="rounded-full object-cover"
                />
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                    </span>
                    {user.verified && (
                        <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white text-[8px]">✓</span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                    @{user.username}
                </p>
            </div>
        </button>
    );
}
