'use client';
import React, { useState } from "react";

type ApiResponse = { success: boolean; sid?: string; error?: string; };

function normalizeUSPhone(input: string): string | null {
  // Remove non-digits
  const digits = input.replace(/\D/g, "");
  const trimmed = input.trim();

  // Already in E.164 format: +1XXXXXXXXXX
  if (/^\+1\d{10}$/.test(trimmed)) return trimmed;

  // 10-digit US number -> +1XXXXXXXXXX
  if (digits.length === 10) return `+1${digits}`;

  // 11-digit starting with 1 -> +1XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return null;
}

export default function SmsSender(): JSX.Element {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const normalized = normalizeUSPhone(to);
    if (!normalized) {
      setStatus("Please enter a valid US phone number.");
      return;
    }
    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: normalized, message }),
      });
      const data: ApiResponse = await res.json();
      if (!res.ok || !data.success) {
        setStatus(data.error || "Failed to send SMS.");
      } else {
        setStatus(`SMS sent. SID: ${data.sid}`);
        setMessage("");
      }
    } catch (err) {
      setStatus("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 400 }}>
      <label>
        US Phone Number:
        <input
          type="tel"
          placeholder="(555) 123-4567 or +15551234567"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={loading}
          required
        />
      </label>
      <label>
        Message:
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send SMS"}
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
