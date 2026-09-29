# Code Commenting Style Rule

- Group the code into clear numbered sections using headers like:
  - `// --1. imports--`
  - `// --2. helpers--` or `// --2. properties--`
  - `// --3. main component--`
  - `// --4. actions--`
  - `// --5. UI--`
- ONLY use numbered section headers if the file actually has multiple separate parts to divide. If the file is very simple and has only one part (e.g. just a single exported component), do not put any numbered header comments at all.
- When using numbered headers, always start from `// --1. ...--` and increment sequentially (1, 2, 3, 4...). Do not skip numbers or start with high numbers.
- Put short inline comments next to lines to describe what they are doing in simple tag-like words (always in small letters unless it has to be capitalized like UI):
  - `// state`
  - `// trigger`
  - `// check`
  - `// save`
  - `// error`
  - `// redirect`
  - `// validate`
  - `// convert`
  - `// play`
  - `// screen`
  - `// input`
  - `// toggle`
  - `// clock`
  - `// css`
- Avoid verbose explanations; keep inline comments extremely brief and placed on the same line if possible.

# UI Design Rules
- Do NOT put yellow/amber line or bar accent elements (e.g. `<span className="h-1.5 w-6 bg-amber-400 ...">` or `<div className="h-3.5 w-1 bg-amber-400 ...">`) before section titles, eyebrows, or headings. Keep titles and section headers clean without prepended line accents.
- NEVER use zoom-in on hover effects (e.g. no scale-up transforms on hover such as `hover:scale-105`, `group-hover:scale-105`, `scale-[1.02]`, or image zooming). Keep element dimensions stable and static without hover zooming.
