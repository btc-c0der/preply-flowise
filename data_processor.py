import pandas as pd
import json
import re

def process_excel_data(excel_path):
    """
    Process the Excel file and extract structured project data for the study guide.
    """
    # Read the Excel file
    df = pd.read_excel(excel_path)
    
    # Clean up the data
    df = df.dropna(subset=['Project'])  # Remove rows without project names
    df = df.drop('Unnamed: 0', axis=1, errors='ignore')  # Remove unnecessary index column
    
    projects = []
    
    for idx, row in df.iterrows():
        project_title = str(row['Project']).strip()
        
        # Skip if project title is NaN or empty
        if pd.isna(project_title) or project_title == 'nan' or not project_title:
            continue
            
        uses = str(row['Uses']) if pd.notna(row['Uses']) else ""
        core_role = str(row['Core Role']) if pd.notna(row['Core Role']) else ""
        notes = str(row['Notes']) if pd.notna(row['Notes']) else ""
        more_notes = str(row['More Notes']) if pd.notna(row['More Notes']) else ""
        
        # Determine project category and properties
        category = determine_category(project_title, core_role, uses)
        icon = get_project_icon(project_title, core_role)
        badge_color = get_badge_color(core_role)
        difficulty = determine_difficulty(uses, notes)
        learning_points = extract_learning_points(project_title, uses, notes)
        prerequisites = determine_prerequisites(uses, difficulty)
        
        project = {
            'title': project_title,
            'uses': uses,
            'core_role': core_role,
            'notes': notes,
            'more_notes': more_notes,
            'category': category,
            'icon': icon,
            'badge_color': badge_color,
            'difficulty': difficulty,
            'learning_points': learning_points,
            'prerequisites': prerequisites
        }
        
        projects.append(project)
    
    return projects

def determine_category(title, core_role, uses):
    """Determine the project category based on title and core role."""
    title_lower = title.lower()
    core_lower = core_role.lower()
    uses_lower = uses.lower()
    
    if 'financial' in title_lower or 'fund' in title_lower or 'esg' in title_lower:
        return 'Financial Technology'
    elif 'garden' in title_lower or 'cooking' in title_lower or 'language' in title_lower:
        return 'Personal Productivity'
    elif 'data' in uses_lower or 'visualisation' in title_lower:
        return 'Data Processing'
    elif 'regulatory' in title_lower or 'compliance' in title_lower:
        return 'Compliance & Regulation'
    elif 'article' in title_lower or 'writer' in title_lower:
        return 'Content Creation'
    else:
        return 'Automation & Tools'

def get_project_icon(title, core_role):
    """Get FontAwesome icon based on project type."""
    title_lower = title.lower()
    core_lower = core_role.lower()
    
    if 'tracker' in title_lower or 'track' in core_lower:
        return 'fa-chart-line'
    elif 'financial' in title_lower or 'fund' in title_lower:
        return 'fa-coins'
    elif 'reviewer' in title_lower or 'validator' in core_lower:
        return 'fa-check-double'
    elif 'writer' in title_lower or 'article' in title_lower:
        return 'fa-edit'
    elif 'data' in title_lower or 'visualisation' in title_lower:
        return 'fa-chart-bar'
    elif 'garden' in title_lower:
        return 'fa-seedling'
    elif 'cooking' in title_lower or 'menu' in title_lower:
        return 'fa-utensils'
    elif 'language' in title_lower:
        return 'fa-language'
    elif 'translator' in title_lower:
        return 'fa-globe'
    elif 'pdf' in title_lower or 'format' in title_lower:
        return 'fa-file-pdf'
    else:
        return 'fa-cog'

def get_badge_color(core_role):
    """Get Bootstrap badge color based on core role."""
    if not core_role or core_role == 'nan':
        return 'secondary'
    
    core_lower = core_role.lower()
    
    if 'extractor' in core_lower:
        return 'primary'
    elif 'validator' in core_lower:
        return 'success'
    elif 'writer' in core_lower or 'creative' in core_lower:
        return 'warning'
    elif 'tracker' in core_lower:
        return 'info'
    elif 'recommender' in core_lower:
        return 'danger'
    elif 'translator' in core_lower:
        return 'dark'
    else:
        return 'secondary'

