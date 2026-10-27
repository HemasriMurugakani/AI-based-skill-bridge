import os
import zipfile
import re
from xml.sax.saxutils import escape

def create_docx(markdown_path, docx_path):
    with open(markdown_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Base OOXML elements
    content_types_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>'''

    rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''

    doc_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

    styles_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:docDefaults>
        <w:rPrDefault>
            <w:rPr>
                <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
                <w:sz w:val="22"/>
                <w:color w:val="2D3748"/>
            </w:rPr>
        </w:rPrDefault>
        <w:pPrDefault>
            <w:pPr>
                <w:spacing w:after="140" w:line="276" w:lineRule="auto"/>
            </w:pPr>
        </w:pPrDefault>
    </w:docDefaults>
    <w:style w:type="paragraph" w:styleId="Heading1">
        <w:name w:val="heading 1"/>
        <w:pPr>
            <w:spacing w:before="360" w:after="160"/>
        </w:pPr>
        <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="36"/>
            <w:color w:val="173B67"/>
        </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading2">
        <w:name w:val="heading 2"/>
        <w:pPr>
            <w:spacing w:before="280" w:after="120"/>
        </w:pPr>
        <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="28"/>
            <w:color w:val="173B67"/>
        </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading3">
        <w:name w:val="heading 3"/>
        <w:pPr>
            <w:spacing w:before="200" w:after="100"/>
        </w:pPr>
        <w:rPr>
            <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
            <w:b/>
            <w:sz w:val="24"/>
            <w:color w:val="62B6E8"/>
        </w:rPr>
    </w:style>
</w:styles>'''

    # Parse markdown into WordprocessingML
    lines = md_text.split('\n')
    doc_body = []
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal in_table, table_rows
        if not table_rows:
            return ''
        
        xml = ['<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="BAE6FD"/><w:left w:val="none"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="BAE6FD"/><w:right w:val="none"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:insideV w:val="none"/></w:tblBorders></w:tblPr>']
        for r_idx, row in enumerate(table_rows):
            xml.append('<w:tr>')
            is_header = (r_idx == 0)
            for cell in row:
                shd = '<w:shd w:val="clear" w:color="auto" w:fill="EAF5FC"/>' if is_header else ''
                b_tag = '<w:b/>' if is_header else ''
                xml.append(f'<w:tc><w:tcPr>{shd}<w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar></w:tcPr><w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr>{b_tag}<w:sz w:val="19"/><w:color w:val="173B67"/></w:rPr><w:t xml:space="preserve">{escape(cell)}</w:t></w:r></w:p></w:tc>')
            xml.append('</w:tr>')
        xml.append('</w:tbl>')
        table_rows = []
        in_table = False
        return ''.join(xml)

    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        
        # Table detection
        if '|' in line and line.strip().startswith('|') and line.strip().endswith('|'):
            cells = [c.strip() for c in line.strip()[1:-1].split('|')]
            if len(cells) > 0:
                # check if separator line
                if re.match(r'^[\s\-:|]+$', line):
                    i += 1
                    continue
                in_table = True
                table_rows.append(cells)
                i += 1
                continue
        elif in_table:
            doc_body.append(flush_table())

        if not line.strip():
            i += 1
            continue

        if line.startswith('# '):
            text = escape(line[2:].strip())
            doc_body.append(f'<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="173B67"/></w:rPr><w:t>{text}</w:t></w:r></w:p>')
        elif line.startswith('## '):
            text = escape(line[3:].strip())
            doc_body.append(f'<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="173B67"/></w:rPr><w:t>{text}</w:t></w:r></w:p>')
        elif line.startswith('### '):
            text = escape(line[4:].strip())
            doc_body.append(f'<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="62B6E8"/></w:rPr><w:t>{text}</w:t></w:r></w:p>')
        elif line.startswith('- ') or line.startswith('* '):
            text = escape(line[2:].strip())
            # Simple inline bold replacement
            runs = []
            parts = re.split(r'(\*\*.*?\*\*)', text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    clean_b = escape(part[2:-2])
                    runs.append(f'<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">{clean_b}</w:t></w:r>')
                else:
                    runs.append(f'<w:r><w:t xml:space="preserve">{part}</w:t></w:r>')
            doc_body.append(f'<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="12" w:space="8" w:color="62B6E8"/></w:pPr><w:ind w:left="360"/></w:pPr><w:r><w:rPr><w:color w:val="62B6E8"/></w:rPr><w:t>• </w:t></w:r>{"".join(runs)}</w:p>')
        elif line.startswith('> '):
            text = escape(line[2:].strip())
            doc_body.append(f'<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="18" w:space="12" w:color="173B67"/></w:pPr><w:shd w:val="clear" w:color="auto" w:fill="EAF5FC"/><w:ind w:left="240" w:right="240"/><w:spacing w:before="120" w:after="120"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="173B67"/></w:rPr><w:t>{text}</w:t></w:r></w:p>')
        else:
            # Paragraph with potential bold text
            runs = []
            parts = re.split(r'(\*\*.*?\*\*)', line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    clean_b = escape(part[2:-2])
                    runs.append(f'<w:r><w:rPr><w:b/><w:color w:val="173B67"/></w:rPr><w:t xml:space="preserve">{clean_b}</w:t></w:r>')
                else:
                    clean_txt = escape(part)
                    runs.append(f'<w:r><w:t xml:space="preserve">{clean_txt}</w:t></w:r>')
            doc_body.append(f'<w:p><w:pPr><w:spacing w:after="120"/></w:pPr>{"".join(runs)}</w:p>')

        i += 1

    if in_table:
        doc_body.append(flush_table())

    document_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        {''.join(doc_body)}
        <w:sectPr>
            <w:pgSz w:w="11906" w:h="16838"/>
            <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
        </w:sectPr>
    </w:body>
</w:document>'''

    # Package as docx
    os.makedirs(os.path.dirname(docx_path), exist_ok=True)
    with zipfile.ZipFile(docx_path, 'w', compression=zipfile.ZIP_DEFLATED) as docx:
        docx.writestr('[Content_Types].xml', content_types_xml)
        docx.writestr('_rels/.rels', rels_xml)
        docx.writestr('word/_rels/document.xml.rels', doc_rels_xml)
        docx.writestr('word/styles.xml', styles_xml)
        docx.writestr('word/document.xml', document_xml)

    print(f"Generated DOCX successfully: {docx_path}")

def create_html(markdown_path, html_path):
    with open(markdown_path, 'r', encoding='utf-8') as f:
        md = f.read()

    # Simple Markdown to HTML converter
    html_content = []
    lines = md.split('\n')
    in_table = False
    table_rows = []

    def flush_html_table():
        nonlocal in_table, table_rows
        if not table_rows:
            return ''
        out = ['<div class="table-container"><table>']
        for r_idx, row in enumerate(table_rows):
            out.append('<tr>')
            tag = 'th' if r_idx == 0 else 'td'
            for cell in row:
                out.append(f'<{tag}>{cell}</{tag}>')
            out.append('</tr>')
        out.append('</table></div>')
        table_rows = []
        in_table = False
        return ''.join(out)

    for line in lines:
        line = line.rstrip()
        if '|' in line and line.strip().startswith('|') and line.strip().endswith('|'):
            cells = [c.strip() for c in line.strip()[1:-1].split('|')]
            if len(cells) > 0:
                if re.match(r'^[\s\-:|]+$', line):
                    continue
                in_table = True
                table_rows.append(cells)
                continue
        elif in_table:
            html_content.append(flush_html_table())

        if not line.strip():
            continue

        # Format inline bold & code
        line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
        line = re.sub(r'`(.*?)`', r'<code>\1</code>', line)

        if line.startswith('# '):
            html_content.append(f'<h1>{line[2:].strip()}</h1>')
        elif line.startswith('## '):
            html_content.append(f'<h2>{line[3:].strip()}</h2>')
        elif line.startswith('### '):
            html_content.append(f'<h3>{line[4:].strip()}</h3>')
        elif line.startswith('- ') or line.startswith('* '):
            html_content.append(f'<li>{line[2:].strip()}</li>')
        elif line.startswith('> '):
            html_content.append(f'<blockquote>{line[2:].strip()}</blockquote>')
        elif line.startswith('---'):
            html_content.append('<hr/>')
        else:
            html_content.append(f'<p>{line}</p>')

    if in_table:
        html_content.append(flush_html_table())

    full_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillBridge AI — Technical Handbook & Presentation Guide</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;600;700&display=swap');
        
        :root {{
            --deep-blue: #173B67;
            --sky-blue: #62B6E8;
            --light-sky: #EAF5FC;
            --gold: #F2B66D;
            --ink: #1E293B;
            --muted: #64748B;
            --border: #BAE6FD;
            --card-bg: #FFFFFF;
        }}

        body {{
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--ink);
            background: #F8FAFC;
            line-height: 1.7;
            margin: 0;
            padding: 40px 20px;
        }}

        .handbook-wrapper {{
            max-width: 900px;
            margin: 0 auto;
            background: var(--card-bg);
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 48px 56px;
            box-shadow: 0 4px 20px -2px rgba(23, 59, 103, 0.08);
        }}

        h1 {{
            color: var(--deep-blue);
            font-size: 2.2rem;
            font-weight: 800;
            border-bottom: 3px solid var(--sky-blue);
            padding-bottom: 12px;
            margin-top: 40px;
            margin-bottom: 24px;
        }}

        h2 {{
            color: var(--deep-blue);
            font-size: 1.5rem;
            font-weight: 700;
            border-left: 4px solid var(--sky-blue);
            padding-left: 12px;
            margin-top: 32px;
            margin-bottom: 16px;
        }}

        h3 {{
            color: #0284C7;
            font-size: 1.2rem;
            font-weight: 600;
            margin-top: 24px;
            margin-bottom: 12px;
        }}

        p {{
            margin-bottom: 16px;
            color: #334155;
            font-size: 0.95rem;
        }}

        blockquote {{
            background: var(--light-sky);
            border-left: 4px solid var(--deep-blue);
            padding: 14px 20px;
            border-radius: 0 10px 10px 0;
            color: var(--deep-blue);
            font-style: italic;
            margin: 20px 0;
        }}

        li {{
            margin-bottom: 8px;
            color: #334155;
            font-size: 0.95rem;
        }}

        .table-container {{
            overflow-x: auto;
            margin: 24px 0;
            border-radius: 10px;
            border: 1px solid #E2E8F0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
        }}

        th {{
            background: var(--light-sky);
            color: var(--deep-blue);
            font-weight: 700;
            text-align: left;
            padding: 12px 14px;
            border-bottom: 2px solid var(--border);
        }}

        td {{
            padding: 10px 14px;
            border-bottom: 1px solid #E2E8F0;
            color: #334155;
        }}

        tr:nth-child(even) {{
            background: #FAFCFF;
        }}

        code {{
            background: #F1F5F9;
            color: #0F172A;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.88em;
        }}

        hr {{
            border: none;
            border-top: 1px solid #E2E8F0;
            margin: 36px 0;
        }}

        .print-btn {{
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--deep-blue);
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(23, 59, 103, 0.25);
            transition: all 0.2s ease;
            z-index: 1000;
        }}

        .print-btn:hover {{
            background: #0F2035;
            transform: translateY(-1px);
        }}

        @media print {{
            body {{
                background: white;
                padding: 0;
            }}
            .handbook-wrapper {{
                border: none;
                box-shadow: none;
                padding: 0;
                max-width: 100%;
            }}
            .print-btn {{
                display: none;
            }}
            h1, h2, h3 {{
                page-break-after: avoid;
            }}
            tr, blockquote {{
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">🖨️ Export / Print PDF</button>
    <div class="handbook-wrapper">
        {''.join(html_content)}
    </div>
</body>
</html>'''

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    print(f"Generated HTML successfully: {html_path}")

if __name__ == '__main__':
    md_file = '/Users/mk/Downloads/AI based skill-bridge/docs/SKILLBRIDGE_COMPLETE_HANDBOOK.md'
    docx_file = '/Users/mk/Downloads/AI based skill-bridge/docs/SkillBridge_AI_Handbook.docx'
    html_file = '/Users/mk/Downloads/AI based skill-bridge/docs/SkillBridge_AI_Handbook.html'
    create_docx(md_file, docx_file)
    create_html(md_file, html_file)
