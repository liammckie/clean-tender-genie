
import React from 'react';
import Layout from '../components/layout/Layout';
import Breadcrumbs from '../components/common/Breadcrumbs';
import TableOfContents from '../components/common/TableOfContents';
import CodeBlock from '../components/common/CodeBlock';
import InfoPanel from '../components/common/InfoPanel';

const APIFeatures = () => {
  return (
    <Layout>
      <div className="flex">
        <div className="flex-1">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold mb-6">OpenAI 2025 API Features</h1>
          
          <p className="text-gray-700 mb-6">
            The OpenAI 2025 API provides a comprehensive suite of capabilities for building 
            enterprise-grade AI applications. This documentation covers the key components 
            and features of the API landscape.
          </p>

          <section className="mb-8">
            <h2 id="models" className="text-2xl font-semibold mb-4">Available Models</h2>
            <p className="mb-4">
              OpenAI offers several models optimized for different use cases and performance requirements:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>o1:</strong> Flagship model for complex reasoning and advanced analysis</li>
              <li><strong>o3-mini:</strong> Compact model for specific domain tasks</li>
              <li><strong>GPT-4.5:</strong> Enhanced version with improved reasoning capabilities</li>
              <li><strong>GPT-4o:</strong> Best overall balance of capabilities and performance</li>
              <li><strong>GPT-4o-mini:</strong> Cost-effective version for simpler tasks</li>
            </ul>
            
            <InfoPanel type="info" title="Model Selection">
              Select the most appropriate model based on your specific task requirements. For complex 
              compliance analysis or reasoning tasks, o1 may be ideal. For general content generation,
              GPT-4o offers the best balance of quality and cost.
            </InfoPanel>
          </section>

          <section className="mb-8">
            <h2 id="pricing" className="text-2xl font-semibold mb-4">Pricing Structure</h2>
            <p className="mb-4">
              OpenAI 2025 API has a multi-component pricing structure:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Token-based pricing:</strong> Varies by model (input and output tokens)</li>
              <li><strong>Tool usage:</strong> Additional costs for tool calls (e.g., FileSearch)</li>
              <li><strong>Storage:</strong> Fees for vector store data retention</li>
              <li><strong>Fine-tuning:</strong> Custom model training costs</li>
            </ul>
            
            <InfoPanel type="tip" title="Cost Optimization">
              Monitor your usage patterns and optimize prompt lengths to reduce token consumption. 
              Consider using the Batch API for non-interactive workloads to benefit from potential discounts.
            </InfoPanel>
          </section>

          <section className="mb-8">
            <h2 id="tools" className="text-2xl font-semibold mb-4">Built-in Tools</h2>
            <p className="mb-4">
              The API provides several built-in tools that extend model capabilities:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>WebSearch:</strong> Access to internet search results</li>
              <li><strong>FileSearchTool:</strong> Search vector stores for relevant information</li>
              <li><strong>ComputerTool:</strong> Execute code in a sandboxed environment</li>
              <li><strong>Code Interpreter:</strong> Generate and execute code for complex tasks</li>
              <li><strong>Function Calling:</strong> Call external functions using @function_tool decorator</li>
            </ul>
            
            <CodeBlock 
              language="python" 
              code={`from openai_agents import Agent, Runner, function_tool

@function_tool
def fetch_compliance_data(industry: str, region: str) -> dict:
    """
    Fetches compliance requirements for a specific industry and region.
    
    Args:
        industry: The industry sector (e.g., 'cleaning', 'healthcare')
        region: The geographical region (e.g., 'australia', 'europe')
        
    Returns:
        A dictionary containing compliance requirements
    """
    # Implementation details
    return {"requirements": [...]}

# Use the tool with an Agent
agent = Agent(
    name="ComplianceBot",
    instructions="You analyze and extract compliance requirements.",
    model="gpt-4o",
    tools=[fetch_compliance_data]
)

runner = Runner(agent)
result = runner.run_sync("What are the cleaning industry requirements for Australia?")`}
            />
          </section>

          <section className="mb-8">
            <h2 id="vector-stores" className="text-2xl font-semibold mb-4">Vector Stores & Embeddings</h2>
            <p className="mb-4">
              Vector stores provide efficient knowledge retrieval capabilities:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Create and manage vector stores via API</li>
              <li>Upload and process files for semantic search</li>
              <li>Retrieve context-relevant information during agent execution</li>
              <li>Integrate with FileSearchTool for agents to access knowledge</li>
            </ul>
            
            <CodeBlock 
              language="python" 
              code={`# Create a vector store
vector_store = client.beta.vector_stores.create(
    name="cleaning_procedures"
)

# Upload files to the vector store
file_upload = client.beta.vector_stores.files.create(
    vector_store_id=vector_store.id,
    file=open("procedures.pdf", "rb")
)

# Poll for processing completion
while True:
    file_status = client.beta.vector_stores.files.retrieve(
        vector_store_id=vector_store.id,
        file_id=file_upload.id
    )
    if file_status.status == "complete":
        break
    time.sleep(1)

# Use with an Agent via FileSearchTool
from openai_agents.tools import FileSearchTool

agent = Agent(
    name="KnowledgeBot",
    instructions="You help answer questions about cleaning procedures.",
    model="gpt-4o",
    tools=[FileSearchTool()],
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}}
)`}
            />
          </section>

          <section className="mb-8">
            <h2 id="guardrails" className="text-2xl font-semibold mb-4">Guardrails</h2>
            <p className="mb-4">
              Guardrails provide safety and compliance controls for model outputs:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Input guardrails:</strong> Validate and filter user inputs</li>
              <li><strong>Output guardrails:</strong> Ensure responses meet compliance requirements</li>
              <li><strong>Content filtering:</strong> Block inappropriate content</li>
              <li><strong>Moderation API:</strong> Additional tools for content moderation</li>
            </ul>
            
            <InfoPanel type="warning" title="Security Consideration">
              Always implement appropriate guardrails when deploying AI systems in enterprise 
              environments, especially for systems handling sensitive information or making 
              high-impact decisions.
            </InfoPanel>
          </section>

          <section className="mb-8">
            <h2 id="orchestration" className="text-2xl font-semibold mb-4">Orchestration</h2>
            <p className="mb-4">
              The Agents SDK provides tools for orchestrating complex AI workflows:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Agents:</strong> Define specialized AI assistants with specific capabilities</li>
              <li><strong>Runners:</strong> Execute and manage agent interactions</li>
              <li><strong>Handoffs:</strong> Transfer context between specialized agents</li>
              <li><strong>Tracing:</strong> Monitor and debug agent behavior</li>
            </ul>
            
            <p className="mb-4">
              Learn more about orchestration in the <a href="/agents-sdk" className="text-primary hover:underline">Agents SDK</a> section.
            </p>
          </section>
        </div>
        <TableOfContents />
      </div>
    </Layout>
  );
};

export default APIFeatures;
