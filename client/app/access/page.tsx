'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Download, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AccessPage() {
  const [accessId, setAccessId] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'allowed' | 'denied'>('idle');
  const [fileName, setFileName] = useState('');

  const handleCheckAccess = async () => {
    setLoading(true);
    setGettingLocation(true);
    setError('');
    setVerificationStatus('idle');

    if (!accessId.trim()) {
      setError('Please enter an access ID');
      setLoading(false);
      setGettingLocation(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGettingLocation(false);
        
        try {
          const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessId: accessId.trim(),
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString(),
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Verification failed');
          }

          if (data.allowed) {
            setVerificationStatus('allowed');
            setFileName(data.fileName || 'file');
          } else {
            setVerificationStatus('denied');
            setError(data.message || 'Access denied: You are not within the allowed location');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setVerificationStatus('denied');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
        setGettingLocation(false);
      }
    );
  };

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/download/${accessId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access Location-Locked File</CardTitle>
          <CardDescription>Enter the access ID to verify and download</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="accessId">Access ID</Label>
            <Input
              id="accessId"
              type="text"
              placeholder="Enter access ID"
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              disabled={verificationStatus === 'allowed'}
              className="mt-1 font-mono"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {verificationStatus === 'allowed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Access Granted</p>
                <p className="text-sm text-green-700">You are within the allowed location</p>
              </div>
            </div>
          )}

          {gettingLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-sm text-blue-600">Getting your location...</p>
            </div>
          )}

          <div className="space-y-2 pt-2">
            {verificationStatus !== 'allowed' ? (
              <Button
                onClick={handleCheckAccess}
                disabled={loading || gettingLocation}
                className="w-full"
              >
                {loading && !gettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Check & Download
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleDownload} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </>
                )}
              </Button>
            )}

            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
