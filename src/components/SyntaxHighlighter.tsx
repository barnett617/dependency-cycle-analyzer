import React from 'react';
import { Prism } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  language = 'javascript',
}) => {
  return (
    <Prism
      language={language}
      style={tomorrow}
      customStyle={{
        margin: 0,
        padding: '1rem',
        borderRadius: '0.375rem',
        backgroundColor: '#1e293b',
      }}
    >
      {code}
    </Prism>
  );
}; 