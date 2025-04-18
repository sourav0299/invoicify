import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { saveFile } from '../../../utils/cloudinary';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const businessSettings = await prisma.businessSetting.findUnique({
      where: { userEmail },
    });

    if (!businessSettings) {
      return NextResponse.json({ error: 'Business settings not found' }, { status: 404 });
    }

    return NextResponse.json(businessSettings);
  } catch (error) {
    console.log('Error fetching business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    let businessLogoUrl: string | undefined;
    let signatureUrl: string | undefined;


    if (formData.has('businessLogo')) { 
      const businessLogo = formData.get('businessLogo') as File;
      businessLogoUrl = await saveFile(businessLogo);
    }

    if (formData.has('signature')) { 
      const signature = formData.get('signature') as File;
      signatureUrl = await saveFile(signature);
    }

    const businessSettingsData = {
      businessName: data.businessName,
      businessType: data.businessType,
      businessRegistrationType: data.businessRegistrationType,
      isGstRegistered: data.isGstRegistered === 'true',
      gstNumber: data.gstNumber || '',
      panNumber: data.panNumber || '',
      address: data.address,
      pincode: data.pincode,
      city: data.city,
      termsAndConditions: data.termsAndConditions || '',
      userEmail,
      businessLogoUrl,
      signatureUrl,
      companyEmail: data.companyEmail || '',
      companyNumber: data.companyNumber || '',
      billingAddress: data.billingAddress || '',
      state: data.state || '',
    };

    const businessSettings = await prisma.businessSetting.create({
      data: businessSettingsData,
    });

    return NextResponse.json(businessSettings, { status: 201 });
  } catch (error) {
    console.log('Error creating business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    const existingSettings = await prisma.businessSetting.findUnique({
      where: { userEmail },
    });

    let businessLogoUrl = existingSettings?.businessLogoUrl ?? undefined;
    let signatureUrl = existingSettings?.signatureUrl ?? undefined;

    if (formData.has('businessLogo')) {
      const businessLogo = formData.get('businessLogo') as File;
      businessLogoUrl = await saveFile(businessLogo, businessLogoUrl);
    }

    if (formData.has('signature')) {
      const signature = formData.get('signature') as File;
      signatureUrl = await saveFile(signature, signatureUrl);
    }

    const businessSettingsData = {
      businessName: data.businessName,
      businessType: data.businessType,
      businessRegistrationType: data.businessRegistrationType,
      isGstRegistered: data.isGstRegistered === 'true',
      gstNumber: data.gstNumber,
      panNumber: data.panNumber,
      address: data.address,
      pincode: data.pincode,
      city: data.city,
      termsAndConditions: data.termsAndConditions,
      userEmail,
      businessLogoUrl,
      signatureUrl,
      companyEmail: data.companyEmail,
      companyNumber: data.companyNumber,
      billingAddress: data.billingAddress,
      state: data.state,
    };

    if (existingSettings) {
      const updatedSettings = await prisma.businessSetting.update({
        where: { userEmail },
        data: businessSettingsData,
      });
      return NextResponse.json(updatedSettings);
    } else {
      const newSettings = await prisma.businessSetting.create({
        data: businessSettingsData,
      });
      return NextResponse.json(newSettings);
    }
  } catch (error) {
    console.log('Error updating business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}