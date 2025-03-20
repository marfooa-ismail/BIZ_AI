import React, { useState } from 'react';
import '../styles/ChatBot.css';

const PitchGenerator = ({ messages }) => {
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const generateSixMinutePitch = async () => {
    try {
      setIsGenerating(true);
      setStatus('Generating 6-minute pitch...');

      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          instructions: `Create a compelling 6-minute pitch based on the conversation history. The pitch should include:
          1. Introduction (30 seconds)
          2. Problem Statement (1 minute)
          3. Solution Overview (1.5 minutes)
          4. Market Opportunity (1 minute)
          5. Business Model (1 minute)
          6. Call to Action (1 minute)
          
          Format the pitch with clear sections and timing indicators.`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate pitch');
      }

      const data = await response.json();
      setGeneratedPitch(data.pitch);
      setStatus('Pitch generated successfully! Ready for download.');
      
      // Store in localStorage as backup
      localStorage.setItem('savedPitch', data.pitch);
      
    } catch (error) {
      setStatus('Error generating pitch. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    try {
      if (!generatedPitch) {
        setStatus('No pitch available to download');
        return;
      }

      // Create a formatted pitch with title and date
      const formattedPitch = `6-MINUTE BUSINESS PITCH
Generated on: ${new Date().toLocaleDateString()}
${'-'.repeat(50)}

${generatedPitch}`;

      // Create blob and download
      const blob = new Blob([formattedPitch], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `6-minute-pitch-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setStatus('Pitch downloaded successfully!');
    } catch (error) {
      setStatus('Error downloading pitch. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="pitch-controls">
      <button
        className="generate-pitch-button"
        onClick={generateSixMinutePitch}
        disabled={isGenerating || messages.length === 0}
      >
        {isGenerating ? (
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        ) : (
          'Generate 6-Min Pitch'
        )}
      </button>

      <button
        className="download-pitch-button"
        onClick={handleDownload}
        disabled={!generatedPitch}
      >
        Download Pitch
      </button>

      {status && (
        <div className={`pitch-status ${status.includes('Error') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}

      {generatedPitch && (
        <div className="generated-pitch">
          <pre>{generatedPitch}</pre>
        </div>
      )}
    </div>
  );
};

export default PitchGenerator; 


