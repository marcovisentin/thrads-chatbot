# React ChatBot with Mistral Integration 

Thrads is an ad platform designed to help chatbot developers monetize their AI-driven products while enabling advertisers to engage users with meaningful, context-aware ads. By integrating our API, developers can effortlessly add ads to their chatbots without disrupting the user experience. Advertisers can run hyper-targeted campaigns based on conversational context, making the ads feel natural and relevant.

This repository is a demo where a Mistral Wrapper chatbot calls the Thrads API to deliver hyper-targeted ads during conversations. It also allows users to configure their preferred ad settings for a more tailored experience.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Mistral API key 
- Thrads API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```
   REACT_APP_MISTRAL_API_KEY=your_openai_api_key
   ```
   and
   ```
   REACT_APP_THRADS_API_KEY=your_thrads_api_key
   ```
4. Launch:
  ```bash
   npm start
   ```
If you want to obtain an API key, email us at contact@thrads.us and visit our website at https://thrads.us. We will soon launch our platform where developers can obtain their API keys, monitor monetization, and advertisers can set up their campaigns.
