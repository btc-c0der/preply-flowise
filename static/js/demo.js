// Demo page functionality

let currentWorkflowType = 'basic';
let isProcessing = false;
let animationSpeed = 3;

// Code examples for different workflow types
const codeExamples = {
    python: {
        basic: `# Basic LLM Chain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

llm = OpenAI(temperature=0.7)
prompt = PromptTemplate(
    input_variables=["question"],
    template="Answer this question: {question}"
)

def ask_question(question):
    formatted_prompt = prompt.format(question=question)
    response = llm(formatted_prompt)
    return response`,
        
        rag: `# RAG (Retrieval Augmented Generation)
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# Load documents and create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(documents, embeddings)

# Create RAG chain
llm = OpenAI(temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

def ask_with_context(question):
    return qa_chain.run(question)`,
    
        agent: `# Agent with Tools
from langchain.agents import Tool, AgentExecutor, initialize_agent
from langchain.llms import OpenAI

def weather_tool(location):
    # Mock weather API call
    return f"The weather in {location} is sunny, 72°F"

def calculator_tool(expression):
    try:
        return str(eval(expression))
    except:
        return "Invalid expression"

tools = [
    Tool(name="Weather", func=weather_tool, description="Get weather for a location"),
    Tool(name="Calculator", func=calculator_tool, description="Calculate math expressions")
]

llm = OpenAI(temperature=0)
agent = initialize_agent(tools, llm, agent="zero-shot-react-description")

def run_agent(query):
    return agent.run(query)`
    },
    
    javascript: {
        basic: `// Basic LLM Chain (Node.js)
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');

const llm = new OpenAI({ temperature: 0.7 });
const prompt = PromptTemplate.fromTemplate(
    "Answer this question: {question}"
);

async function askQuestion(question) {
    const formattedPrompt = await prompt.format({ question });
    const response = await llm.call(formattedPrompt);
    return response;
}`,
        
        rag: `// RAG Implementation (Node.js)
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { FaissStore } = require('langchain/vectorstores/faiss');
const { RetrievalQAChain } = require('langchain/chains');
const { OpenAI } = require('langchain/llms/openai');

async function createRAGChain(documents) {
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
    
    const llm = new OpenAI({ temperature: 0 });
    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
    
    return chain;
}

async function askWithContext(chain, question) {
    const response = await chain.call({ query: question });
    return response.text;
}`,
        
        agent: `// Agent Implementation (Node.js)
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { OpenAI } = require('langchain/llms/openai');
const { DynamicTool } = require('langchain/tools');

const weatherTool = new DynamicTool({
    name: "Weather",
    description: "Get weather for a location",
    func: async (location) => {
        return \`The weather in \${location} is sunny, 72°F\`;
    }
});

const calculatorTool = new DynamicTool({
    name: "Calculator", 
    description: "Calculate math expressions",
    func: async (expression) => {
        try {
            return eval(expression).toString();
        } catch {
            return "Invalid expression";
        }
    }
});

async function createAgent() {
    const llm = new OpenAI({ temperature: 0 });
    const tools = [weatherTool, calculatorTool];
    
    const executor = await initializeAgentExecutorWithOptions(tools, llm, {
        agentType: "zero-shot-react-description"
    });
    
    return executor;
}`
    },
    
    flowise: {
        basic: `{
  "nodes": [
    {
      "id": "chatOpenAI_0",
      "position": { "x": 300, "y": 200 },
      "type": "customNode",
      "data": {
        "id": "chatOpenAI_0",
        "label": "ChatOpenAI",
        "name": "chatOpenAI",
        "type": "ChatOpenAI",
        "baseClasses": ["ChatOpenAI", "BaseChatModel"],
        "inputs": {
          "temperature": 0.7,
          "modelName": "gpt-3.5-turbo"
        }
      }
    },
    {
      "id": "promptTemplate_0", 
      "position": { "x": 100, "y": 200 },
      "type": "customNode",
      "data": {
        "id": "promptTemplate_0",
        "label": "Prompt Template",
        "name": "promptTemplate",
        "type": "PromptTemplate",
        "inputs": {
          "template": "Answer this question: {question}",
          "inputVariables": ["question"]
        }
      }
    }
  ],
  "edges": [
    {
      "source": "promptTemplate_0",
      "sourceHandle": "promptTemplate_0-output-promptTemplate-PromptTemplate",
      "target": "chatOpenAI_0", 
      "targetHandle": "chatOpenAI_0-input-prompt-BasePromptTemplate",
      "type": "buttonedge",
      "id": "promptTemplate_0-chatOpenAI_0"
    }
  ]
}`,
        
        rag: `{
  "nodes": [
    {
      "id": "retriever_0",
      "position": { "x": 100, "y": 100 },
      "type": "customNode", 
      "data": {
        "id": "retriever_0",
        "label": "Vector Store Retriever",
        "name": "retriever",
        "type": "VectorStoreRetriever",
        "inputs": {
          "vectorStore": "pinecone_0",
          "k": 4
        }
      }
    },
    {
      "id": "retrievalQAChain_0",
      "position": { "x": 400, "y": 200 },
      "type": "customNode",
      "data": {
        "id": "retrievalQAChain_0", 
        "label": "Retrieval QA Chain",
        "name": "retrievalQAChain",
        "type": "RetrievalQAChain",
        "inputs": {
          "model": "chatOpenAI_0",
          "vectorStoreRetriever": "retriever_0"
        }
      }
    }
  ]
}`,
        
        agent: `{
  "nodes": [
    {
      "id": "agent_0",
      "position": { "x": 400, "y": 200 },
      "type": "customNode",
      "data": {
        "id": "agent_0",
        "label": "Agent Executor", 
        "name": "agentExecutor",
        "type": "AgentExecutor",
        "inputs": {
          "model": "chatOpenAI_0",
          "tools": ["weatherTool_0", "calculatorTool_0"],
          "agentType": "zero-shot-react-description"
        }
      }
    },
    {
      "id": "weatherTool_0",
      "position": { "x": 100, "y": 100 },
      "type": "customNode",
      "data": {
        "id": "weatherTool_0",
        "label": "Weather Tool",
        "name": "weatherTool", 
        "type": "CustomTool",
        "inputs": {
          "name": "Weather",
          "description": "Get weather for a location"
        }
      }
    }
  ]
}`
    }
};

