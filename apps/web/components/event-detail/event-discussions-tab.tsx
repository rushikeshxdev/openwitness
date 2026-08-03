"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import {
  getDiscussionsForEvent,
  type DiscussionThread,
} from "@/data/event-discussions-data";
import type { EventDetailViewModel } from "@/data/event-detail-data";
import { Heart, MessageCircle, Send } from "lucide-react";

export function EventDiscussionsTab({
  detail,
}: {
  detail: EventDetailViewModel;
}) {
  const initial = useMemo(
    () =>
      getDiscussionsForEvent(
        detail.id,
        detail.title,
        detail.discussionCount
      ),
    [detail.id, detail.title, detail.discussionCount]
  );

  const [threads, setThreads] = useState<DiscussionThread[]>(initial);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const postThread = () => {
    const body = draft.trim();
    if (!body) return;
    const next: DiscussionThread = {
      id: `local-${Date.now()}`,
      author: "You",
      initials: "YO",
      accent: "#3B82F6",
      body,
      timeLabel: "Just now",
      likeCount: 0,
      replyCount: 0,
      replies: [],
    };
    setThreads((t) => [next, ...t]);
    setDraft("");
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const on = !prev[id];
      return { ...prev, [id]: on };
    });
    setThreads((list) =>
      list.map((t) => {
        if (t.id !== id) return t;
        const willLike = !liked[id];
        return {
          ...t,
          likeCount: Math.max(0, t.likeCount + (willLike ? 1 : -1)),
        };
      })
    );
  };

  const postReply = (threadId: string) => {
    const body = (replyDrafts[threadId] ?? "").trim();
    if (!body) return;
    setThreads((list) =>
      list.map((t) => {
        if (t.id !== threadId) return t;
        const reply = {
          id: `reply-${Date.now()}`,
          author: "You",
          initials: "YO",
          accent: "#3B82F6",
          body,
          timeLabel: "Just now",
        };
        return {
          ...t,
          replyCount: t.replyCount + 1,
          replies: [...(t.replies ?? []), reply],
        };
      })
    );
    setReplyDrafts((d) => ({ ...d, [threadId]: "" }));
    setExpanded((e) => ({ ...e, [threadId]: true }));
    setReplyingTo(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Discussions</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Community conversation around {detail.title}
          {detail.discussionCount
            ? ` · ${detail.discussionCount.toLocaleString()} total`
            : ""}
        </p>
      </div>

      <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
        <label htmlFor="discussion-composer" className="sr-only">
          Start a discussion
        </label>
        <textarea
          id="discussion-composer"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share an update, question, or verification note…"
          className="w-full resize-y rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={postThread}
            disabled={!draft.trim()}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              draft.trim()
                ? "bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                : "bg-white/5 text-zinc-600 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Post
          </button>
        </div>
      </GlassCard>

      {threads.length > 0 ? (
        <ul className="space-y-3">
          {threads.map((thread) => {
            const isLiked = liked[thread.id];
            const isOpen =
              expanded[thread.id] ?? (thread.replies?.length ?? 0) > 0;
            const showReplyBox = replyingTo === thread.id;

            return (
              <li key={thread.id}>
                <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
                  <div className="flex gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: thread.accent }}
                      aria-hidden="true"
                    >
                      {thread.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-sm font-semibold text-white">
                          {thread.author}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {thread.timeLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                        {thread.body}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleLike(thread.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
                            isLiked
                              ? "text-rose-400"
                              : "text-zinc-500 hover:text-zinc-300"
                          )}
                          aria-pressed={isLiked}
                        >
                          <Heart
                            className={cn(
                              "h-3.5 w-3.5",
                              isLiked && "fill-current"
                            )}
                            aria-hidden="true"
                          />
                          {thread.likeCount}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingTo((id) =>
                              id === thread.id ? null : thread.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300"
                        >
                          <MessageCircle
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Reply
                        </button>
                        {(thread.replies?.length ?? 0) > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded((e) => ({
                                ...e,
                                [thread.id]: !isOpen,
                              }))
                            }
                            className="text-xs font-medium text-[#60A5FA] hover:text-white"
                          >
                            {isOpen ? "Hide" : "Show"} {thread.replyCount}{" "}
                            {thread.replyCount === 1 ? "reply" : "replies"}
                          </button>
                        ) : null}
                      </div>

                      {showReplyBox ? (
                        <div className="mt-3 space-y-2">
                          <textarea
                            rows={2}
                            value={replyDrafts[thread.id] ?? ""}
                            onChange={(e) =>
                              setReplyDrafts((d) => ({
                                ...d,
                                [thread.id]: e.target.value,
                              }))
                            }
                            placeholder="Write a reply…"
                            className="w-full resize-y rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => postReply(thread.id)}
                              className="rounded-lg bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB]"
                            >
                              Post reply
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {isOpen && (thread.replies?.length ?? 0) > 0 ? (
                        <ul className="mt-4 space-y-3 border-l border-white/10 pl-4">
                          {thread.replies!.map((reply) => (
                            <li key={reply.id} className="flex gap-2.5">
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                                style={{ backgroundColor: reply.accent }}
                                aria-hidden="true"
                              >
                                {reply.initials}
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2">
                                  <span className="text-xs font-semibold text-white">
                                    {reply.author}
                                  </span>
                                  <span className="text-[11px] text-zinc-500">
                                    {reply.timeLabel}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                                  {reply.body}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </GlassCard>
              </li>
            );
          })}
        </ul>
      ) : (
        <GlassCard className="p-8 text-center bg-[#121214]/90 border-white/[0.12]">
          <p className="text-base font-medium text-white">No discussions yet</p>
          <p className="mt-2 text-sm text-zinc-400">
            Start the conversation for {detail.title}.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
