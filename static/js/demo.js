// Code examples for different workflow types
const codeExamples = {
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
import requests

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
};

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
            // Clear the input first, then set the new prompt
            chatInput.value = '';
            chatInput.focus();
            
            // Simulate typing effect
            setTimeout(() => {
                chatInput.value = prompt;
                chatInput.focus();
            }, 100);
            
            // Auto-submit after a short delay to allow user to see the text
            setTimeout(() => {
                handleMessage(prompt);
            }, 500);
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
        if (processingSteps) {
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
        if (processingSteps) {
            processingSteps.innerHTML = '<div class="list-group-item bg-transparent text-muted"><i class="fas fa-spinner fa-spin me-2"></i>Processing...</div>';
        }
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
    if (codeSelector && codeBlock) {
        codeSelector.addEventListener('change', function() {
            const type = this.value;
            updateCode(type);
        });

        function updateCode(type) {
            try {
                // Use local code examples instead of API call
                const code = codeExamples[type] || codeExamples.basic;
                codeBlock.textContent = code;
                
                // Re-highlight the block if Prism is available
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
    }
});
