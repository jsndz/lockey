'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MapPin } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Location-Locked File Access</h1>
          <p className="text-gray-600">Secure your files with location-based access control</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/upload')}>
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Lock a file to a specific location</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/access')}>
            <CardHeader>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6" />
              </div>
              <CardTitle>Access File</CardTitle>
              <CardDescription>Download a location-locked file</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
