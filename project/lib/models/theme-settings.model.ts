import mongoose, { Schema, Document } from 'mongoose';

export interface IThemeSettings extends Document {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSettingsSchema = new Schema<IThemeSettings>({
  primary: { type: String, default: '#6366f1' },
  secondary: { type: String, default: '#4f46e5' },
  accent: { type: String, default: '#8b5cf6' },
  background: { type: String, default: '#000000' },
  foreground: { type: String, default: '#ffffff' },
  muted: { type: String, default: '#6b7280' },
  border: { type: String, default: '#27272a' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Index for faster lookups
ThemeSettingsSchema.index({ updatedBy: 1 });

export const ThemeSettings = mongoose.models.ThemeSettings || 
  mongoose.model<IThemeSettings>('ThemeSettings', ThemeSettingsSchema);