document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input');
    const chatOutput = document.getElementById('chat-output');
    const codeSelector = document.getElementById('code-type-selector');
    const codeBlock = document.getElementById('python-code-block');
    const examplePrompts = document.querySelectorAll('.example-prompt');
    const processingSteps = document.getElementById('processing-steps');

    // Initial state
    const initialWelcome = `<div class="text-muted"><i class="fas fa-comments me-2"></i>Chat history will appear here... Try an example prompt above!</div>`;
    chatOutput.innerHTML = initialWelcome;

    // Example prompts with detailed responses
    const exampleResponses = {
        "Hello! How are you?": {
            reply: "Hello! I'm doing great, thank you for asking! I'm an AI assistant powered by a Flowise workflow. How can I help you today?",
            steps: [
                "Input received: 'Hello! How are you?'",
                "Processing greeting intent with LLM",
                "Generating friendly response",
                "Output formatted and returned"
            ],
            nodeFlow: ['input-node', 'llm-node', 'output-node']
        },
        "What's the weather like in London?": {
            reply: "I'd love to help you with the weather in London! In a real Flowise workflow, I would connect to a weather API to get current conditions. For demonstration purposes, let's say it's currently 18°C and partly cloudy in London.",
            steps: [
                "Input received: Weather query for London",
                "Detected location: London",
                "Would call weather API tool",
                "Formatting weather response",
                "Returning formatted weather data"
            ],
            nodeFlow: ['input-node', 'tools-node', 'llm-node', 'output-node']
        },
        "Explain machine learning in simple terms": {
            reply: "Machine learning is like teaching a computer to learn patterns from examples, just like how you learned to recognize cats by seeing many cat pictures. The computer looks at lots of data, finds patterns, and then uses those patterns to make predictions or decisions about new data it hasn't seen before.",
            steps: [
                "Input received: Request for ML explanation",
                "Analyzing complexity level needed",
                "Accessing knowledge base",
                "Generating simple explanation",
                "Structuring response for clarity"
            ],
            nodeFlow: ['input-node', 'memory-node', 'llm-node', 'output-node']
        },
        "Write a Python function to sort a list": {
            reply: "Here's a simple Python function to sort a list:\\n\\n```python\\ndef sort_list(my_list):\\n    return sorted(my_list)\\n\\n# Example usage:\\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\\nsorted_numbers = sort_list(numbers)\\nprint(sorted_numbers)  # Output: [1, 1, 2, 3, 4, 5, 6, 9]\\n```",
            steps: [
                "Input received: Code request for sorting",
                "Identified programming language: Python",
                "Generating code solution",
                "Adding example usage",
                "Formatting code response"
            ],
            nodeFlow: ['input-node', 'llm-node', 'output-node']
        }
    };

    // Handle example prompt clicks
    examplePrompts.forEach(button => {
        button.addEventListener('click', function() {
            const prompt = this.dataset.prompt;
            chatInput.value = prompt;
            handleMessage(prompt);
        });
    });

    // Handle chat form submission
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        chatInput.value = '';
        await handleMessage(message);
    });

    // Main message handling function
    async function handleMessage(message) {
        // Add user message to chat
        appendMessage('user', message);
        chatInput.disabled = true;

        // Show typing indicator
        const typingIndicator = appendMessage('bot', '<i class="fas fa-spinner fa-spin"></i> Processing...');

        // Reset workflow visualization
        resetWorkflowVisualization();

        try {
            // Check if it's an example prompt
            const exampleResponse = exampleResponses[message];
            
            if (exampleResponse) {
                // Simulate workflow processing with example response
                await simulateWorkflowProcessing(exampleResponse, typingIndicator);
            } else {
                // Handle custom message via API
                const response = await fetch('/api/flowise-demo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                const data = await response.json();
                
                // Simulate workflow with API response
                await simulateWorkflowProcessing({
                    reply: data.reply,
                    steps: data.steps || ["Processing input", "Generating response", "Formatting output"],
                    nodeFlow: ['input-node', 'llm-node', 'output-node']
                }, typingIndicator);
            }
        } catch (error) {
            typingIndicator.innerHTML = `<strong>Bot:</strong> <span class="text-danger">Error: Could not process your request. Please try again.</span>`;
            console.error('Demo error:', error);
        } finally {
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // Simulate workflow processing with visual feedback
    async function simulateWorkflowProcessing(responseData, typingIndicator) {
        const { reply, steps, nodeFlow } = responseData;
        
        // Clear and populate processing steps
        processingSteps.innerHTML = '';
        
        // Add steps to the UI
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'list-group-item';
            stepElement.innerHTML = `<i class="fas fa-circle me-2"></i> ${step}`;
            processingSteps.appendChild(stepElement);
        });

        // Animate workflow nodes
        for (let i = 0; i < nodeFlow.length; i++) {
            const nodeId = nodeFlow[i];
            const node = document.getElementById(nodeId);
            const stepElement = processingSteps.children[i];
            
            if (node) {
                // Activate node
                node.classList.add('active');
                
                // Activate corresponding step
                if (stepElement) {
                    stepElement.classList.add('active');
                }
                
                // Animate arrow if not last node
                if (i < nodeFlow.length - 1) {
                    const arrowId = `arrow-${i + 1}`;
                    const arrow = document.getElementById(arrowId);
                    if (arrow) {
                        setTimeout(() => {
                            arrow.classList.add('active');
                        }, 300);
                    }
                }
                
                // Wait before next step
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Mark as completed
                node.classList.remove('active');
                node.classList.add('completed');
                
                if (stepElement) {
                    stepElement.classList.remove('active');
                    stepElement.classList.add('completed');
                }
            }
        }
        
        // Update typing indicator with final response
        setTimeout(() => {
            typingIndicator.innerHTML = `<strong>Bot:</strong> ${reply.replace(/\\n/g, '<br>')}`;
        }, 300);
    }

    // Reset workflow visualization
    function resetWorkflowVisualization() {
        // Reset all nodes
        document.querySelectorAll('.workflow-node').forEach(node => {
            node.classList.remove('active', 'processing', 'completed');
        });
        
        // Reset all arrows
        document.querySelectorAll('.workflow-arrow').forEach(arrow => {
            arrow.classList.remove('active');
        });
        
        // Reset processing steps
        processingSteps.innerHTML = '<div class="list-group-item bg-transparent text-muted"><i class="fas fa-spinner fa-spin me-2"></i>Processing...</div>';
    }

    // Append message to chat
    function appendMessage(sender, text) {
        if (chatOutput.innerHTML === initialWelcome) {
            chatOutput.innerHTML = ''; // Clear initial message
        }
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('mb-3', 'p-2', 'rounded');
        
        if (sender === 'user') {
            messageDiv.classList.add('bg-primary', 'text-white', 'ms-auto');
            messageDiv.style.maxWidth = '80%';
            messageDiv.innerHTML = `<strong>You:</strong> ${text}`;
        } else {
            messageDiv.classList.add('bg-secondary');
            messageDiv.style.maxWidth = '80%';
            messageDiv.innerHTML = text;
        }
        
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
            if (typeof Prism !== 'undefined') {
                Prism.highlightElement(codeBlock);
            }
        } catch (error) {
            codeBlock.textContent = '# Error loading code. Please try again.';
            console.error('Code playground error:', error);
        }
    }

    // Initial load for the code playground
    updateCode(codeSelector.value);
});
    
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
