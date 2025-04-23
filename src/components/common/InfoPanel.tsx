import React from 'react';

type PanelType = 'info' | 'warning' | 'tip' | 'note';

interface InfoPanelProps {
  type: PanelType;
  title: string;
  children: React.ReactNode;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ type, title, children }) => {
  const getTypeStyles = (): string => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'tip':
        return 'bg-green-50 border-green-400 text-green-800';
      case 'note':
        return 'bg-gray-50 border-gray-400 text-gray-800';
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };

  return (
    <div className={`border-l-4 p-4 my-4 rounded-r-md ${getTypeStyles()}`}>
      <h4 className="font-bold mb-2">{title}</h4>
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default InfoPanel;
