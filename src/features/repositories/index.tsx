import React from 'react';
import RepositorySearch from './components/RepositorySearch/RepositorySearch';
import RepositoryTable from './components/RepositoryTable/RepositoryTable';
import RepositoryDetails from './components/RepositoryDetails/RepositoryDetails';

const RepositoriesFeature: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            padding: '16px'
        }}>
            <div>
                <RepositorySearch />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
            }}>
                <div style={{ flex: 1 }}>
                    <RepositoryTable />
                </div>
                <div style={{ flex: 1 }}>
                    <RepositoryDetails />
                </div>
            </div>
        </div>
    );
};

export default RepositoriesFeature;