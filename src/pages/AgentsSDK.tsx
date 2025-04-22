
import React from 'react';
import Layout from '../components/layout/Layout';
import Breadcrumbs from '../components/common/Breadcrumbs';
import TableOfContents from '../components/common/TableOfContents';
import CodeBlock from '../components/common/CodeBlock';
import InfoPanel from '../components/common/InfoPanel';

const AgentsSDK = () => {
  return (
    <Layout>
      <div className="flex">
        <div className="flex-1">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold mb-6">OpenAI Agents SDK</h1>
          
          <p className="text-gray-700 mb-6">
            The OpenAI Agents SDK provides a powerful framework for building, orchestrating,
            and managing complex AI agents. This Python-based SDK simplifies the creation of
            enterprise-grade applications with OpenAI's 2025 models and tools.
          </p>

          <section className="mb-8">
            <h2 id="installation" className="text-2xl font-semibold mb-4">Installation & Setup</h2>
            <p className="mb-4">
              Installing the Agents SDK is straightforward using pip:
            </p>
            
            <CodeBlock 
              language="bash" 
              code={`pip install openai-agents`}
            />
            
            <p className="mt-4 mb-4">
              After installation, set up your environment with your OpenAI API key:
            </p>
            
            <CodeBlock 
              language="python" 
              code={`import os
from openai import OpenAI
from openai_agents import Agent, Runner

# Set your API key
os.environ["OPENAI_API_KEY"] = "your-api-key"

# Initialize the client
client = OpenAI()`}
            />
            
            <InfoPanel type="tip" title="Secure Key Management">
              In production environments, store your API key securely using environment variables,
              a secrets manager like Supabase Vault, or your cloud provider's secret management service.
              Never hardcode API keys in your source code.
            </InfoPanel>
          </section>

          <section className="mb-8">
            <h2 id="agent-class" className="text-2xl font-semibold mb-4">Agent Class</h2>
            <p className="mb-4">
              The Agent class is the core building block for creating specialized AI assistants:
            </p>
            
            <CodeBlock 
              language="python" 
              code={`from openai_agents import Agent
from openai_agents.tools import FileSearchTool

# Create a basic agent
agent = Agent(
    name="TenderAnalyzer",
    instructions="""You are an expert at analyzing tender documents. 
    Extract key requirements and suggest appropriate responses.""",
    model="gpt-4o",  # Model selection
    tools=[FileSearchTool()],  # Tools the agent can use
    tool_resources={"file_search": {"vector_store_ids": ["vs_123"]}}
)

# Optionally configure additional parameters
advanced_agent = Agent(
    name="ComplianceChecker",
    instructions="You verify tender responses for compliance with requirements.",
    model="o1",  # Using the most advanced model
    tools=[custom_compliance_tool],
    output_type=ComplianceReport,  # Pydantic model for structured output
    input_guardrails=[validate_input],
    output_guardrails=[validate_compliance]
)`}
            />
            
            <p className="mt-4">
              Key Agent parameters include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>name:</strong> Descriptive identifier for the agent</li>
              <li><strong>instructions:</strong> Detailed prompt that guides the agent's behavior</li>
              <li><strong>model:</strong> The OpenAI model to use (e.g., "gpt-4o", "o1")</li>
              <li><strong>tools:</strong> List of tools available to the agent</li>
              <li><strong>tool_resources:</strong> Configuration for tool access (e.g., vector store IDs)</li>
              <li><strong>output_type:</strong> Pydantic model for structured output (optional)</li>
              <li><strong>input/output_guardrails:</strong> Functions for validating inputs/outputs (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 id="runner-class" className="text-2xl font-semibold mb-4">Runner Class</h2>
            <p className="mb-4">
              The Runner class executes agents and manages their interactions:
            </p>
            
            <CodeBlock 
              language="python" 
              code={`from openai_agents import Agent, Runner

# Create an agent
agent = Agent(
    name="TenderDrafter",
    instructions="You draft responses to tender requirements.",
    model="gpt-4o"
)

# Initialize the runner
runner = Runner(agent)

# Run synchronously with a prompt
result = runner.run_sync("Draft a response to this tender requirement: [requirement text]")
print(result.output)  # Final agent output
print(result.trace)   # Full execution trace for debugging

# Run asynchronously (for long-running tasks)
async def process_tender():
    result = await runner.run("Analyze this complex tender document.")
    return result.output

# Access tool calls from the trace
for step in result.trace:
    if step.step_type == "tool_calls":
        print(f"Tool called: {step.tool_calls[0].name}")
        print(f"Tool input: {step.tool_calls[0].input}")
        print(f"Tool output: {step.tool_calls[0].output}")`}
            />
            
            <InfoPanel type="info" title="Tool Execution">
              When an agent calls a tool (decorated with @function_tool), the Runner automatically executes
              the Python function and provides the result back to the agent. Your application code does not
              need to handle this tool execution flow - it's managed by the SDK.
            </InfoPanel>
          </section>

          <section className="mb-8">
            <h2 id="function-tools" className="text-2xl font-semibold mb-4">Function Tools</h2>
            <p className="mb-4">
              Custom function tools extend agent capabilities with your code:
            </p>
            
            <CodeBlock 
              language="python" 
              code={`from openai_agents import function_tool
import docx
from typing import List, Dict, Any

@function_tool
def parse_tender_pdf(file_path: str) -> Dict[str, Any]:
    """
    Extract structured content from a tender PDF document.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Dictionary containing extracted sections, requirements, and metadata
    """
    # Implementation for PDF parsing
    # (Using appropriate PDF library)
    return {
        "title": "Highway Maintenance Tender",
        "requirements": [
            {"id": "R1", "text": "Minimum 5 years experience"},
            {"id": "R2", "text": "ISO 9001 certification required"}
        ],
        "deadline": "2025-06-30"
    }

@function_tool
def generate_response_docx(template_path: str, content: Dict[str, Any], output_path: str) -> str:
    """
    Generate a formatted response document using a template.
    
    Args:
        template_path: Path to the DOCX template
        content: Dictionary containing section content
        output_path: Path to save the output file
        
    Returns:
        Path to the generated document
    """
    doc = docx.Document(template_path)
    
    # Fill the template with content
    for paragraph in doc.paragraphs:
        for key, value in content.items():
            if f"{{{{ {key} }}}}" in paragraph.text:
                paragraph.text = paragraph.text.replace(f"{{{{ {key} }}}}", value)
    
    doc.save(output_path)
    return output_path

# Use with an agent
agent = Agent(
    name="TenderResponseGenerator",
    instructions="You create responses to tender requirements.",
    model="gpt-4o",
    tools=[parse_tender_pdf, generate_response_docx]
)`}
            />
            
            <p className="mt-4 mb-4">
              The @function_tool decorator automatically:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Converts Python function signatures to OpenAI function schemas</li>
              <li>Uses docstrings to provide descriptions to the agent</li>
              <li>Handles type conversions between Python and JSON</li>
              <li>Manages function execution when called by the agent</li>
            </ul>
            
            <InfoPanel type="warning" title="Error Handling">
              Always implement robust error handling in your function tools. The Runner
              will propagate exceptions from tool execution, which can interrupt your agent's
              workflow if not properly caught and handled.
            </InfoPanel>
          </section>

          <section className="mb-8">
            <h2 id="handoffs" className="text-2xl font-semibold mb-4">Handoffs & Multi-Agent Workflows</h2>
            <p className="mb-4">
              For complex workflows, you can orchestrate multiple specialized agents:
            </p>
            
            <CodeBlock 
              language="python" 
              code={`from openai_agents import Agent, Runner, handoff_to

# Define specialized agents
parser_agent = Agent(
    name="TenderParser",
    instructions="Extract structured information from tender documents.",
    model="gpt-4o",
    tools=[parse_tender_pdf]
)

drafter_agent = Agent(
    name="ResponseDrafter",
    instructions="Draft detailed responses to tender requirements.",
    model="o1",
    tools=[retrieve_company_experience, retrieve_compliance_info]
)

formatter_agent = Agent(
    name="ResponseFormatter",
    instructions="Format responses according to tender guidelines.",
    model="gpt-4o-mini",
    tools=[generate_response_docx]
)

# Implement a handoff function
@handoff_to(drafter_agent)
def handoff_to_drafter(parsed_tender):
    return f"Generate responses for the following tender requirements: {parsed_tender}"

@handoff_to(formatter_agent)
def handoff_to_formatter(drafted_responses):
    return f"Format these drafted responses into a final document: {drafted_responses}"

# Orchestrate the workflow
def process_tender_workflow(tender_path):
    # Step 1: Parse the tender
    parser_runner = Runner(parser_agent)
    parse_result = parser_runner.run_sync(f"Parse this tender document: {tender_path}")
    parsed_data = parse_result.output
    
    # Step 2: Draft responses (handled by handoff)
    draft_result = handoff_to_drafter(parsed_data)
    
    # Step 3: Format the response (handled by handoff)
    final_result = handoff_to_formatter(draft_result.output)
    
    return final_result.output`}
            />
            
            <InfoPanel type="tip" title="Agent Specialization">
              Design each agent with a specific, focused responsibility rather than creating
              one complex agent. This improves performance, makes debugging easier, and allows
              you to select the most appropriate model for each task (e.g., using more powerful
              models only where needed).
            </InfoPanel>
          </section>
        </div>
        <TableOfContents />
      </div>
    </Layout>
  );
};

export default AgentsSDK;
