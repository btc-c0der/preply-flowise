# Flowise Learning Portal

An interactive educational portal for learning AI workflow building with Flowise, LangChain, and other AI tools.

## Features

- **Interactive Demos**: Try AI workflows without setup
- **Step-by-step Tutorials**: Learn from beginner to advanced
- **Tool Comparison**: Compare different AI frameworks
- **Community Features**: Share projects and get help
- **Visual Learning**: See how data flows through AI components

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the Application**
   ```bash
   python app.py
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5000`

## Project Structure

```
flowise-portal/
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Dependencies
├── static/
│   ├── css/               # Custom styles
│   ├── js/                # Custom JavaScript
│   └── images/            # Assets
└── templates/
    ├── base.html          # Master template
    ├── index.html         # Homepage
    ├── demo.html          # Interactive demos
    ├── learn.html         # Tutorials overview
    ├── tutorial_detail.html # Individual tutorial pages
    ├── tools.html         # Tools comparison
    └── community.html     # Discussion board
```

## Key Features

### Interactive Demos
- Real-time workflow visualization
- Multiple workflow types (Basic, RAG, Agent)
- Code generation in multiple languages
- Live chat interface for testing

### Learning System
- Progressive difficulty levels (Beginner → Intermediate → Advanced)
- **4 Complete Interactive Tutorials**:
  1. Building Your First Chatbot with Flowise
  2. Document Q&A with Vector Embeddings
  3. Advanced Agent Workflows
  4. From Visual Idea to Python Code (Comparison Tutorial)
- Detailed step-by-step instructions with pro tips
- Interactive progress tracking and completion status
- Side-by-side visual vs. code comparisons
- Code examples with copy-to-clipboard functionality
- Additional resources and learning materials

### Tutorial Features
- **Interactive Progress Tracking**: Mark steps as complete and track learning progress
- **Detailed Step Explanations**: Each step includes context, implementation details, and pro tips
- **Code Examples**: Production-ready code with error handling and best practices
- **Visual vs. Code Comparison**: Side-by-side comparison of Flowise visual workflows and Python implementations
- **Responsive Design**: Works seamlessly on all devices
- **Copy-to-Clipboard**: Easy copying of code examples
- **Additional Resources**: Links to documentation, videos, and advanced materials

### Tool Comparison
- Feature comparison matrix
- Decision tree for tool selection
- Use case recommendations
- Detailed analysis

### Community Platform
- Discussion forums
- Project gallery
- Q&A section
- Resource sharing

## Tutorial System

### Available Tutorials

1. **Building Your First Chatbot with Flowise** (Beginner - 30 min)
   - Visual workflow construction
   - AI model configuration
   - Memory integration
   - Deployment strategies

2. **Document Q&A with Vector Embeddings** (Intermediate - 45 min)
   - Document processing and chunking
   - Vector database setup
   - RAG implementation
   - Performance optimization

3. **Advanced Agent Workflows** (Advanced - 60 min)
   - Multi-agent architectures
   - Tool integration
   - Error handling
   - Production deployment

4. **From Visual Idea to Python Code** (Intermediate - 1 hour)
   - Flowise visual workflow creation
   - Python/LangChain code translation
   - Side-by-side comparison
   - Migration strategies

### Tutorial Features

- **Interactive Progress Tracking**: Mark steps as complete and track learning progress
- **Detailed Step Explanations**: Each step includes context, implementation details, and pro tips
- **Code Examples**: Production-ready code with error handling and best practices
- **Visual vs. Code Comparison**: Side-by-side comparison of Flowise visual workflows and Python implementations
- **Responsive Design**: Works seamlessly on all devices
- **Copy-to-Clipboard**: Easy copying of code examples
- **Additional Resources**: Links to documentation, videos, and advanced materials

## Configuration

### Environment Variables

- `SECRET_KEY`: Flask secret key
- `DATABASE_URL`: Database connection string
- `FLOWISE_API_URL`: Flowise instance URL
- `FLOWISE_API_KEY`: Flowise API key
- `OPENAI_API_KEY`: OpenAI API key (for real demos)

### Flowise Integration

The portal can connect to a real Flowise instance:

1. Install and run Flowise:
   ```bash
   npm install -g flowise
   npx flowise start
   ```

2. Update `FLOWISE_API_URL` in your `.env` file

3. Configure API endpoints in `app.py`

## Development

### Adding New Tutorials

1. Update the `TUTORIALS` data in `app.py`
2. Add tutorial details to `static/js/learn.js`
3. Create interactive content for tutorial steps

### Adding New Tools

1. Update `TOOL_DATA` in `app.py`
2. Add comparison data to `templates/tools.html`
3. Update decision tree logic in `static/js/tools.js`

### Customizing Demos

1. Modify workflow diagrams in `templates/demo.html`
2. Update code examples in `static/js/demo.js`
3. Add new workflow types to the demo system

## Deployment

### Local Development
```bash
python app.py
```

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker Deployment
```bash
docker build -t flowise-portal .
docker run -p 5000:5000 flowise-portal
```

### Cloud Deployment

The portal can be deployed to:
- Railway
- Render
- Heroku
- AWS/GCP/Azure

## API Endpoints

- `GET /` - Homepage
- `GET /demos` - Interactive demos
- `GET /learn` - Tutorials overview
- `GET /tutorial/<int:tutorial_id>` - Individual tutorial pages
- `GET /tools` - Tool comparison
- `GET /community` - Community features
- `POST /api/flowise-demo` - Demo API
- `POST /api/code-playground` - Code generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Educational Use

This portal is designed for:
- Learning AI workflow concepts
- Comparing different tools and frameworks
- Hands-on practice with real examples
- Community knowledge sharing

## License

This project is for educational purposes. Please respect the licenses of the underlying tools (Flowise, LangChain, etc.).

## Support

For questions and support:
- Check the community section
- Review the tutorials
- File an issue on GitHub

## Roadmap

- [ ] User authentication system
- [ ] Database integration
- [ ] Real-time collaboration
- [ ] Mobile-responsive design
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Plugin system