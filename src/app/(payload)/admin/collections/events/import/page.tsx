'use client';

import React, { useState } from 'react';
import './import.css';

const EventsImportPage: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<
        'success' | 'error' | 'info'
    >('info');

    // Parse CSV data
    const parseCSV = (csvText: string) => {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');

        return lines.slice(1).map((line) => {
            const values: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());

            const obj: { [key: string]: string } = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index]?.replace(/"/g, '') || '';
            });
            return obj;
        });
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setMessage('Please select a CSV file');
            setMessageType('error');
            return;
        }

        setIsUploading(true);
        setMessage('Reading CSV file...');
        setMessageType('info');

        try {
            const text = await file.text();
            const csvData = parseCSV(text);

            setMessage(
                `Found ${csvData.length} events in CSV. Starting import...`
            );

            let successCount = 0;
            let errorCount = 0;

            for (const csvEvent of csvData) {
                try {
                    const payloadEvent = {
                        title: csvEvent.title || 'Untitled Event',
                        description: csvEvent.description || '',
                        date:
                            csvEvent.date ||
                            new Date().toISOString().split('T')[0],
                        time: csvEvent.time || '',
                        venue: csvEvent.venue || 'TBD',
                        city: csvEvent.city || 'Amsterdam',
                        type: csvEvent.type || 'social',
                        url: csvEvent.url || '',
                        price: csvEvent.price || '',
                        tags: csvEvent.tags || '',
                        vibe: csvEvent.vibe || '',
                        imageUrl: csvEvent.imageUrl || '',
                        isRecurring: csvEvent.isRecurring === 'true' || false,
                        frequency: csvEvent.frequency || undefined,
                    };

                    const response = await fetch('/api/events', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payloadEvent),
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    errorCount++;
                }

                setMessage(
                    `Importing... ${successCount + errorCount}/${csvData.length} processed`
                );
            }

            if (errorCount === 0) {
                setMessage(`✅ Successfully imported ${successCount} events!`);
                setMessageType('success');
            } else {
                setMessage(
                    `⚠️ Imported ${successCount} events. ${errorCount} failed.`
                );
                setMessageType('error');
            }

            event.target.value = '';
        } catch (error) {
            setMessage(
                `❌ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
            setMessageType('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='import-container'>
            {/* Header */}
            <div className='import-header'>
                <h1 className='import-title'>📁 CSV Import for Events</h1>
                <p className='import-description'>
                    Bulk import events from a CSV file into your Events
                    collection.
                </p>
                <div className='import-navigation'>
                    <a
                        href='/admin/collections/events'
                        className='import-nav-button'
                    >
                        ← Back to Events
                    </a>
                    <a
                        href='/sample-events.csv'
                        download
                        className='import-nav-button primary'
                    >
                        📥 Download Sample CSV
                    </a>
                </div>
            </div>

            {/* Upload Area */}
            <div className='import-upload-area'>
                <div className='import-upload-icon'>📁</div>
                <h3 className='import-upload-title'>Upload your CSV file</h3>
                <p className='import-upload-subtitle'>
                    Choose a CSV file with your events data
                </p>
                <input
                    type='file'
                    accept='.csv'
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className='import-file-input'
                />
            </div>

            {/* Progress/Results */}
            {message && (
                <div className={`import-message ${messageType}`}>{message}</div>
            )}

            {isUploading && (
                <div className='import-progress'>
                    <div className='import-progress-title'>
                        ⏳ Importing events...
                    </div>
                    <p className='import-progress-subtitle'>
                        Please wait while we process your file
                    </p>
                </div>
            )}

            {/* Instructions */}
            <div className='import-instructions'>
                <h3 className='import-instructions-title'>
                    📋 CSV Format Requirements
                </h3>
                <div className='import-instructions-content'>
                    <p>
                        <strong>Required columns:</strong> title, date, venue,
                        city
                    </p>
                    <p>
                        <strong>Optional columns:</strong> description, time,
                        type, url, price, tags, vibe, imageUrl, isRecurring,
                        frequency
                    </p>
                    <p>
                        <strong>Date format:</strong> YYYY-MM-DD (e.g.,
                        2024-12-28)
                    </p>
                    <p>
                        <strong>Time format:</strong> HH:MM-HH:MM (e.g.,
                        20:00-23:00)
                    </p>
                    <p>
                        <strong>Event types:</strong> party, workshop, festival,
                        social
                    </p>
                    <p>
                        <strong>Tips:</strong> Use quotes around fields that
                        contain commas. Check the sample CSV for examples.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventsImportPage;
