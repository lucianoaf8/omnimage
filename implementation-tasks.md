## Phase 2 Implementation Tasks - Getting Omnimage Running

### **2.1 Backend Infrastructure (Priority 1)**

#### Task 2.1.1: Create Flask Application Structure

```bash
# Create missing backend structure
cd C:\Projects\omnimage\backend
mkdir app routes static uploads thumbnails
touch app/__init__.py app/routes/__init__.py
```

#### Task 2.1.2: Port app.py to Flask App Factory Pattern

**File: `backend/app/__init__.py`**

* Migrate the Flask application from root `app.py`
* Adapt image serving routes from LogoNico's `app.py`
* Keep the CORS configuration
* Simplify to basic image upload/serve functionality
* Remove AI generation logic, keep only image management

#### Task 2.1.3: Create Basic API Routes

**File: `backend/app/routes/images.py`**

* Port relevant routes from LogoNico's `app.py`:
  * `GET /api/images` - List uploaded images
  * `POST /api/images/upload` - Upload new images
  * `GET /api/image/<filename>` - Serve image files
  * `DELETE /api/image/<filename>` - Delete images
* Use existing `parse_filename()` function from LogoNico

#### Task 2.1.4: Create Application Entry Point

**File: `backend/run.py`**

```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### **2.2 Frontend TypeScript Migration (Priority 2)**

#### Task 2.2.1: Install Required Dependencies

```bash
cd C:\Projects\omnimage\frontend
npm install @types/react @types/react-dom typescript
npm install zustand immer clsx tailwind-merge
npm install @radix-ui/react-collapsible @radix-ui/react-dialog
npm install lucide-react
npm install @tanstack/react-query
npm install react-dropzone
```

#### Task 2.2.2: Convert Copied Hooks to TypeScript

**File: `frontend/src/hooks/useAppState.ts`**

* Convert existing `useAppState.js` to TypeScript
* Replace React Context with Zustand store
* Add proper TypeScript interfaces for image data
* Reference LogoNico's image parsing logic

**File: `frontend/src/hooks/useResizePanel.ts`**

* Convert existing `useResizePanel.js` to TypeScript
* Enhance to support BOTH left and right panel resizing
* Add TypeScript interfaces for panel constraints
* Keep the existing drag logic but make it dual-panel aware

#### Task 2.2.3: Convert Services to TypeScript

**File: `frontend/src/services/apiService.ts`**

* Convert existing `apiService.js` to TypeScript
* Update endpoints to match new backend structure
* Add proper TypeScript return types
* Integrate with React Query

**File: `frontend/src/services/imageParser.ts`**

* Convert existing `imageParser.js` to TypeScript
* Keep the filename parsing logic from LogoNico
* Add enhanced metadata extraction interfaces

**File: `frontend/src/services/themeService.ts`**

* Convert existing `themeService.js` to TypeScript
* Integrate with Tailwind CSS custom properties
* Create theme switching functionality

### **2.3 Component Architecture Setup (Priority 3)**

#### Task 2.3.1: Create Layout Components Structure

```bash
cd C:\Projects\omnimage\frontend/src
mkdir components components/layout components/panels components/ui
```

#### Task 2.3.2: Build Main Layout Component

**File: `frontend/src/components/layout/AppLayout.tsx`**

* Create three-panel CSS Grid layout
* Use existing CSS from LogoNico but adapt for three equal panels
* Integrate dual resize functionality from enhanced `useResizePanel`
* Reference LogoNico's container grid structure

#### Task 2.3.3: Create Panel Components

**File: `frontend/src/components/panels/LeftPanel.tsx`**

* Collapsible tool sections using Radix Collapsible
* Tool placeholder sections (will be enhanced in Phase 3)
* State persistence for collapsed/expanded sections

**File: `frontend/src/components/panels/MiddlePanel.tsx`**

* Image viewer placeholder
* Metadata display area
* Quick action toolbar placeholder
* Use LogoNico's image display patterns as reference

**File: `frontend/src/components/panels/RightPanel.tsx`**

* Gallery grid layout
* Port LogoNico's gallery grid CSS
* Image selection functionality
* Thumbnail display logic

#### Task 2.3.4: Create Header and Footer Components

**File: `frontend/src/components/layout/Header.tsx`**

* Port relevant header logic from LogoNico
* Theme toggle integration
* Status indicators
* Logo and branding

**File: `frontend/src/components/layout/Footer.tsx`**

* Port footer from LogoNico
* Progress indicators
* System status display
* Quick stats

### **2.4 Core UI Components (Priority 4)**

#### Task 2.4.1: Create Basic UI Primitives

**File: `frontend/src/components/ui/Button.tsx`**

* Tailwind-styled button component
* Variant system for different button types

**File: `frontend/src/components/ui/Card.tsx`**

* Container component for panel sections
* Consistent spacing and styling

**File: `frontend/src/components/ui/ResizeHandle.tsx`**

* Port and enhance resize handle from LogoNico
* Support both left and right panel resizing
* Visual feedback for drag operations

#### Task 2.4.2: Create Essential Components

**File: `frontend/src/components/ui/ImageCard.tsx`**

* Gallery thumbnail component
* Selection states and hover effects
* Port styling from LogoNico's image cards

**File: `frontend/src/components/ui/LoadingSpinner.tsx`**

* Loading states for async operations
* Consistent loading indicators

### **2.5 State Management Implementation (Priority 5)**

#### Task 2.5.1: Create Zustand Stores

**File: `frontend/src/stores/imageStore.ts`**

* Replace LogoNico's React Context pattern
* Image management state (uploaded images, selected image, metadata)
* Gallery state (selected images, filters)

**File: `frontend/src/stores/uiStore.ts`**

* Panel sizes and collapsed states
* Theme state
* Loading states

**File: `frontend/src/stores/appStore.ts`**

* Combine stores if needed
* Global application state

### **2.6 Configuration and Theming (Priority 6)**

#### Task 2.6.1: Setup Tailwind Configuration

**File: `frontend/tailwind.config.js`**

* Configure custom CSS variables integration
* Port color scheme from LogoNico
* Add custom breakpoints and spacing

#### Task 2.6.2: Create Theme System

**File: `frontend/src/lib/theme.ts`**

* Centralized theme configuration
* CSS custom property definitions
* Dark/light theme variants
* Port theme logic from LogoNico's themeService

#### Task 2.6.3: Update CSS Files

**File: `frontend/src/index.css`**

* Integrate Tailwind directives
* Port essential CSS variables from LogoNico
* Update to work with new three-panel layout

**File: `frontend/src/App.css`**

* Component-specific styles
* Maintain LogoNico styling patterns
* Adapt for new layout structure

### **2.7 Main Application Integration (Priority 7)**

#### Task 2.7.1: Update App.jsx to App.tsx

**File: `frontend/src/App.tsx`**

* Convert to TypeScript
* Integrate new layout components
* Setup theme provider
* Add store providers

#### Task 2.7.2: Update main.jsx to main.tsx

**File: `frontend/src/main.tsx`**

* Convert to TypeScript
* Add React Query provider
* Ensure proper provider wrapping

#### Task 2.7.3: Create TypeScript Configuration

**File: `frontend/tsconfig.json`**

* Proper TypeScript configuration
* Path aliases for components and services
* Strict type checking

### **2.8 Integration and Testing (Priority 8)**

#### Task 2.8.1: Create Basic Upload Functionality

* File drop zone in middle panel
* Upload to backend via API
* Display in right panel gallery
* Use LogoNico's file handling patterns

#### Task 2.8.2: Implement Basic Image Selection

* Click to select images in gallery
* Display selected image in middle panel
* Show metadata and basic info
* Port selection logic from LogoNico

#### Task 2.8.3: Test End-to-End Functionality

* Backend serves images correctly
* Frontend uploads and displays images
* Panel resizing works on both sides
* Theme switching functions
* No TypeScript errors

## Success Criteria for Phase 2 Completion

### **Backend Requirements:**

* [x] Flask app starts without errors on `python run.py`
* [x] API endpoints respond correctly (`/api/images`, `/api/image/<filename>`)
* [x] File upload functionality works
* [x] Images are served with proper MIME types

### **Frontend Requirements:**

* [x] React app starts without errors on `npm run dev`
* [x] Three-panel layout renders correctly
* [x] Both left and right panels are resizable
* [x] Theme toggle switches between light/dark
* [x] File drag & drop uploads images
* [x] Gallery displays uploaded images
* [x] Clicking gallery image shows it in middle panel
* [x] All collapsible sections in left panel work
* [x] No TypeScript compilation errors

### **Integration Requirements:**

* [x] Frontend successfully communicates with backend
* [x] Images upload and display end-to-end
* [x] Panel state persists between sessions
* [x] Theme preference persists
* [x] Basic error handling for failed operations

## Implementation Order:

1. **Backend setup** (Tasks 2.1.1 - 2.1.4) - Get API running
2. **TypeScript migration** (Tasks 2.2.1 - 2.2.3) - Convert copied services
3. **Layout components** (Tasks 2.3.1 - 2.3.4) - Basic UI structure
4. **State management** (Tasks 2.5.1) - Core data flow
5. **UI integration** (Tasks 2.7.1 - 2.7.3) - Wire everything together
6. **Basic functionality** (Tasks 2.8.1 - 2.8.3) - End-to-end testing

This provides a working foundation that directly leverages the LogoNico components you've copied while building toward the advanced Omnimage architecture.
