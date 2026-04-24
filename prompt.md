# prompt.md

## Role
Act as a world-class senior frontend engineer, product-minded creative technologist, and information architect.

You are building a polished exam review website that serves as a structured access layer for course files.
This is not a quiz app, OCR pipeline, flashcard system, or PDF parsing product.
It is a premium, highly organized study-material library website.

The goal is to make it easy for students to find, browse, and open the right files quickly.

Avoid generic AI-looking layouts, generic startup sections, filler copy, and unnecessary complexity.

## Project Context
I already have course materials organized in folders such as:
- Typed_Notes
- Typed_Questions
- Exam_Review_Questions
- solution PDFs that often match question PDFs by filename, usually with `_solutions` added

I want a website that can be used to access these files in a structured way.

The site should organize the study materials by topic in class order and clearly separate categories like notes, questions, review questions, and solutions.

Do not build a PDF extraction app.
Do not build flashcards, quizzes, or answer-transcription systems.
Use the PDFs themselves as the study material.

## Main Goal
Build a clean, premium website using React, Tailwind CSS, and GSAP that:
- organizes the files by topic
- presents them in a clear visual hierarchy
- allows students to open files quickly
- pairs question PDFs with matching solution PDFs where possible
- optionally supports viewing PDFs inside the site
- feels polished, responsive, and easy to navigate

## Required Workflow
1. Read `spec.md`, `tasks.md`, `data-model.md`, and `context.md`.
2. Inspect the repository structure and identify all relevant PDFs.
3. Create a concise implementation plan before writing code.
4. Build a topic-based data structure from the existing files.
5. Pair question PDFs with matching solution PDFs by filename convention where possible.
6. Scaffold the site.
7. Build the UI around structured file access, not content extraction.
8. If useful, implement PDF viewing inside the site; otherwise provide open-in-new-tab behavior.
9. Fix any build or runtime issues.
10. Finish with a short handoff explaining how to add, rename, or reorganize files.

Do not skip planning.
Do not ask repeated follow-up questions.
Make reasonable assumptions and proceed.

## Product Requirements

### 1. Landing Section
- Show course / exam branding.
- Explain that this is the central review library for the final exam.
- Include a CTA like “Browse topics” or “Open study materials”.
- Make it polished and premium, but still academic and useful.

### 2. Topic Navigation
- Show all topics in class order.
- Use cards, a sidebar, or another clear navigation system.
- Make it easy to jump directly to a topic.
- If helpful, include a search or filter.

### 3. Topic Sections
Each topic section should clearly group:
- Notes
- Questions
- Review Questions
- Solutions

Each file should appear as a clean file card or list item with:
- title
- file type
- optional source/chapter label
- actions such as View and Open

### 4. Question / Solution Pairing
If a question PDF has a corresponding solution PDF with the same base filename plus `_solutions`, pair them automatically.

Example:
- `topic1.pdf`
- `topic1_solutions.pdf`

If a matching solution file exists, show a “View solutions” action next to the question file.
If no matching solution file exists, fail gracefully.

### 5. PDF Viewing
If feasible, allow PDFs to be viewed inside the website using a lightweight PDF viewing approach.
If not, opening PDFs in a new tab is acceptable.

Prefer the simplest robust implementation.
Do not overengineer this.

### 6. Final Review Section
Include an optional section that lists:
- all files
- important files
- or a quick-access set for final review

This should help students access the most useful materials quickly.

## Design Direction
Keep the spirit of a premium cinematic frontend, but adapt it to an academic document-library product.

Desired characteristics:
- premium
- intentional
- minimal
- readable
- editorial
- structured
- pixel-conscious
- polished hover states
- subtle motion
- no generic AI patterns

The site should feel more like a high-end academic archive than a startup landing page.

## Visual Rules
- Strong typography hierarchy.
- Clean cards and sections.
- Use spacing generously.
- One accent color only.
- Motion should be subtle and assist navigation.
- Avoid cheesy gradients, glowing blobs, and generic SaaS visuals.
- Prioritize readability over spectacle.

## Technical Requirements
Use:
- React
- Vite
- Tailwind CSS
- GSAP only where it genuinely adds polish
- Lucide React icons if needed

Prefer:
- local file references
- structured topic/file metadata
- reusable components
- maintainable code
- no backend

Must include:
- responsive design
- accessible semantics
- keyboard-friendly navigation
- graceful handling of missing files
- clean empty states if a topic has fewer materials

## Information Architecture
Build the website around a data model that looks something like this:

```js
const topics = [
  {
    id: "foundations",
    order: 1,
    title: "Review of Foundations I",
    files: {
      notes: [
        { title: "Foundations Notes", path: "/Typed_Notes/foundations.pdf" }
      ],
      questions: [
        {
          title: "Foundations Questions",
          path: "/Typed_Questions/foundations.pdf",
          solutionPath: "/Typed_Questions/foundations_solutions.pdf"
        }
      ],
      reviewQuestions: [
        { title: "Foundations Review", path: "/Exam_Review_Questions/foundations_review.pdf" }
      ],
      solutions: []
    }
  }
];
```

Use the repository files to populate this structure.
Do not hardcode fake academic content if real files are present.

## Component Ideas
Build components such as:
- Navbar
- Hero
- TopicGrid or TopicSidebar
- TopicSection
- FileCard
- PDFViewerPanel or PDFModal
- QuickAccessSection

Use good judgment if component names need to differ.

## Motion Rules
Allowed:
- subtle hero reveals
- section fade-ins
- topic hover lift
- sticky nav polish
- modal transitions
- small staggered entrances

Avoid:
- over-animated layouts
- constant motion
- distracting loops
- anything that slows down finding files

Use GSAP sparingly and intentionally.

## Output Expectations
When finished, provide:
- the working app
- the final file structure
- where the topic/file mapping lives
- how file pairing works
- how to add a new PDF
- how to rename files safely
- how to add a new topic

## Quality Bar
This should feel like a premium academic tool.
It should feel:
- organized
- trustworthy
- efficient
- polished
- intentionally designed

Do not build a generic marketing page.
Do not build a complex ingestion platform.
Build a beautiful, structured website for accessing study files fast.