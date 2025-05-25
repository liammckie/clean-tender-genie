
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TenderAnalysis } from '@/services/vertexAiService';

interface AnalysisDisplayProps {
  analysis: TenderAnalysis;
}

const AnalysisDisplay = ({ analysis }: AnalysisDisplayProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Tender Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Summary</h3>
          <p className="text-sm mt-1">{analysis.summary}</p>
        </div>
        <div>
          <h3 className="font-medium">Legal Requirements</h3>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {analysis.legalRequirements.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium">Operational Needs</h3>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {analysis.operationalNeeds.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium">Estimation Considerations</h3>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {analysis.estimationConsiderations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium">Key Criteria</h3>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {analysis.keyCriteria.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium">Win Themes</h3>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            {analysis.winThemes.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDisplay;
