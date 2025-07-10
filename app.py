from flask import Flask, render_template, request, jsonify
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Sample educational content (replace with DB later)
TOOL_DATA = [
    {
        'name': 'Flowise',
        'type': 'Visual Builder',
        'description': 'Drag-and-drop interface for building LLM workflows',
        'best_for': 'Rapid prototyping, non-technical users',
        'difficulty': 'Low',
        'pros': ['Visual interface', 'No coding required', 'Quick setup'],
        'cons': ['Limited customization', 'Newer tool', 'Less community']
    },
    {
        'name': 'LangChain',
        'type': 'Development Framework',
        'description': 'Programmatic approach to chain LLM components',
        'best_for': 'Developers, complex applications',
        'difficulty': 'High',
        'pros': ['Highly customizable', 'Large community', 'Production ready'],
        'cons': ['Steep learning curve', 'Requires coding', 'Complex setup']
    },
    {
        'name': 'HuggingFace Transformers',
        'type': 'ML Library',
        'description': 'Pre-trained models and fine-tuning capabilities',
        'best_for': 'Model experimentation, research',
        'difficulty': 'Medium',
        'pros': ['Extensive model library', 'Research backed', 'Active community'],
        'cons': ['Requires ML knowledge', 'Resource intensive', 'Model complexity']
    }
]

