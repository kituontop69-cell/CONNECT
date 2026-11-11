import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  File,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  X,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { FileTransferItem } from '../lib/types';

export const FileTransferView: React.FC = () => {
  const { fileTransfers, addFileTransfer } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        addFileTransfer(e.dataTransfer.files[i]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        addFileTransfer(e.target.files[i]);
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Encrypted P2P File Transfer
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          High-throughput chunked file streaming with cryptographic SHA-256 integrity verification.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-white/10 hover:border-cyan-500/40 bg-zinc-900/40 backdrop-blur-md'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-white text-base">
          Drop files here or click to browse
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm">
          Supports multi-gigabyte files, automatic resume on network reconnection, and zero cloud storage exposure.
        </p>
      </div>

      {/* Transfers Queue */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h3 className="font-semibold text-sm text-white">Transfer Queue</h3>
          <span className="text-xs font-mono text-zinc-500">
            {fileTransfers.length} Active Items
          </span>
        </div>

        <div className="space-y-3">
          {fileTransfers.map((item) => {
            const progress = Math.min(
              100,
              Math.round((item.bytes_transferred / item.file_size_bytes) * 100)
            );

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/[0.05] text-zinc-300">
                      {item.is_upload ? (
                        <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-white">
                        {item.file_name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {formatSize(item.bytes_transferred)} / {formatSize(item.file_size_bytes)}
                        {item.status === 'in_progress' && (
                          <span> • {(item.speed_bytes_sec / (1024 * 1024)).toFixed(1)} MB/s</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {item.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> ETA: {item.remaining_seconds}s
                      </span>
                    )}

                    <div className="flex items-center space-x-1">
                      {item.status === 'in_progress' ? (
                        <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/10">
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/10">
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/10">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === 'completed' ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                    <span>
                      {item.sha256_hash && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <ShieldCheck className="w-3 h-3 text-cyan-400" />
                          SHA256: {item.sha256_hash.slice(0, 16)}...
                        </span>
                      )}
                    </span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
