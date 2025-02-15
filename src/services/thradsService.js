const API_URL = 'https://api.thrads.us';
const API_KEY = process.env.REACT_APP_THRADS_API_KEY;

// Function to get or create a unique user ID for the session
const getUserId = () => {
  let userId = sessionStorage.getItem('userId');
  if (!userId) {
    userId = Math.floor(Math.random() * 1000) + Date.now(); // Combines timestamp with random number
    sessionStorage.setItem('userId', userId);
  }
  return userId;
}

export const getRecommendation = async (userMessage, botMessage, settings) => {
    try {

      const payload = {
        userId: getUserId(),
        userRegion: 'US', // You might want to make this dynamic
        content: {
          user: userMessage,
          chatbot: botMessage
        },
        force: settings.force,
        conversationOffset: settings.conversationOffset,
        adFrequencyLimit: settings.adFrequencyLimit
      };
      
      console.log('Request Payload:', JSON.stringify(payload)); 

      // Define headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Thrads-Api-Key': API_KEY
      };

      console.log('Headers:', headers);

      const response = await fetch(`${API_URL}/developer/serve-ad/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        return {
          ad: true,
          creative: data.data.creative,
          prod_name: data.data.prod_name,
          price: data.data.price,
          currency: data.data.currency,
          imgUrl: data.data.img_url,
          url: data.data.prod_url
        };
      }
      
      return { ad: false };
      
    } catch (error) {
      console.error('Error:', error);
      return { ad: false };
    }
};