/**
 * asset-optimizer.ts
 * Thumbnail-first image loading + high-res fetch with memory guard.
 */

/** In-flight fetch tracker to prevent duplicate requests */
const _inflight = new Map<string, Promise<string>>()

/**
 * Fetch a high-resolution image blob URL.
 * - Returns the same promise if already in flight (deduplication).
 * - Caller MUST call `releaseAsset(url)` after use to revoke the object URL.
 */
export async function fetchHighResAsset(src: string): Promise<string> {
    if (_inflight.has(src)) return _inflight.get(src)!

    const promise = fetch(src)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .finally(() => _inflight.delete(src))

    _inflight.set(src, promise)
    return promise
}

/**
 * Release a previously fetched blob URL, freeing memory.
 */
export function releaseAsset(objectUrl: string): void {
    try {
        URL.revokeObjectURL(objectUrl)
    } catch {
        // Silently ignore — may already be revoked
    }
}
