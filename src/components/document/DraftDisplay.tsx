
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DraftDisplayProps {
  draft: string;
  saving: boolean;
  onSaveDraft: () => void;
}

const DraftDisplay = ({ draft, saving, onSaveDraft }: DraftDisplayProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tender Draft</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="whitespace-pre-wrap text-sm">{draft}</pre>
        <Button
          onClick={onSaveDraft}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Draft to Google Docs'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DraftDisplay;
