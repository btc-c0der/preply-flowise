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
            'Set up Flowise environment',
            'Drag LLM component to canvas',
            'Add input/output nodes',
            'Connect memory module',
            'Configure API keys',
            'Test the workflow',
            'Deploy as web endpoint'
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
            "<strong>1. Design the Workflow:</strong> Drag a 'Chat Model', 'Prompt Template', and 'Output Parser' onto the Flowise canvas.",
            "<strong>2. Configure Nodes:</strong> Set the model (e.g., GPT-3.5), define the prompt template (e.g., 'Tell me a joke about {topic}'), and set the output parser to JSON.",
            "<strong>3. Connect Nodes:</strong> Link the nodes in a logical chain: Input -> Prompt -> Model -> Output.",
            "<strong>4. Test:</strong> Use the chat interface to test with a topic like 'cats' and see the JSON output."
        ],
        'python_code': {
            'title': 'Equivalent LangChain Python Code',
            'description': 'The following script replicates the Flowise workflow programmatically.',
            'code': """from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# 1. Initialize the model
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

# 2. Define the prompt template
prompt_template = "Tell me a joke about {topic}. Respond in JSON format with 'joke_setup' and 'joke_punchline' keys."
prompt = ChatPromptTemplate.from_template(prompt_template)

# 3. Set up the output parser
parser = JsonOutputParser()

# 4. Create the chain
chain = prompt | llm | parser

# 5. Invoke and test the chain
topic = "cats"
result = chain.invoke({"topic": topic})

print(result)
# Expected output: {'joke_setup': 'Why did the cat join the Red Cross?', 'joke_punchline': 'Because she wanted to be a first-aid kit!'}
"""
        }
    },
    {
        'id': 2,
        'title': 'Document Q&A with Vector Embeddings',
        'description': 'Create a document question-answering system using embeddings',
        'level': 'Intermediate',
        'duration': '45 minutes',
        'steps': [
            'Upload documents to vector store',
            'Configure embedding model',
            'Set up retrieval chain',
            'Add conversation memory',
            'Test with sample questions'
        ]
    },
    {
        'id': 3,
        'title': 'Advanced Agent Workflows',
        'description': 'Build multi-step agents with tool calling capabilities',
        'level': 'Advanced',
        'duration': '60 minutes',
        'steps': [
            'Design agent architecture',
            'Configure multiple tools',
            'Implement tool calling logic',
            'Add error handling',
            'Deploy and monitor'
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
