# data-model.md

## Topic Structure

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
        { title: "Foundations Questions", path: "/Typed_Questions/foundations.pdf" }
      ],
      reviewQuestions: [
        { title: "Foundations Review", path: "/Exam_Review_Questions/foundations_review.pdf" }
      ],
      solutions: [
        { title: "Foundations Solutions", path: "/Typed_Questions/foundations_solutions.pdf" }
      ]
    }
  }
];
```

## Rule
Do not extract content from PDFs.
Use the PDFs as the actual study material and the site as the navigation layer.