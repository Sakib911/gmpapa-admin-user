import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ThemeSettings } from '@/lib/models/theme-settings.model';
import dbConnect from '@/lib/db/mongodb';

export async function GET() {
  try {
    await dbConnect();
    const settings = await ThemeSettings.findOne().sort({ createdAt: -1 });
    return Response.json(settings || {});
  } catch (error) {
    console.error('Failed to fetch theme settings:', error);
    return Response.json(
      { error: 'Failed to fetch theme settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { _id, ...colors } = data;

    // Find existing theme by updatedBy
    let settings = await ThemeSettings.findOne({ updatedBy: session.user.id });

    if (settings) {
      // Update existing theme
      settings = await ThemeSettings.findByIdAndUpdate(
        settings._id,
        { ...colors },
        { new: true }
      );
    } else {
      // Create new theme if none exists for this admin
      settings = await ThemeSettings.create({
        ...colors,
        updatedBy: session.user.id
      });
    }

    return Response.json(settings);
  } catch (error) {
    console.error('Failed to update theme:', error);
    return Response.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}