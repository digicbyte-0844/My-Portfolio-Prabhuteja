import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all project blocks
projects = re.split(r'(<!-- Project \d+:.*?-->)', content)

# projects[0] is everything before the first project
# projects[1] is the comment for the first project, projects[2] is its content, etc.

new_content = projects[0]

project_count = 1
for i in range(1, len(projects), 2):
    comment = projects[i]
    block = projects[i+1]
    
    # Update project number in comment
    side_text = "Left Side" if project_count % 2 != 0 else "Right Side"
    comment = re.sub(r'Project \d+:', f'Project {project_count:02d}:', comment)
    comment = re.sub(r'\(.*?Side\)', f'({side_text})', comment)
    
    # Update project badge
    block = re.sub(r'PROJECT \d+', f'PROJECT {project_count:02d}', block)
    
    # Update layout class
    if project_count % 2 != 0:
        block = block.replace('portfolio-item-right', 'portfolio-item-left')
    else:
        block = block.replace('portfolio-item-left', 'portfolio-item-right')
        
    new_content += comment + block
    project_count += 1

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Projects updated.")
