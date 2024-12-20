'use client';

import { Button } from '@/components/ui/button';

interface ThemePreviewProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
}

export function ThemePreview({ colors }: ThemePreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Preview</h3>
      <div className="p-6 rounded-lg border">
        <div className="space-y-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Primary Button
          </Button>
          <Button variant="outline" className="border-secondary text-secondary">
            Secondary Button
          </Button>
          <div className="p-4 rounded-lg bg-accent/20 text-accent">
            Accent Element
          </div>
          <p className="text-foreground">
            Regular text content
          </p>
          <p className="text-muted-foreground">
            Muted text content
          </p>
        </div>
      </div>
    </div>
  );
}