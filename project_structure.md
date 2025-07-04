﻿# Project Structure: omnimage

``````
[ROOT] omnimage
|-- [DIR]   backend                                         [  6 items,   0.18 KB]
|   |-- [DIR]   app                                         [  2 items,   1.99 KB]
|   |   |-- [DIR]   routes                                  [  2 items,   5.20 KB]
|   |   |   |-- [PY]     __init__.py                        [   5 lines,   0.28 KB]
|   |   |   |-- [PY]     images.py                          [ 120 lines,   4.93 KB]
|   |   |-- [PY]     __init__.py                            [  44 lines,   1.99 KB]
|   |-- [DIR]   src                                         [  3 items,   0.00 KB]
|   |   |-- [DIR]   core                                    [  1 items,   3.91 KB]
|   |   |   |-- [PY]     config.py                          [ 122 lines,   3.91 KB]
|   |   |-- [DIR]   processors                              [  3 items,  22.99 KB]
|   |   |   |-- [PY]     background_remover.py              [ 239 lines,   9.97 KB]
|   |   |   |-- [PY]     ico_converter.py                   [ 118 lines,   4.50 KB]
|   |   |   |-- [PY]     image_optimizer.py                 [ 195 lines,   8.52 KB]
|   |   |-- [DIR]   utils                                   [  3 items,  11.87 KB]
|   |   |   |-- [PY]     file_utils.py                      [  84 lines,   2.99 KB]
|   |   |   |-- [PY]     naming.py                          [ 151 lines,   5.06 KB]
|   |   |   |-- [PY]     progress_utils.py                  [ 101 lines,   3.81 KB]
|   |-- [DIR]   [EMPTY] static                              [  0 items,   0.00 KB]
|   |-- [DIR]   [EMPTY] thumbnails                          [  0 items,   0.00 KB]
|   |-- [DIR]   [EMPTY] uploads                             [  0 items,   0.00 KB]
|   |-- [PY]     run.py                                     [   5 lines,   0.18 KB]
|-- [DIR]   frontend                                        [ 14 items, 215.79 KB]
|   |-- [DIR]   public                                      [  1 items,   1.46 KB]
|   |   |-- [SVG]    vite.svg                               [   1 lines,   1.46 KB]
|   |-- [DIR]   src                                         [  9 items,  25.54 KB]
|   |   |-- [DIR]   assets                                  [  1 items,   4.03 KB]
|   |   |   |-- [SVG]    react.svg                          [   1 lines,   4.03 KB]
|   |   |-- [DIR]   components                              [  3 items,   0.00 KB]
|   |   |   |-- [DIR]   layout                              [  3 items,   3.59 KB]
|   |   |   |   |-- [TS]     AppLayout.tsx                  [  60 lines,   2.38 KB]
|   |   |   |   |-- [TS]     Footer.tsx                     [   8 lines,   0.29 KB]
|   |   |   |   |-- [TS]     Header.tsx                     [  26 lines,   0.92 KB]
|   |   |   |-- [DIR]   panels                              [  3 items,   3.58 KB]
|   |   |   |   |-- [TS]     LeftPanel.tsx                  [  31 lines,   1.12 KB]
|   |   |   |   |-- [TS]     MiddlePanel.tsx                [  25 lines,   0.91 KB]
|   |   |   |   |-- [TS]     RightPanel.tsx                 [  52 lines,   1.54 KB]
|   |   |   |-- [DIR]   ui                                  [  6 items,   4.91 KB]
|   |   |   |   |-- [TS]     Button.tsx                     [  31 lines,   1.38 KB]
|   |   |   |   |-- [TS]     Card.tsx                       [  17 lines,   0.40 KB]
|   |   |   |   |-- [TS]     FileDropZone.tsx               [  44 lines,   1.49 KB]
|   |   |   |   |-- [TS]     ImageCard.tsx                  [  21 lines,   0.63 KB]
|   |   |   |   |-- [TS]     LoadingSpinner.tsx             [  26 lines,   0.61 KB]
|   |   |   |   |-- [TS]     ResizeHandle.tsx               [   9 lines,   0.40 KB]
|   |   |-- [DIR]   hooks                                   [  2 items,   4.07 KB]
|   |   |   |-- [TS]     useAppState.ts                     [  67 lines,   1.58 KB]
|   |   |   |-- [TS]     useResizePanel.ts                  [  79 lines,   2.49 KB]
|   |   |-- [DIR]   services                                [  3 items,   8.72 KB]
|   |   |   |-- [TS]     apiService.ts                      [  59 lines,   1.58 KB]
|   |   |   |-- [TS]     imageParser.ts                     [  81 lines,   2.68 KB]
|   |   |   |-- [TS]     themeService.ts                    [ 152 lines,   4.46 KB]
|   |   |-- [DIR]   stores                                  [  2 items,   2.15 KB]
|   |   |   |-- [TS]     imageStore.ts                      [  26 lines,   0.72 KB]
|   |   |   |-- [TS]     uiStore.ts                         [  55 lines,   1.43 KB]
|   |   |-- [CSS]    App.css                                [ 274 lines,   5.45 KB]
|   |   |-- [TS]     App.tsx                                [   4 lines,   0.11 KB]
|   |   |-- [CSS]    index.css                              [ 977 lines,  19.56 KB]
|   |   |-- [TS]     main.tsx                               [  13 lines,   0.42 KB]
|   |-- [FILE]   .gitignore                                 [  22 lines,   0.25 KB]
|   |-- [JS]     eslint.config.js                           [  32 lines,   0.82 KB]
|   |-- [HTML]   index.html                                 [  13 lines,   0.35 KB]
|   |-- [JSON]   package.json                               [  54 lines,   1.49 KB]
|   |-- [JSON]   package-lock.json                          [6024 lines, 207.89 KB]
|   |-- [CJS]    postcss.config.cjs                         [   6 lines,   0.08 KB]
|   |-- [MD]     project_structure.md                       [  82 lines,   2.49 KB]
|   |-- [MD]     README.md                                  [   7 lines,   0.84 KB]
|   |-- [CJS]    tailwind.config.cjs                        [  14 lines,   0.26 KB]
|   |-- [JS]     tailwind.config.js                         [  24 lines,   0.56 KB]
|   |-- [JSON]   tsconfig.json                              [  23 lines,   0.58 KB]
|   |-- [JS]     vite.config.js                             [   7 lines,   0.18 KB]
|-- [DIR]   [EMPTY] templates                               [  0 items,   0.00 KB]
|-- [FILE]   .gitignore                                     [  50 lines,   0.55 KB]
|-- [PY]     app.py                                         [ 570 lines,  22.25 KB]
|-- [SCRIPT]  Get-TreeProject.ps1                           [ 251 lines,  11.49 KB]
|-- [MD]     Omnimage Development Plan.md                   [ 300 lines,  12.14 KB]
|-- [MD]     project_documentation.md                       [2356 lines,  80.15 KB]
|-- [MD]     project_structure.md                           [  83 lines,   6.90 KB]
``````

## Summary

- **Total Items Displayed**: 76
- **Project Root**: `C:\Projects\omnimage`
