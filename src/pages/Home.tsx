
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-6">OpenAI 2025 Enterprise Integration Knowledge Base</h1>
        
        <p className="text-lg mb-8">
          Welcome to the comprehensive documentation for implementing enterprise-grade OpenAI 2025 agents 
          with Lovable.dev integration. This knowledge base contains detailed information about the OpenAI 
          2025 API features, the Agents SDK, architecture patterns, best practices, and integration guides.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">API Features</h2>
            <p className="text-gray-600 mb-4">
              Explore the OpenAI 2025 API landscape including models, pricing, tools, guardrails, and vector stores.
            </p>
            <Link to="/api-features" className="text-primary hover:underline font-medium">
              Learn more →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Agents SDK</h2>
            <p className="text-gray-600 mb-4">
              Learn how to use the Python Agents SDK including @function_tool, Agent, Runner, and handoffs.
            </p>
            <Link to="/agents-sdk" className="text-primary hover:underline font-medium">
              Learn more →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Architecture</h2>
            <p className="text-gray-600 mb-4">
              Review reference architectures for building tender-writing agents and other enterprise applications.
            </p>
            <Link to="/architecture" className="text-primary hover:underline font-medium">
              Learn more →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Best Practices</h2>
            <p className="text-gray-600 mb-4">
              Follow enterprise best practices for security, rate limits, error handling, cost optimization, and more.
            </p>
            <Link to="/best-practices" className="text-primary hover:underline font-medium">
              Learn more →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Lovable Integration</h2>
            <p className="text-gray-600 mb-4">
              Integrate OpenAI agents with Lovable.dev, including frontend components and backend services.
            </p>
            <Link to="/integration" className="text-primary hover:underline font-medium">
              Learn more →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <p className="text-gray-600 mb-4">
              Follow our step-by-step implementation guide to build your first enterprise-grade agent.
            </p>
            <Link to="/getting-started" className="text-primary hover:underline font-medium">
              Learn more →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