def determine_difficulty(uses, notes):
    """Determine project difficulty based on technology stack and complexity."""
    uses_lower = uses.lower()
    notes_lower = notes.lower()
    
    complexity_indicators = {
        'beginner': ['excel', 'csv', 'simple', 'basic'],
        'intermediate': ['api', 'pdf', 'langchain', 'rag', 'vector', 'embedding'],
        'advanced': ['mifid', 'compliance', 'regulation', 'complex', 'quarterly', 'multiple languages']
    }
    
    # Count indicators for each difficulty level
    scores = {}
    for level, indicators in complexity_indicators.items():
        score = sum(1 for indicator in indicators if indicator in uses_lower or indicator in notes_lower)
        scores[level] = score
    
    # Return the level with the highest score, defaulting to intermediate
    if scores['advanced'] > 0:
        return 'Advanced'
    elif scores['beginner'] > scores['intermediate']:
        return 'Beginner'
    else:
        return 'Intermediate'

def extract_learning_points(title, uses, notes):
    """Extract key learning points from the project description."""
    learning_points = []
    
    # Extract technology mentions
    if 'langchain' in uses.lower():
        learning_points.append('Master LangChain framework for LLM applications')
    if 'api' in uses.lower():
        learning_points.append('Learn API integration and data extraction')
    if 'pdf' in uses.lower():
        learning_points.append('Implement PDF processing and text extraction')
    if 'excel' in uses.lower():
        learning_points.append('Automate Excel data processing workflows')
    if 'rag' in uses.lower():
        learning_points.append('Build Retrieval-Augmented Generation systems')
    if 'vector' in uses.lower() or 'embedding' in uses.lower():
        learning_points.append('Work with vector databases and embeddings')
    
    # Add domain-specific learning points
    if 'financial' in title.lower():
        learning_points.append('Understand financial data compliance requirements')
    if 'esg' in title.lower():
        learning_points.append('Learn ESG reporting and sustainability metrics')
    if 'regulatory' in title.lower():
        learning_points.append('Navigate regulatory compliance automation')
    
    # Default learning points if none identified
    if not learning_points:
        learning_points = [
            'Understand problem decomposition and solution design',
            'Learn to integrate multiple data sources',
            'Develop automation workflows for repetitive tasks'
        ]
    
    return learning_points[:4]  # Limit to 4 points for display

def determine_prerequisites(uses, difficulty):
    """Determine prerequisites based on technology stack and difficulty."""
    prerequisites = []
    
    # Basic prerequisites for all
    prerequisites.append('Basic understanding of AI/ML concepts')
    
    # Technology-specific prerequisites
    if 'python' in uses.lower() or 'pandas' in uses.lower():
        prerequisites.append('Python programming fundamentals')
    if 'api' in uses.lower():
        prerequisites.append('Understanding of REST APIs and HTTP requests')
    if 'langchain' in uses.lower():
        prerequisites.append('Familiarity with LangChain framework')
    if 'excel' in uses.lower():
        prerequisites.append('Excel file manipulation experience')
    
    # Difficulty-based prerequisites
    if difficulty == 'Advanced':
        prerequisites.append('Experience with complex data processing')
        prerequisites.append('Understanding of compliance and regulatory requirements')
    elif difficulty == 'Intermediate':
        prerequisites.append('Intermediate programming skills')
    
    return prerequisites[:4]  # Limit to 4 prerequisites

def get_project_statistics(projects):
    """Calculate statistics about the projects."""
    stats = {
        'project_count': len(projects),
        'category_count': len(set(p['category'] for p in projects)),
        'financial_projects': len([p for p in projects if 'financial' in p['title'].lower() or 'fund' in p['title'].lower()]),
        'personal_projects': len([p for p in projects if p['category'] == 'Personal Productivity'])
    }
    return stats

if __name__ == "__main__":
    # Process the Excel file
    projects = process_excel_data('/workspaces/preply-flowise/data/project_ideas.xlsx')
    stats = get_project_statistics(projects)
    
    # Save processed data
    output_data = {
        'projects': projects,
        'statistics': stats
    }
    
    with open('/workspaces/preply-flowise/data/processed_projects.json', 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Processed {len(projects)} projects successfully!")
    print(f"Statistics: {stats}")