TUTORIALS = [
    {
        'id': 1,
        'title': 'Building Your First Chatbot with Flowise',
        'description': 'Learn to create a simple Q&A chatbot using Flowise visual interface',
        'level': 'Beginner',
        'duration': '30 minutes',
        'steps': [
            'Set up Flowise environment and access the visual builder',
            'Drag a Chat Model component (OpenAI GPT-3.5) to the canvas',
            'Add a Prompt Template node with a custom greeting system',
            'Connect a Memory Buffer to maintain conversation context',
            'Configure API keys securely in the environment settings',
            'Test the workflow using the built-in chat interface',
            'Deploy your chatbot as a web endpoint for public access'
        ],
        'detailed_steps': [
            {
                'title': 'Environment Setup',
                'description': 'Get started with Flowise by setting up your development environment.',
                'content': 'Install Flowise using npm or Docker, then launch the web interface at localhost:3000. You\'ll see the visual canvas where you can drag and drop components.',
                'tips': ['Use Docker for easier setup', 'Ensure Node.js 18+ is installed', 'Check firewall settings for port 3000']
            },
            {
                'title': 'Add Chat Model',
                'description': 'Configure the AI model that will power your chatbot.',
                'content': 'From the component library, drag the "ChatOpenAI" node to your canvas. This will be the brain of your chatbot.',
                'tips': ['Choose GPT-3.5-turbo for cost efficiency', 'Set temperature to 0.7 for balanced responses', 'Configure max tokens to control response length']
            },
            {
                'title': 'Design Prompt Template',
                'description': 'Create a prompt template that defines how your chatbot behaves.',
                'content': 'Add a "Prompt Template" node and configure it with a system message like: "You are a helpful assistant. Answer questions clearly and concisely."',
                'tips': ['Use clear, specific instructions', 'Include examples in your prompt', 'Test different prompt variations']
            },
            {
                'title': 'Add Memory Buffer',
                'description': 'Enable conversation memory so your chatbot remembers previous messages.',
                'content': 'Drag a "Buffer Memory" component to store conversation history. Connect it to maintain context across multiple turns.',
                'tips': ['Set appropriate memory window', 'Consider token limits', 'Clear memory when needed']
            },
            {
                'title': 'Configure API Keys',
                'description': 'Securely set up your OpenAI API credentials.',
                'content': 'In the environment settings, add your OPENAI_API_KEY. Never hardcode keys in your workflows.',
                'tips': ['Use environment variables', 'Rotate keys regularly', 'Monitor API usage']
            },
            {
                'title': 'Test Your Chatbot',
                'description': 'Use the built-in chat interface to test your workflow.',
                'content': 'Click the chat button to open the test interface. Try various questions to ensure your chatbot responds appropriately.',
                'tips': ['Test edge cases', 'Check response quality', 'Verify memory functionality']
            },
            {
                'title': 'Deploy the Workflow',
                'description': 'Make your chatbot available as a web API or embed it in applications.',
                'content': 'Use the deployment options to create a REST API endpoint or generate embed code for websites.',
                'tips': ['Test deployed version', 'Monitor performance', 'Set up usage analytics']
            }
        ]
    },
    {
        'id': 4,
        'title': 'From Visual Idea to Python Code',
        'type': 'comparison',
        'description': 'Translate a Flowise visual workflow into a Python script using LangChain. This tutorial highlights the relationship between visual builders and code-based frameworks.',
        'level': 'Intermediate',
        'duration': '1 hour',
        'flowise_steps': [
            "<strong>1. Design the Workflow:</strong> Drag a 'Chat Model', 'Prompt Template', and 'Output Parser' onto the Flowise canvas. This creates the foundation of your AI workflow.",
            "<strong>2. Configure Chat Model:</strong> Set the model to GPT-3.5-turbo, adjust temperature to 0.7 for creative responses, and configure max tokens to 150.",
            "<strong>3. Create Prompt Template:</strong> Define the prompt template as 'Tell me a joke about {topic}. Respond in JSON format with joke_setup and joke_punchline keys.' This ensures structured output.",
            "<strong>4. Add Output Parser:</strong> Configure the JSON output parser to extract structured data from the model's response, making it easier to work with programmatically.",
            "<strong>5. Connect the Flow:</strong> Link the nodes in sequence: Input → Prompt Template → Chat Model → Output Parser → Output. Each connection represents data flow.",
            "<strong>6. Test the Workflow:</strong> Use the chat interface to test with a topic like 'cats' or 'programming' and observe the JSON-formatted joke response.",
            "<strong>7. Deploy as API:</strong> Export the workflow as a REST API endpoint that can be called from any application or integrated into websites."
        ],
        'python_code': {
            'title': 'Equivalent LangChain Python Code',
            'description': 'The following script replicates the Flowise workflow programmatically with full control and customization options.',
            'code': """# Import required LangChain components
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# 1. Initialize the chat model with configuration
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.7,              # Controls creativity (0.0 = deterministic, 1.0 = very creative)
    max_tokens=150,               # Limits response length
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# 2. Define the prompt template with input variables
prompt_template = '''Tell me a joke about {topic}. 
Please respond in JSON format with the following structure:
{
    "joke_setup": "The setup of the joke",
    "joke_punchline": "The punchline of the joke",
    "topic": "The topic category"
}'''

prompt = ChatPromptTemplate.from_template(prompt_template)

# 3. Set up the JSON output parser to structure the response
parser = JsonOutputParser()

# 4. Create the chain using the pipe operator (|)
# This connects: Input -> Prompt -> Model -> Parser -> Output
chain = prompt | llm | parser

# 5. Function to generate jokes with error handling
def generate_joke(topic_input):
    try:
        result = chain.invoke({"topic": topic_input})
        return result
    except Exception as e:
        return {"error": f"Failed to generate joke: {str(e)}"}

# 6. Test the implementation
if __name__ == "__main__":
    # Test with different topics
    topics = ["cats", "programming", "coffee"]
    
    for topic in topics:
        print(f"\\n--- Joke about {topic} ---")
        joke = generate_joke(topic)
        
        if "error" not in joke:
            print(f"Setup: {joke.get('joke_setup', 'N/A')}")
            print(f"Punchline: {joke.get('joke_punchline', 'N/A')}")
        else:
            print(joke["error"])

# Example output:
# --- Joke about cats ---
# Setup: Why don't cats ever win races?
# Punchline: Because they always paws before the finish line!
"""
        }
    },
    {
        'id': 2,
        'title': 'Document Q&A with Vector Embeddings',
        'description': 'Create a document question-answering system using embeddings and vector search',
        'level': 'Intermediate',
        'duration': '45 minutes',
        'steps': [
            'Upload and prepare documents for processing',
            'Configure embedding model for document vectorization',
            'Set up vector store (Pinecone, Weaviate, or FAISS)',
            'Create retrieval chain for document search',
            'Add conversation memory for context awareness',
            'Test with complex questions across multiple documents',
            'Optimize retrieval performance and accuracy'
        ],
        'detailed_steps': [
            {
                'title': 'Document Preparation',
                'description': 'Prepare your documents for the RAG (Retrieval Augmented Generation) system.',
                'content': 'Upload PDF files, text documents, or web pages to Flowise. The system will automatically chunk them into manageable pieces.',
                'tips': ['Use clean, well-formatted documents', 'Optimal chunk size is 200-500 words', 'Remove unnecessary formatting']
            },
            {
                'title': 'Configure Embeddings',
                'description': 'Set up the embedding model to convert text into vector representations.',
                'content': 'Choose an embedding model like OpenAI text-embedding-ada-002 or open-source alternatives. This converts text into numerical vectors.',
                'tips': ['OpenAI embeddings are high quality', 'Consider cost vs. performance', 'Use consistent embedding model']
            },
            {
                'title': 'Vector Store Setup',
                'description': 'Configure a vector database to store and search document embeddings.',
                'content': 'Set up a vector store (Pinecone for cloud, FAISS for local) to store your document embeddings and enable fast similarity search.',
                'tips': ['Pinecone for production', 'FAISS for development', 'Configure appropriate distance metrics']
            },
            {
                'title': 'Build Retrieval Chain',
                'description': 'Create a chain that retrieves relevant documents based on user queries.',
                'content': 'Connect your vector store to a retrieval chain that finds the most relevant document chunks for each user question.',
                'tips': ['Tune similarity threshold', 'Return 3-5 relevant chunks', 'Consider reranking results']
            },
            {
                'title': 'Add Memory',
                'description': 'Implement conversation memory to maintain context across questions.',
                'content': 'Add a memory component to track conversation history, allowing for follow-up questions and context-aware responses.',
                'tips': ['Buffer memory for short conversations', 'Summary memory for longer chats', 'Clear memory when switching topics']
            },
            {
                'title': 'Test and Validate',
                'description': 'Test your Q&A system with various types of questions.',
                'content': 'Try factual questions, comparative queries, and questions requiring information from multiple documents.',
                'tips': ['Test edge cases', 'Verify source attribution', 'Check response accuracy']
            },
            {
                'title': 'Performance Optimization',
                'description': 'Fine-tune your system for better accuracy and speed.',
                'content': 'Adjust chunk sizes, embedding models, and retrieval parameters to optimize performance for your specific use case.',
                'tips': ['Monitor response times', 'Track accuracy metrics', 'A/B test different configurations']
            }
        ]
    },
    {
        'id': 3,
        'title': 'Advanced Agent Workflows',
        'description': 'Build multi-step agents with tool calling capabilities for complex tasks',
        'level': 'Advanced',
        'duration': '60 minutes',
        'steps': [
            'Design agent architecture with multiple reasoning steps',
            'Configure tool nodes (Calculator, Web Search, Code Executor)',
            'Implement tool selection and calling logic',
            'Add error handling and fallback mechanisms',
            'Create agent memory for complex task tracking',
            'Test multi-step reasoning scenarios',
            'Deploy and monitor agent performance'
        ],
        'detailed_steps': [
            {
                'title': 'Agent Architecture Design',
                'description': 'Plan your agent\'s capabilities and decision-making process.',
                'content': 'Design an agent that can reason through complex tasks, decide which tools to use, and chain multiple actions together.',
                'tips': ['Start with simple tool combinations', 'Define clear agent roles', 'Plan for error scenarios']
            },
            {
                'title': 'Tool Configuration',
                'description': 'Set up various tools your agent can use to accomplish tasks.',
                'content': 'Configure tools like calculators, web search APIs, code executors, and database connectors. Each tool should have clear input/output specifications.',
                'tips': ['Test each tool individually', 'Provide clear tool descriptions', 'Handle API rate limits']
            },
            {
                'title': 'Tool Selection Logic',
                'description': 'Implement the reasoning system that decides which tools to use.',
                'content': 'Create logic that allows the agent to analyze user requests and select appropriate tools. This often involves prompt engineering and decision trees.',
                'tips': ['Use clear tool descriptions', 'Implement tool usage examples', 'Add confidence scoring']
            },
            {
                'title': 'Error Handling',
                'description': 'Build robust error handling for tool failures and edge cases.',
                'content': 'Implement fallback mechanisms when tools fail, timeout handling, and graceful degradation of agent capabilities.',
                'tips': ['Log all errors', 'Provide user feedback', 'Implement retry logic']
            },
            {
                'title': 'Agent Memory',
                'description': 'Implement sophisticated memory systems for complex task tracking.',
                'content': 'Create memory systems that can track multi-step tasks, remember tool results, and maintain context across long conversations.',
                'tips': ['Use structured memory formats', 'Implement memory summarization', 'Clear memory strategically']
            },
            {
                'title': 'Complex Testing',
                'description': 'Test your agent with multi-step reasoning scenarios.',
                'content': 'Create test scenarios that require your agent to use multiple tools in sequence, handle ambiguous requests, and recover from failures.',
                'tips': ['Test realistic scenarios', 'Verify tool chaining', 'Check reasoning explanations']
            },
            {
                'title': 'Deployment and Monitoring',
                'description': 'Deploy your agent and set up monitoring for production use.',
                'content': 'Deploy your agent with proper monitoring, logging, and analytics to track performance and identify improvement opportunities.',
                'tips': ['Monitor tool usage patterns', 'Track success rates', 'Set up alerting for failures']
            }
        ]
    }
]

