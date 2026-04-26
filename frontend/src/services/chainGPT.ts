/**
 * ChainGPT Web3 LLM client.
 *
 * Per the ChainGPT API reference there is a single endpoint that handles both
 * buffered and streamed responses:
 *   POST https://api.chaingpt.org/chat/stream
 *
 * Buffered response shape:
 *   { "status": true, "data": { "bot": "..." } }
 *
 * SECURITY NOTE
 * -------------
 * ChainGPT explicitly recommends NEVER embedding the API key in client-side
 * JavaScript and proxying calls through your own backend instead. Vite will
 * inline `VITE_*` env vars into the production bundle, so anyone who opens
 * DevTools on a hosted GhostPay frontend can read this key. For the
 * hackathon prototype we accept this trade-off, but for any real deployment
 * you should:
 *   1. Move this fetch onto a small server route (Next.js API route, Cloudflare
 *      Worker, AWS Lambda, etc.).
 *   2. Hold the key in a server-only env var.
 *   3. Have the frontend POST `{ question, history }` to your route and let
 *      the route call ChainGPT.
 */

const CHAINGPT_API_URL = 'https://api.chaingpt.org/chat/stream';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChainGPTResponse {
  status?: boolean;
  data?: {
    bot?: string;
  };
  // Older shape, kept as fallback in case the API revs again.
  answer?: string;
  response?: string;
  message?: string;
}

export const fetchAIResponse = async (
  question: string,
  chatHistory: ChatMessage[] = [],
): Promise<string> => {
  const apiKey = import.meta.env.VITE_CHAINGPT_API_KEY as string | undefined;

  if (!apiKey) {
    return 'AI Assistant: Please configure your VITE_CHAINGPT_API_KEY in the .env file.';
  }

  // ChainGPT uses its own per-session memory keyed by `sdkUniqueId`. We
  // create one stable id per browser session so multi-turn context works.
  const sessionId =
    sessionStorage.getItem('ghostpay-chaingpt-session') ??
    (() => {
      const id = `ghostpay-${crypto.randomUUID()}`;
      sessionStorage.setItem('ghostpay-chaingpt-session', id);
      return id;
    })();

  try {
    const response = await fetch(CHAINGPT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'general_assistant',
        question,
        chatHistory: chatHistory.length > 0 ? 'on' : 'off',
        sdkUniqueId: sessionId,
      }),
    });

    if (!response.ok) {
      // Best-effort surface the API error so the user knows what went wrong.
      const text = await response.text().catch(() => response.statusText);
      throw new Error(`ChainGPT ${response.status}: ${text}`);
    }

    const data: ChainGPTResponse = await response.json();

    // Newest documented shape first; tolerate older shapes for safety.
    return (
      data.data?.bot ??
      data.answer ??
      data.response ??
      data.message ??
      'No response from AI.'
    );
  } catch (error) {
    console.error('ChainGPT error:', error);
    return 'Sorry, I encountered an error connecting to the AI service.';
  }
};
