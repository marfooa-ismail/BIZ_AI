
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Groq from "groq-sdk";
import '../styles/PitchGenerator.css';
// import Navbar from '../components/Navbar';

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const PitchGenerator = () => {
    const [formData, setFormData] = useState({
        businessTitle: '',
        businessDescription: '',
        tag_line: '',
        pitchDuration: '',
        targetAudience: '',
        marketSize: '',
    });

    const [generatedPitch, setGeneratedPitch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generatePitch = async () => {
        setLoading(true);
        setError(null);
        setGeneratedPitch('');

        try {
            const messages = [
                {
                    role: "system",
                    content: `You are an expert business consultant. Generate a compelling business pitch using the following details:
                    
                    - Business Title: ${formData.businessTitle}
                    - Business Description: ${formData.businessDescription}
                    - Tagline: ${formData.tag_line}
                    - Pitch Duration: ${formData.pitchDuration} minutes
                    - Target Audience: ${formData.targetAudience}
                    - Market Size: ${formData.marketSize}

                    Structure the pitch with:
                    1. Executive Summary
                    2. Business Overview
                    3. Market Analysis
                    4. Financial Projections
                    5. Risk Analysis
                    6. Implementation Timeline
                    
                    Format the output neatly.`
                }
            ];

            const response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: messages
            });

            const pitch = response.choices?.[0]?.message?.content?.trim();
            
            if (pitch) {
                setGeneratedPitch(pitch);
            } else {
                throw new Error('Failed to generate pitch');
            }
        } catch (error) {
            console.error('Error generating pitch:', error);
            setError('Failed to generate pitch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedPitch) {
            setError('No pitch content available to download');
            return;
        }

        const formattedPitch = `BUSINESS PITCH
Generated on: ${new Date().toLocaleDateString()}
===========================================

${generatedPitch}`;

        const blob = new Blob([formattedPitch], { type: 'text/plain;charset=utf-8' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `business-pitch-${new Date().toISOString().split('T')[0]}.txt`;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);
        }, 100);
    };

    return (
        <div className="container">
{/* <Navbar/> */}
            <div className="content-wrapper">
                {/* Form & Pitch Section Side-by-Side */}
                <div className="main-section">
                    
                    {/* Form Section */}
                    <div className="form-container">
                        <h2>Generate Your Business Pitch</h2>
                        <p>Enter your business details to generate a professional pitch</p>

                        <label>Business Title</label>
                        <input 
                            type="text" 
                            name="businessTitle" 
                            placeholder="Enter business title" 
                            value={formData.businessTitle} 
                            onChange={handleChange} 
                            required 
                        />

                        <label>Business Description</label>
                        <textarea 
                            name="businessDescription" 
                            placeholder="Describe your business in detail..." 
                            rows="6" 
                            value={formData.businessDescription} 
                            onChange={handleChange} 
                            required 
                        />

                        <label>Tagline</label>
                        <input 
                            type="text" 
                            name="tagline" 
                            placeholder="Enter a catchy tagline" 
                            value={formData.tagline} 
                            onChange={handleChange} 
                            required 
                        />

                        <label>Pitch Duration (Minutes)</label>
                        <input 
                            type="number" 
                            name="pitchDuration" 
                            placeholder="Enter pitch duration in minutes" 
                            value={formData.pitchDuration} 
                            onChange={handleChange} 
                            required 
                        />

                        <label>Target Audience</label>
                        <input 
                            type="text" 
                            name="targetAudience" 
                            placeholder="Who is your target audience?" 
                            value={formData.targetAudience} 
                            onChange={handleChange} 
                            required 
                        />

                        <label>Market Size</label>
                        <input 
                            type="text" 
                            name="marketSize" 
                            placeholder="Enter market size (e.g., Local, Global)" 
                            value={formData.marketSize} 
                            onChange={handleChange} 
                            required 
                        />

                        <button className="generate-button" onClick={generatePitch} disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Pitch'}
                        </button>
                    </div>

                    {/* Pitch Content Section */}
                    <div className="pitch-container">
                        {error && <div className="error-message">{error}</div>}

                        {generatedPitch && (
                            <div className="pitch-content-box">
                                <h2>Generated Business Pitch</h2>
                                <pre>{generatedPitch}</pre>
                            </div>
                        )}

                        {/* Buttons Outside the Pitch Box */}
                        <div className="button-group">
                            {generatedPitch && (
                                <button className="download-button" onClick={handleDownload}>Download Pitch</button>
                            )}
                            <button className="back-button" onClick={() => navigate('/chat')}>Back to Chat</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PitchGenerator;







