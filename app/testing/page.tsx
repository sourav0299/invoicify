'use client';
import { useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

interface ScanData {
    userEmail: string;
    itemName: string;
    itemType: 'Product' | 'Service';
    itemCode: string;
    inventory: string;
    measuringUnit: string;
    salesPrice: string;
    taxIncluded: boolean;
    taxRate: string;
}

export default function Page() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<ScanData | null>(null);

    const startScanning = async () => {
        setScanning(true);
        const codeReader = new BrowserQRCodeReader();
        
        try {
            const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
            const selectedDeviceId = videoInputDevices[0].deviceId;
            
            const previewElem = document.getElementById('preview');
            if (!previewElem) return;

            const result = await codeReader.decodeFromVideoDevice(
                selectedDeviceId,
                'preview',
                (result, _, controls) => {
                    if (result) {
                        try {
                            const jsonData: ScanData = JSON.parse(result.getText());
                            setResult(jsonData);
                            setScanning(false);
                            controls.stop();
                        } catch (error) {
                            console.error('Invalid JSON data');
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Error starting scanner:', error);
            setScanning(false);
        }
    };

    const stopScanning = () => {
        setScanning(false);
    };

    return (
        <div className="p-4">
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={scanning ? stopScanning : startScanning}
            >
                {scanning ? 'Stop Scanning' : 'Start QR Scan'}
            </button>

            {scanning && (
                <div className="max-w-md mx-auto">
                    <video
                        id="preview"
                        style={{ width: '100%', maxWidth: '400px' }}
                    ></video>
                </div>
            )}

            {result && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Scanned Item Details:</h2>
                    <div className="bg-gray-100 p-4 rounded space-y-2">
                        <p><strong>Item Name:</strong> {result.itemName}</p>
                        <p><strong>Item Type:</strong> {result.itemType}</p>
                        <p><strong>Item Code:</strong> {result.itemCode}</p>
                        <p><strong>Inventory:</strong> {result.inventory} {result.measuringUnit}</p>
                        <p><strong>Price:</strong> ₹{result.salesPrice}</p>
                        <p><strong>Tax Rate:</strong> {result.taxRate}%</p>
                        <p><strong>Tax Included:</strong> {result.taxIncluded ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}