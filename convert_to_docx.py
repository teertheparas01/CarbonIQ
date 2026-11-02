#!/usr/bin/env python3
"""
Convert CarbonIQ_Mini_Project_Report_Filled.md to .docx
Requires: pip install python-docx markdown
"""
import markdown
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
import re
import sys

def parse_markdown_to_docx(md_path, docx_path):
    """Convert markdown to docx with basic formatting"""
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    doc = Document()
    
    # Set default font
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    
    # Configure heading styles
    for level in range(1, 4):
        heading_style = doc.styles[f'Heading {level}']
        heading_style.font.name = 'Calibri'
        heading_style.font.color.rgb = RGBColor(0, 51, 102)
        if level == 1:
            heading_style.font.size = Pt(18)
            heading_style.font.bold = True
        elif level == 2:
            heading_style.font.size = Pt(14)
            heading_style.font.bold = True
        elif level == 3:
            heading_style.font.size = Pt(12)
            heading_style.font.bold = True
    
    # Split content by lines
    lines = md_content.split('\n')
    
    i = 0
    in_table = False
    table_rows = []
    current_table_align = []
    
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Handle page breaks (---)
        if stripped == '---':
            doc.add_page_break()
            i += 1
            continue
        
        # Handle headers
        if stripped.startswith('# '):
            doc.add_heading(stripped[2:], level=1)
            i += 1
            continue
        elif stripped.startswith('## '):
            doc.add_heading(stripped[3:], level=2)
            i += 1
            continue
        elif stripped.startswith('### '):
            doc.add_heading(stripped[4:], level=3)
            i += 1
            continue
        
        # Handle horizontal rules
        if stripped == '***' or stripped == '---':
            if not in_table:
                doc.add_paragraph('').paragraph_format.space_after = Pt(6)
            i += 1
            continue
        
        # Handle tables
        if '|' in stripped and stripped.count('|') >= 2:
            if not in_table:
                in_table = True
                table_rows = []
                current_table_align = []
            
            # Parse row
            cells = [c.strip() for c in stripped.split('|')[1:-1]]  # Remove empty first/last
            table_rows.append(cells)
            
            # Check for alignment row (--- | ---)
            if all(re.match(r'^:?-+:?$', c) for c in cells):
                current_table_align = []
                for c in cells:
                    if c.startswith(':') and c.endswith(':'):
                        current_table_align.append(WD_ALIGN_PARAGRAPH.CENTER)
                    elif c.endswith(':'):
                        current_table_align.append(WD_ALIGN_PARAGRAPH.RIGHT)
                    else:
                        current_table_align.append(WD_ALIGN_PARAGRAPH.LEFT)
                i += 1
                continue
            
            i += 1
            # Check if next line is also table
            if i < len(lines) and '|' in lines[i].strip() and lines[i].strip().count('|') >= 2:
                continue
            
            # Table ended - create it
            if table_rows and len(table_rows) > 1:  # At least header + 1 data row
                create_table(doc, table_rows, current_table_align)
            
            table_rows = []
            current_table_align = []
            in_table = False
            continue
        
        # If we were in a table but hit non-table line
        if in_table:
            if table_rows and len(table_rows) > 1:
                create_table(doc, table_rows, current_table_align)
            table_rows = []
            current_table_align = []
            in_table = False
        
        # Handle checkboxes
        if stripped.startswith('☑ ') or stripped.startswith('☐ '):
            p = doc.add_paragraph(stripped, style='List Bullet')
            p.paragraph_format.space_after = Pt(2)
            i += 1
            continue
        
        # Handle bullet points
        if stripped.startswith('- ') or stripped.startswith('* '):
            # Collect consecutive bullets
            bullets = []
            j = i
            while j < len(lines) and (lines[j].strip().startswith('- ') or lines[j].strip().startswith('* ')):
                bullets.append(lines[j].strip()[2:])
                j += 1
            for bullet in bullets:
                p = doc.add_paragraph(bullet, style='List Bullet')
                p.paragraph_format.space_after = Pt(2)
            i = j
            continue
        
        # Handle numbered lists
        if re.match(r'^\d+\.\s', stripped):
            nums = []
            j = i
            while j < len(lines) and re.match(r'^\d+\.\s', lines[j].strip()):
                nums.append(re.sub(r'^\d+\.\s*', '', lines[j].strip()))
                j += 1
            for idx, num in enumerate(nums, 1):
                p = doc.add_paragraph(f'{idx}. {num}', style='List Number')
                p.paragraph_format.space_after = Pt(2)
            i = j
            continue
        
        # Handle bold/italic inline
        if stripped and not stripped.startswith('[') and not stripped.startswith('!['):
            # Add as paragraph with inline formatting
            p = doc.add_paragraph()
            # Simple inline formatting: **bold**, *italic*, `code`
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', stripped)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    run = p.add_run(part[2:-2])
                    run.bold = True
                elif part.startswith('*') and part.endswith('*') and not part.startswith('**'):
                    run = p.add_run(part[1:-1])
                    run.italic = True
                elif part.startswith('`') and part.endswith('`'):
                    run = p.add_run(part[1:-1])
                    run.font.name = 'Consolas'
                    run.font.size = Pt(10)
                else:
                    run = p.add_run(part)
            p.paragraph_format.space_after = Pt(4)
        
        i += 1
    
    # Save
    doc.save(docx_path)
    print(f"Saved to {docx_path}")

def create_table(doc, rows, align_list):
    """Create a Word table from parsed markdown rows"""
    if not rows:
        return
    
    num_cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Light Grid Accent 1'
    
    for r_idx, row_data in enumerate(rows):
        for c_idx in range(num_cols):
            cell = table.cell(r_idx, c_idx)
            text = row_data[c_idx] if c_idx < len(row_data) else ''
            cell.text = text
            # Header row formatting
            if r_idx == 0:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        run.bold = True
                        run.font.size = Pt(10)
            else:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        run.font.size = Pt(10)
            # Alignment
            if c_idx < len(align_list):
                for paragraph in cell.paragraphs:
                    paragraph.alignment = align_list[c_idx]
    
    # Set column widths approximately
    for row in table.rows:
        for cell in row.cells:
            cell.width = Inches(1.2)

if __name__ == '__main__':
    md_file = r'C:\Users\Abhiraj Mangire\Music\CarbonIQ\CarbonIQ_Mini_Project_Report_Filled.md'
    docx_file = r'C:\Users\Abhiraj Mangire\Music\CarbonIQ\CarbonIQ_Mini_Project_Report_Filled.docx'
    
    try:
        parse_markdown_to_docx(md_file, docx_file)
        print("Conversion successful!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)