// Initialize demo page
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input');
    const chatOutput = document.getElementById('chat-output');
    const codeSelector = document.getElementById('code-type-selector');
    const codeBlock = document.getElementById('python-code-block');

    // Initial state
    const initialWelcome = `<div class="text-white-50">Chat history will appear here...</div>`;
    chatOutput.innerHTML = initialWelcome;

    // --- Flowise Chat Demo ---
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        appendMessage('user', message);
        chatInput.value = '';
        chatInput.disabled = true;

        // Show typing indicator
        const typingIndicator = appendMessage('bot', '...');

        try {
            const response = await fetch('/api/flowise-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            const data = await response.json();
            
            // Update typing indicator with actual response
            typingIndicator.innerHTML = `<strong>Bot:</strong> ${data.reply}`;

        } catch (error) {
            typingIndicator.innerHTML = `<strong>Bot:</strong> Error: Could not connect to the demo API.`;
            console.error('Flowise demo error:', error);
        } finally {
            chatInput.disabled = false;
            chatInput.focus();
        }
    });

    function appendMessage(sender, text) {
        if (chatOutput.innerHTML === initialWelcome) {
            chatOutput.innerHTML = ''; // Clear initial message
        }
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('mb-2');
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong> ${text}`;
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
        return messageDiv;
    }

    // --- Python Code Playground ---
    codeSelector.addEventListener('change', async function() {
        const type = this.value;
        updateCode(type);
    });

    async function updateCode(type) {
        try {
            const response = await fetch('/api/code-playground', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: type })
            });
            const data = await response.json();
            codeBlock.textContent = data.code;
            // Re-highlight the block
            Prism.highlightElement(codeBlock);
        } catch (error) {
            codeBlock.textContent = '# Error loading code. Please try again.';
            console.error('Code playground error:', error);
        }
    }

    // Initial load for the code playground
    updateCode(codeSelector.value);
});
