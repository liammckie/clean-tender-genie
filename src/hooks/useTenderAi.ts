import { useState } from 'react';
import { vertexAiService, TenderAnalysis } from '@/services/vertexAiService';
import { googleDriveService } from '@/services/googleDriveService';

export function useTenderAi() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const analyze = async (text: string) => {
    setAnalyzing(true);
    try {
      const res = await vertexAiService.analyzeTender(text);
      setAnalysis(res);
      return res;
    } finally {
      setAnalyzing(false);
    }
  };

  const draftTender = async (text: string) => {
    setDrafting(true);
    try {
      const res = await vertexAiService.draftTender(text);
      setDraft(res);
      return res;
    } finally {
      setDrafting(false);
    }
  };

  const saveDraft = async (name: string, content: string) => {
    setSaving(true);
    try {
      const doc = await googleDriveService.createGoogleDoc(name);
      await googleDriveService.updateGoogleDoc(doc.id, content);
      return doc;
    } finally {
      setSaving(false);
    }
  };

  return { analyzing, analysis, analyze, drafting, draft, draftTender, saving, saveDraft };
}
