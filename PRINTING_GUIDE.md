# HabitFlow Report - Printing Guide

Your professional experimental documentation has been created as `HabitFlow_Experiments_Report.md`.

## How to Convert to PDF/Word for Printing

### Option 1: Using Visual Studio Code (Recommended)

1. **Install Markdown PDF Extension**:
   - Open VS Code Extensions (Cmd+Shift+X)
   - Search for "Markdown PDF" by yzane
   - Click Install

2. **Convert to PDF**:
   - Open `HabitFlow_Experiments_Report.md`
   - Right-click anywhere in the editor
   - Select "Markdown PDF: Export (pdf)"
   - The PDF will be saved in the same folder

3. **For Mermaid Diagrams**:
   - Install "Markdown Preview Mermaid Support" extension
   - This ensures all diagrams render properly

### Option 2: Using Pandoc (Command Line)

1. **Install Pandoc** (if not already installed):
   ```bash
   brew install pandoc
   ```

2. **Convert to PDF**:
   ```bash
   cd /Users/hriday/Documents/habit-tracker
   pandoc HabitFlow_Experiments_Report.md -o HabitFlow_Report.pdf --pdf-engine=xelatex -V geometry:margin=1in
   ```

3. **Convert to Word (.docx)**:
   ```bash
   pandoc HabitFlow_Experiments_Report.md -o HabitFlow_Report.docx --reference-doc=template.docx
   ```

### Option 3: Online Converters

1. **Markdown to PDF**:
   - Visit: https://www.markdowntopdf.com/
   - Upload `HabitFlow_Experiments_Report.md`
   - Download the PDF

2. **Dillinger (with real-time preview)**:
   - Visit: https://dillinger.io/
   - Import the markdown file
   - Export as PDF or HTML

### Option 4: Using Typora (Best for Professional Output)

1. **Download Typora**: https://typora.io/
2. Open `HabitFlow_Experiments_Report.md` in Typora
3. Go to File → Export → PDF
4. Typora renders Mermaid diagrams beautifully
5. Configure page layout for printing (File → Preferences → Appearance)

## Printing Tips

### Page Layout Settings

For best printing results, use these settings:

- **Margins**: 1 inch (2.54 cm) on all sides
- **Page Size**: A4 or Letter
- **Orientation**: Portrait
- **Font**: Default (renders as intended)

### Color Printing vs Black & White

- **Color**: Recommended for diagrams, charts, and emoji icons
- **Black & White**: Ensure sufficient contrast; test print one page first

### Two-Sided Printing

The document is designed with page breaks for two-sided printing. Enable duplex printing with "Long Edge" binding.

## Document Structure

Your report includes:

- **Title Page** with project metadata
- **Table of Contents** with page references
- **8 Experiments** with complete theory and implementation
- **Mermaid Diagrams** for:
  - UX Honeycomb visualization
  - Cognitive aspects mind map
  - System architecture
  - Conceptual model flow
  - Use case diagrams
  - Task analysis hierarchy
  - Achievement flow
  - Data flow sequences
- **Tables** for requirements, test results, and metrics
- **References** in academic format
- **Appendix** with technical specifications

## Customization

### Adding Your Name

Replace `[Your Name]` and `[Your Institution]` in the title page with your actual details.

### Adjusting Diagrams

If a Mermaid diagram doesn't render:
1. Visit: https://mermaid.live/
2. Copy the diagram code
3. Edit and regenerate
4. Take a screenshot and insert as an image

### Professional Binding

For submission:
1. Print double-sided
2. Use a clear front cover
3. Bind with comb binding or thermal binding
4. Add a back cover for protection

## Quick Commands

```bash
# Preview in VS Code
code HabitFlow_Experiments_Report.md

# Convert to PDF with Pandoc
pandoc HabitFlow_Experiments_Report.md -o HabitFlow_Report.pdf --pdf-engine=xelatex -V geometry:margin=1in

# Convert to Word
pandoc HabitFlow_Experiments_Report.md -o HabitFlow_Report.docx

# Open in default markdown viewer
open HabitFlow_Experiments_Report.md
```

## Troubleshooting

### Mermaid Diagrams Not Rendering

If using Pandoc and Mermaid diagrams don't show:

```bash
# Install mermaid-filter
npm install -g mermaid-filter

# Convert with filter
pandoc HabitFlow_Experiments_Report.md -o HabitFlow_Report.pdf --filter mermaid-filter
```

### Page Breaks Not Working

Add this CSS if using HTML preview:

```css
@media print {
  div[style*="page-break-after: always"] {
    page-break-after: always;
  }
}
```

## Final Checklist

Before printing:

- [ ] Your name and institution added
- [ ] All diagrams render correctly
- [ ] Page numbers appear
- [ ] Table of contents links work
- [ ] No orphaned headings (heading at bottom of page)
- [ ] Professional cover page printed separately
- [ ] Two-sided printing configured
- [ ] Test print 1-2 pages first

---

**Need Help?** The document is fully self-contained and ready for printing. Choose any method above based on your preference!
