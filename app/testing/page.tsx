'use client';
import { useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Dialog } from '@headlessui/react';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                            setIsModalOpen(false);
                            controls.stop();
                        } catch (error) {
                            console.error('Invalid JSON data');
                        }
                    }
                }
            );
        } catch (error) {
            setScanning(false);
        }
    };

    const stopScanning = () => {
        setScanning(false);
        setIsModalOpen(false);
    };

    return (
        <div className="p-4">
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => {
                    setIsModalOpen(true);
                    startScanning();
                }}
            >
                Start QR Scan
            </button>

            <Dialog
                open={isModalOpen}
                onClose={() => {
                    stopScanning();
                    setIsModalOpen(false);
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-4">
                        <Dialog.Title className="text-lg font-bold mb-4">
                            Scan QR Code
                        </Dialog.Title>

                        <div className="relative">
                            <video
                                id="preview"
                                className="w-full rounded"
                                style={{ maxWidth: '400px' }}
                            ></video>

                            <button
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                                onClick={stopScanning}
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

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