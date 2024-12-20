'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/theme-store';
import { debounce } from '@/lib/utils/debounce';
import { ColorInput } from './components/ColorInput';
import { ThemePreview } from './components/ThemePreview';

const defaultColors = {
  primary: '#6366f1',
  secondary: '#4f46e5',
  accent: '#8b5cf6',
  background: '#000000',
  foreground: '#ffffff',
  muted: '#6b7280',
  border: '#27272a'
};

export default function ThemeSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [colors, setColors] = useState(defaultColors);
  const [themeId, setThemeId] = useState<string | null>(null);
  const { toast } = useToast();
  const { updateTheme } = useThemeStore();

  const debouncedUpdateTheme = useCallback(
    debounce((newColors) => {
      updateTheme(newColors);
    }, 200),
    [updateTheme]
  );

  const handleColorChange = (key: string, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    debouncedUpdateTheme(newColors);
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/admin/theme');
      if (!response.ok) throw new Error('Failed to fetch theme');
      const data = await response.json();
      if (data) {
        setThemeId(data._id);
        const themeColors = {
          primary: data.primary || defaultColors.primary,
          secondary: data.secondary || defaultColors.secondary,
          accent: data.accent || defaultColors.accent,
          background: data.background || defaultColors.background,
          foreground: data.foreground || defaultColors.foreground,
          muted: data.muted || defaultColors.muted,
          border: data.border || defaultColors.border
        };
        setColors(themeColors);
        updateTheme(themeColors);
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to load theme settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: themeId,
          ...colors
        }),
      });

      if (!response.ok) throw new Error('Failed to update theme');

      updateTheme(colors);
      toast({
        title: 'Success',
        description: 'Theme settings updated successfully',
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
      setError(error instanceof Error ? error.message : 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const resetColors = () => {
    setColors(defaultColors);
    updateTheme(defaultColors);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Theme Settings</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your website
          </p>
        </div>
        <Button variant="outline" onClick={resetColors}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(colors).map(([key, value]) => (
                <ColorInput
                  key={key}
                  label={key}
                  value={value}
                  onChange={(newValue) => handleColorChange(key, newValue)}
                />
              ))}
            </div>

            <ThemePreview colors={colors} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}