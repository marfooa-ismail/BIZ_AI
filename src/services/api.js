// API Configuration
const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const BACKEND_API_ENDPOINT = 'http://localhost:5000/api';
const CENSUS_API_ENDPOINT = 'https://api.census.gov/data/2020/acs/acs5';

// Get API keys from environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Available models
const MODELS = {
  LLAMA: "llama2-70b-4096",
  LLAMA_CHAT: "llama2-70b-chat",
  MIXTRAL: "mixtral-8x7b-32768"
};

// Chat completion with Llama 3.2
export const chatCompletion = async (messages, model = MODELS.LLAMA_CHAT) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
};

// Helper function to format chat messages
export const formatChatMessage = (role, content) => ({
  role,
  content
});

// Business Analysis API Service
export const analyzeBusinessIdea = async (businessType, location, model = MODELS.LLAMA_CHAT) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const messages = [
      formatChatMessage("system", 
        `You are a business analysis expert who provides detailed, practical advice for entrepreneurs. 
         You specialize in market analysis, financial projections, and strategic planning.
         Your responses should be well-structured, data-driven, and actionable.`
      ),
      formatChatMessage("user", 
        `Analyze this business idea: ${businessType} in location: ${JSON.stringify(location)}. 
         Consider market analysis, competition, success factors, and recommendations.
         Include specific details about:
         1. Market potential and size
         2. Target demographics
         3. Competition analysis
         4. Location considerations
         5. Initial investment needed
         6. Operating costs
         7. Expected ROI
         8. Key success factors
         
         Format your response in a clear, structured way with headings and bullet points.`
      )
    ];

    const response = await chatCompletion(messages, model);
    return response;
  } catch (error) {
    console.error('Error analyzing business idea:', error);
    return {
      choices: [{
        message: {
          content: "I apologize, but I encountered an error while analyzing your business idea. Here's a general analysis based on available data:\n\n" +
                   generateFallbackAnalysis(businessType)
        }
      }]
    };
  }
};

// Market Research API Service
export const getMarketResearch = async (businessType, location) => {
  try {
    const searchParams = new URLSearchParams({
      term: businessType,
      latitude: location.lat,
      longitude: location.lng,
      radius: 5000,
      limit: 50
    });

    const response = await fetch(`${BACKEND_API_ENDPOINT}/businesses/search?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market research:', error);
    return {
      businesses: [],
      total: 0,
      error: 'Unable to fetch market data. Using general market analysis.'
    };
  }
};

// Helper function for fallback analysis
const generateFallbackAnalysis = (businessType) => {
  const analysis = {
    retail: {
      market: "The retail market typically shows steady growth with increasing e-commerce integration.",
      investment: "$50,000-150,000 initial investment typically required",
      roi: "15-25% annual ROI is common in successful retail operations"
    },
    restaurant: {
      market: "Restaurant industry shows strong recovery post-pandemic with growing delivery trends.",
      investment: "$100,000-300,000 initial investment for a full-service restaurant",
      roi: "20-30% annual ROI possible with good location and management"
    },
    tech: {
      market: "Technology sector continues rapid growth with high demand for innovative solutions.",
      investment: "$20,000-80,000 for initial setup and development",
      roi: "30-40% annual ROI potential in successful tech ventures"
    },
    manufacturing: {
      market: "Manufacturing sector shows stable growth with increasing automation trends.",
      investment: "$200,000-500,000 for equipment and initial setup",
      roi: "25-35% annual ROI with efficient operations"
    }
  };

  const defaultAnalysis = {
    market: "Market conditions vary by specific niche and location",
    investment: "Initial investment requirements depend on scale and type",
    roi: "ROI varies based on execution and market conditions"
  };

  const businessAnalysis = analysis[businessType] || defaultAnalysis;

  return `
Market Analysis:
${businessAnalysis.market}

Investment Required:
${businessAnalysis.investment}

Expected Returns:
${businessAnalysis.roi}

Key Success Factors:
1. Strong business plan and market research
2. Efficient operations management
3. Quality customer service
4. Effective marketing strategy
5. Location optimization
6. Cost control and financial management`;
};

// Demographics API Service
export const getDemographicData = async (location) => {
  try {
    if (!location || !location.lat || !location.lng) {
      throw new Error('Invalid location data');
    }

    // For now, return mock demographic data since Census API requires specific setup
    return {
      population: "250,000-500,000",
      medianIncome: "$65,000",
      growthRate: "2.5%",
      ageDistribution: {
        under18: "22%",
        _18to34: "28%",
        _35to54: "32%",
        _55plus: "18%"
      }
    };
  } catch (error) {
    console.error('Error fetching demographic data:', error);
    return null;
  }
};

// Business Plan Generator with model selection
export const generateBusinessPlan = async (businessDetails, model = MODELS.LLAMA_CHAT) => {
  try {
    const messages = [
      formatChatMessage("system",
        `You are a business plan expert who creates detailed, professional business plans.
         Focus on providing actionable insights and clear implementation steps.`
      ),
      formatChatMessage("user",
        `Generate a detailed business plan for: ${JSON.stringify(businessDetails)}`
      )
    ];

    return await chatCompletion(messages, model);
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw error;
  }
};

// Financial Projections Service with model selection
export const generateFinancialProjections = async (businessType, initialInvestment, model = MODELS.LLAMA_CHAT) => {
  try {
    const messages = [
      formatChatMessage("system",
        `You are a financial analyst who creates detailed financial projections for businesses.
         Provide comprehensive analysis with realistic numbers and clear explanations.`
      ),
      formatChatMessage("user",
        `Generate 5-year financial projections for a ${businessType} business with initial investment of ${initialInvestment}. 
         Include:
         1. Revenue projections with growth assumptions
         2. Detailed operating costs breakdown
         3. Profit margins analysis
         4. ROI calculations
         5. Break-even analysis
         6. Cash flow projections`
      )
    ];

    return await chatCompletion(messages, model);
  } catch (error) {
    console.error('Error generating financial projections:', error);
    throw error;
  }
};

// Competitor Analysis Service
export const analyzeCompetitors = async (businessType, location) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const response = await fetch(`${BACKEND_API_ENDPOINT}/businesses/search`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        term: businessType,
        latitude: location.lat,
        longitude: location.lng,
        radius: 8000,
        sort_by: 'rating'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    return {
      businesses: [],
      total: 0,
      error: 'Unable to fetch competitor data'
    };
  }
};

// Download Pitch Service
export const downloadPitch = async (pitchContent, businessName) => {
  try {
    const response = await fetch(`${BACKEND_API_ENDPOINT}/download-pitch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pitchContent,
        businessName
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    // Get the response as text
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pitch.txt`;
    
    // Append link to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading pitch:', error);
    throw error;
  }
};

// Export models for use in other components
export { MODELS }; 