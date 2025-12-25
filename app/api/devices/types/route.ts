import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch fixed device types (no company filtering needed)
  const deviceTypes = [
    { id: 1, name: 'All In One' },
    { id: 2, name: 'Camera' },
    { id: 3, name: 'CD/DVD' },
    { id: 4, name: 'CF Card' },
    { id: 5, name: 'Desktop' },
    { id: 6, name: 'HDD (2.5 Inch)' },
    { id: 7, name: 'HDD (3.5 Inch)' },
    { id: 8, name: 'Laptop' },
    { id: 9, name: 'Micro SD Card' },
    { id: 10, name: 'Mobile' },
    { id: 11, name: 'Monitor' },
    { id: 12, name: 'Motherboard' },
    { id: 13, name: 'NAS Box' },
    { id: 14, name: 'Pen Drive' },
    { id: 15, name: 'SD Card' },
    { id: 16, name: 'Server Hard Drives' },
    { id: 17, name: 'SSD' },
    { id: 18, name: 'Tablet' },
    { id: 19, name: 'Television' }
  ];

  return NextResponse.json(deviceTypes);
}