@app.route('/')
def home():
    # Find the new comparison tutorial to feature it on the home page
    comparison_tutorial = next((t for t in TUTORIALS if t.get('type') == 'comparison'), None)
    return render_template('index.html', tutorials=TUTORIALS[:2], tools=TOOL_DATA[:2], comparison_tutorial=comparison_tutorial)

@app.route('/demos')
def demos():
    return render_template('demo.html')

@app.route('/learn')
def learn():
    return render_template('learn.html', tutorials=TUTORIALS)

@app.route('/tools')
def tools():
    return render_template('tools.html', tools=TOOL_DATA)

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/tutorial/<int:tutorial_id>')
def tutorial_detail(tutorial_id):
    # Find the tutorial by ID
    tutorial = next((t for t in TUTORIALS if t['id'] == tutorial_id), None)
    if not tutorial:
        return "Tutorial not found", 404
    
    return render_template('tutorial_detail.html', tutorial=tutorial)

# API endpoint for Flowise demo
@app.route('/api/flowise-demo', methods=['POST'])
def flowise_demo():
    data = request.json
    user_message = data.get('message', '')
    
    # In production: Forward to actual Flowise API
    # For demo purposes, we'll simulate different responses
    if 'hello' in user_message.lower():
        response = {
            "reply": "Hello! I'm a demo chatbot built with Flowise. How can I help you today?",
            "steps": ["Received greeting", "Processed intent", "Generated friendly response"],
            "workflow_state": "input_processed"
        }
    elif 'weather' in user_message.lower():
        response = {
            "reply": "I'd love to help with weather information! In a real implementation, I would connect to a weather API to get current conditions.",
            "steps": ["Detected weather query", "Would call weather API", "Format weather response"],
            "workflow_state": "api_call_simulated"
        }
    else:
        response = {
            "reply": f"You said: '{user_message}'. This is a demo response showing how Flowise processes your input through various nodes.",
            "steps": ["Input received", "Text processed", "Context analyzed", "Response generated"],
            "workflow_state": "complete"
        }
    
    return jsonify(response)

@app.route('/api/code-playground', methods=['POST'])
def code_playground():
    data = request.json
    workflow_type = data.get('type', 'basic')
    
    code_examples = {
        'basic': '''# Basic LLM Chain
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
    return response''',
        
        'rag': '''# RAG (Retrieval Augmented Generation)
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
    return qa_chain.run(question)''',
        
        'agent': '''# Agent with Tools
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
    return agent.run(query)'''
    }
    
    return jsonify({
        'code': code_examples.get(workflow_type, code_examples['basic']),
        'explanation': f'This is a {workflow_type} workflow implementation using LangChain.'
    })

if __name__ == '__main__':
    app.run(debug=True)
