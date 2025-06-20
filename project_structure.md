# Project Structure: omnimage

``````
[ROOT] omnimage
|-- [DIR] backend
|   |-- [DIR] app
|   |   |-- [DIR] routes
|   |   |   |-- [PY]  __init__.py
|   |   |   |-- [PY]  images.py
|   |   |-- [PY]  __init__.py
|   |-- [DIR] src
|   |   |-- [DIR] core
|   |   |   |-- [PY]  config.py
|   |   |-- [DIR] processors
|   |   |   |-- [PY]  background_remover.py
|   |   |   |-- [PY]  ico_converter.py
|   |   |   |-- [PY]  image_optimizer.py
|   |   |-- [DIR] utils
|   |   |   |-- [PY]  file_utils.py
|   |   |   |-- [PY]  naming.py
|   |   |   |-- [PY]  progress_utils.py
|   |-- [DIR] (empty) static
|   |-- [DIR] (empty) thumbnails
|   |-- [DIR] (empty) uploads
|   |-- [PY]  run.py
|-- [DIR] frontend
|   |-- [DIR] public
|   |   |-- [FILE]vite.svg
|   |-- [DIR] src
|   |   |-- [DIR] assets
|   |   |   |-- [FILE]react.svg
|   |   |-- [DIR] components
|   |   |   |-- [DIR] layout
|   |   |   |   |-- [FILE]AppLayout.tsx
|   |   |   |   |-- [FILE]Footer.tsx
|   |   |   |   |-- [FILE]Header.tsx
|   |   |   |-- [DIR] panels
|   |   |   |   |-- [FILE]LeftPanel.tsx
|   |   |   |   |-- [FILE]MiddlePanel.tsx
|   |   |   |   |-- [FILE]RightPanel.tsx
|   |   |   |-- [DIR] ui
|   |   |   |   |-- [FILE]Button.tsx
|   |   |   |   |-- [FILE]Card.tsx
|   |   |   |   |-- [FILE]FileDropZone.tsx
|   |   |   |   |-- [FILE]ImageCard.tsx
|   |   |   |   |-- [FILE]LoadingSpinner.tsx
|   |   |   |   |-- [FILE]ResizeHandle.tsx
|   |   |-- [DIR] hooks
|   |   |   |-- [FILE]useAppState.ts
|   |   |   |-- [FILE]useResizePanel.ts
|   |   |-- [DIR] services
|   |   |   |-- [FILE]apiService.ts
|   |   |   |-- [FILE]imageParser.ts
|   |   |   |-- [FILE]themeService.ts
|   |   |-- [DIR] stores
|   |   |   |-- [FILE]imageStore.ts
|   |   |   |-- [FILE]uiStore.ts
|   |   |-- [CSS] App.css
|   |   |-- [FILE]App.tsx
|   |   |-- [CSS] index.css
|   |   |-- [FILE]main.tsx
|   |-- [FILE].gitignore
|   |-- [JS]  eslint.config.js
|   |-- [HTML]index.html
|   |-- [JSON]package.json
|   |-- [JSON]package-lock.json
|   |-- [FILE]postcss.config.cjs
|   |-- [MD]  project_structure.md
|   |-- [MD]  README.md
|   |-- [FILE]tailwind.config.cjs
|   |-- [JS]  tailwind.config.js
|   |-- [JSON]tsconfig.json
|   |-- [JS]  vite.config.js
|-- [DIR] (empty) templates
|-- [FILE].gitignore
|-- [PY]  app.py
|-- [MD]  components_overview.md
|-- [MD]  implementation-tasks.md
|-- [MD]  Omnimage Development Plan.md
|-- [MD]  phase2-implementation-report.md
|-- [MD]  project_documentation.md
``````

## Summary

- **Total Items Displayed**: 77
- **Project Root**: `C:\Projects\omnimage`
