import { Tool, CalculationResult } from '@/lib/types';
import QRCode from 'qrcode';

export interface ShareableCalculation {
  id: string;
  toolId: string;
  toolName: string;
  inputs: Record<string, any>;
  result: CalculationResult;
  createdAt: string;
  expiresAt?: string;
  notes?: string;
}

export interface ShareLink {
  shareId: string;
  shortUrl: string;
  fullUrl: string;
  qrCode?: string;
}

// Simple encryption/decryption for URL parameters
function encodeData(data: any): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeData(encoded: string): any {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch (e) {
    console.error('Failed to decode data:', e);
    return null;
  }
}

// Generate a unique share ID
export function generateShareId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

// Create a shareable link for a calculation
export async function createShareableLink(
  tool: Tool,
  inputs: Record<string, any>,
  result: CalculationResult,
  baseUrl: string = window.location.origin
): Promise<ShareLink> {
  const shareId = generateShareId();
  
  const shareData: ShareableCalculation = {
    id: shareId,
    toolId: tool.id,
    toolName: tool.name,
    inputs,
    result,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };

  // Encode the data for URL
  const encoded = encodeData(shareData);
  
  // Create the share URL
  const shareUrl = `${baseUrl}/share/${shareId}?data=${encoded}`;
  const shortUrl = `${baseUrl}/s/${shareId}`;
  
  // Generate QR code
  let qrCode: string | undefined;
  try {
    qrCode = await QRCode.toDataURL(shareUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }

  // Store in localStorage for retrieval
  const shares = getStoredShares();
  shares[shareId] = shareData;
  localStorage.setItem('skinscores_shares', JSON.stringify(shares));

  return {
    shareId,
    shortUrl,
    fullUrl: shareUrl,
    qrCode,
  };
}

// Get a shared calculation by ID
export function getSharedCalculation(shareId: string, encodedData?: string): ShareableCalculation | null {
  // First try to get from URL data
  if (encodedData) {
    const decoded = decodeData(encodedData);
    if (decoded && decoded.id === shareId) {
      return decoded;
    }
  }

  // Fall back to localStorage
  const shares = getStoredShares();
  const share = shares[shareId];
  
  if (!share) return null;
  
  // Check if expired
  if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
    delete shares[shareId];
    localStorage.setItem('skinscores_shares', JSON.stringify(shares));
    return null;
  }
  
  return share;
}

// Get all stored shares
export function getStoredShares(): Record<string, ShareableCalculation> {
  try {
    const stored = localStorage.getItem('skinscores_shares');
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Failed to load shares:', e);
    return {};
  }
}

// Delete a share
export function deleteShare(shareId: string): void {
  const shares = getStoredShares();
  delete shares[shareId];
  localStorage.setItem('skinscores_shares', JSON.stringify(shares));
}

// Clean up expired shares
export function cleanupExpiredShares(): void {
  const shares = getStoredShares();
  const now = new Date();
  
  Object.entries(shares).forEach(([id, share]) => {
    if (share.expiresAt && new Date(share.expiresAt) < now) {
      delete shares[id];
    }
  });
  
  localStorage.setItem('skinscores_shares', JSON.stringify(shares));
}

// Copy share link to clipboard
export async function copyShareLink(shareLink: ShareLink): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(shareLink.fullUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Format share link for display
export function formatShareLink(shareLink: ShareLink): string {
  return shareLink.shortUrl;
}

// Get share link from current URL
export function getShareFromUrl(): { shareId: string; data?: string } | null {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  
  // Check for /share/:id or /s/:id pattern
  const shareMatch = path.match(/\/(share|s)\/([a-z0-9-]+)/i);
  if (shareMatch) {
    return {
      shareId: shareMatch[2],
      data: params.get('data') || undefined,
    };
  }
  
  return null;
}