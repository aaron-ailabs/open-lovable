import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SandboxData {
  sandboxId: string;
  url: string;
  [key: string]: any;
}

export function useSandbox() {
  const [sandboxData, setSandboxData] = useState<SandboxData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: 'Not connected', active: false });
  const [sandboxFiles, setSandboxFiles] = useState<Record<string, string>>({});
  const [fileStructure, setFileStructure] = useState<string>('');

  const createSandbox = useCallback(async (model: string) => {
    setLoading(true);
    setStatus({ text: 'Creating sandbox...', active: true });
    try {
      const response = await fetch('/api/create-ai-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model })
      });
      const data = await response.json();
      if (data.success) {
        setSandboxData(data);
        setStatus({ text: 'Sandbox ready', active: true });
        toast.success('Sandbox created successfully');
        return data;
      } else {
        throw new Error(data.error || 'Failed to create sandbox');
      }
    } catch (error) {
      console.error('Error creating sandbox:', error);
      setStatus({ text: 'Failed to create sandbox', active: false });
      toast.error('Failed to create sandbox');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshFiles = useCallback(async (sandboxId: string) => {
    try {
      const response = await fetch(`/api/get-sandbox-files?sandboxId=${sandboxId}`);
      const data = await response.json();
      if (data.success) {
        setSandboxFiles(data.files);
        setFileStructure(data.structure);
      }
    } catch (error) {
      console.error('Error refreshing files:', error);
    }
  }, []);

  const runCommand = useCallback(async (sandboxId: string, command: string) => {
    try {
      const response = await fetch('/api/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandboxId, command })
      });
      return await response.json();
    } catch (error) {
      console.error('Error running command:', error);
      return { success: false, error: (error as Error).message };
    }
  }, []);

  return {
    sandboxData,
    setSandboxData,
    loading,
    setLoading,
    status,
    setStatus,
    sandboxFiles,
    setSandboxFiles,
    fileStructure,
    setFileStructure,
    createSandbox,
    refreshFiles,
    runCommand
  };
}
