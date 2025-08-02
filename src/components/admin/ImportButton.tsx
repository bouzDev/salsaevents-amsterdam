'use client';

import React from 'react';

const ImportButton: React.FC = () => {
    const handleImportClick = () => {
        window.location.href = '/admin/collections/events/import';
    };

    return (
        <div
            style={{
                margin: '16px 0 24px 0',
                padding: '16px 20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
            }}
        >
            <div>
                <h3
                    style={{
                        margin: '0 0 4px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151',
                    }}
                >
                    📁 Bulk Import Events
                </h3>
                <p
                    style={{
                        margin: '0',
                        fontSize: '14px',
                        color: '#6b7280',
                    }}
                >
                    Upload a CSV file to import multiple events at once
                </p>
            </div>
            <button
                onClick={handleImportClick}
                style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
            >
                📁 Import CSV
            </button>
        </div>
    );
};

export default ImportButton;
