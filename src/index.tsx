import React, { useState } from 'react';

interface DiskUtilityProps {
  onClose: () => void;
}

interface Volume {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'network';
  format: string;
  capacity: number;
  used: number;
  mountPoint: string;
}

const mockVolumes: Volume[] = [
  { id: '1', name: 'Macintosh HD', type: 'internal', format: 'APFS', capacity: 500, used: 320, mountPoint: '/' },
  { id: '2', name: 'Data', type: 'internal', format: 'APFS', capacity: 500, used: 180, mountPoint: '/System/Volumes/Data' },
  { id: '3', name: 'Backup Drive', type: 'external', format: 'HFS+', capacity: 2000, used: 1200, mountPoint: '/Volumes/Backup' },
  { id: '4', name: 'USB Flash', type: 'external', format: 'FAT32', capacity: 32, used: 8, mountPoint: '/Volumes/USB' },
];

const DiskUtility: React.FC<DiskUtilityProps> = ({ onClose }) => {
  const [volumes] = useState(mockVolumes);
  const [selectedId, setSelectedId] = useState<string | null>('1');

  const selectedVolume = volumes.find(v => v.id === selectedId);

  const formatSize = (gb: number) => {
    if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
    return `${gb} GB`;
  };

  const getIcon = (type: Volume['type']) => {
    switch (type) {
      case 'internal': return '💽';
      case 'external': return '💿';
      case 'network': return '🌐';
    }
  };

  const getUsagePercent = (v: Volume) => (v.used / v.capacity) * 100;

  return (
    <div className="h-full flex bg-[#2d2d2d] text-white">
      <div className="w-56 border-r border-white/10 flex flex-col">
        <div className="p-3 border-b border-white/10">
          <div className="text-xs font-semibold text-white/50 uppercase">Volumes</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {volumes.map(volume => (
            <div
              key={volume.id}
              onClick={() => setSelectedId(volume.id)}
              className={`p-3 cursor-pointer border-b border-white/5 transition-colors
                ${selectedId === volume.id ? 'bg-blue-600/30' : 'hover:bg-white/5'}
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{getIcon(volume.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{volume.name}</div>
                  <div className="text-xs text-white/50">
                    {formatSize(volume.used)} / {formatSize(volume.capacity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedVolume ? (
          <>
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{getIcon(selectedVolume.type)}</span>
                <div>
                  <h2 className="text-2xl font-semibold">{selectedVolume.name}</h2>
                  <div className="text-white/50">{selectedVolume.format} • {selectedVolume.mountPoint}</div>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage</span>
                  <span className="text-white/60">
                    {formatSize(selectedVolume.capacity - selectedVolume.used)} available
                  </span>
                </div>
                <div className="h-8 bg-white/10 rounded-lg overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      getUsagePercent(selectedVolume) > 90 ? 'bg-red-500' :
                      getUsagePercent(selectedVolume) > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${getUsagePercent(selectedVolume)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>{formatSize(selectedVolume.used)} used</span>
                  <span>{formatSize(selectedVolume.capacity)} total</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/50 mb-1">Format</div>
                  <div className="font-medium">{selectedVolume.format}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-xs text-white/50 mb-1">Type</div>
                  <div className="font-medium capitalize">{selectedVolume.type}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg col-span-2">
                  <div className="text-xs text-white/50 mb-1">Mount Point</div>
                  <div className="font-mono text-sm">{selectedVolume.mountPoint}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                First Aid
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                Partition
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                Erase
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                Info
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/40">
            Select a volume
          </div>
        )}
      </div>
    </div>
  );
};

export default DiskUtility;
