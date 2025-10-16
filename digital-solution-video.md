---
marp: true
theme: default
paginate: true
backgroundColor: #0f172a
color: #e2e8f0
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 0.85rem;
  }
  h1 {
    color: #3b82f6;
    font-size: 2rem;
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 0.4rem;
    margin-bottom: 0.5rem;
  }
  h2 {
    color: #60a5fa;
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
  }
  h3 {
    color: #93c5fd;
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }
  ul, ol {
    font-size: 0.85rem;
    margin: 0.3rem 0;
  }
  li {
    margin: 0.2rem 0;
  }
  code {
    background: #1e293b;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    color: #10b981;
    font-size: 0.75rem;
  }
  pre {
    background: #1e293b;
    padding: 0.6rem;
    border-radius: 6px;
    border-left: 3px solid #3b82f6;
    font-size: 0.7rem;
    margin: 0.4rem 0;
  }
  table {
    font-size: 0.7rem;
  }
  p {
    margin: 0.3rem 0;
  }
---

# PortfolioHub
## Digital Solution Video

**SACE Number: 563369H**
**Duration: 8-10 Minutes**

---

# Introduction (1 minute)

---

## Problem Context

### The Problem
Students and professionals struggle to:
- **Organize and present skills** in a structured way
- **Track skill proficiency levels** over time
- **Link skills to real projects** for evidence-based portfolios
- **Share portfolios** easily with employers and educators

### Why This Matters
- Traditional resumes are static and lack detail
- No easy way to visualize skill relationships
- Difficult to demonstrate growth and competency levels

---

## Target Audience

### Primary Users
**1. High School Students**
- Building portfolios for SACE/university applications
- Tracking skills across subjects and projects
- Sharing achievements with teachers/mentors

**2. University Students & Early Career Professionals**
- Creating digital portfolios for job applications
- Demonstrating project experience with linked skills
- Sharing portfolios with recruiters

---

## Client Research Evidence

### Client Consultation
**Met with:** Mr Smart | **Date:** 14/10/2025 | **Method:** Interview

### Key Findings from Client
- Need for **visual skill representation** (not just text lists)
- Want **public sharing capability** with privacy controls
- Require **project-skill linking** to show practical application
- Desire **score tracking** to show proficiency levels

### Similar Solution Analysis
- **LinkedIn:** Generic, no skill scoring or visualization
- **Behance/Dribble:** Creative portfolios only, no structured skills
- **GitHub:** Code-focused, not suitable for all skill types

---

# Planning (3 minutes)

---

## Mind Map & Feature Breakdown

```
Portfolio Management Problem
├── User Authentication (Sign up/in, Secure user isolation)
├── Skill Management (Add/Edit/Delete, Categorize, Score tracking, Icons)
├── Project Management (Add/Edit/Delete, Link skills, Descriptions/URLs)
├── Visualization (Skill map, Category analytics, Score indicators)
└── Sharing (Public/private toggle, Unique shareable URLs)
```

### Must Have (MVP)
1. ✅ User authentication system
2. ✅ CRUD operations for skills & projects
3. ✅ Skill-to-project linking
4. ✅ Skill score tracking (0-100 scale)

### Should Have
5. ✅ Visual skill map with categories
6. ✅ Public portfolio sharing
7. ✅ Icon picker for visual customization

---

## Flowchart: User Authentication

```
START → [User visits site] → <Is authenticated?>
  ├─ YES → [Load user data] → [Show Dashboard] → END
  └─ NO → [Show Login/Signup] → [User enters credentials]
      → [Supabase Auth validates] → <Valid credentials?>
         ├─ YES → [Load user data] → [Show Dashboard] → END
         └─ NO → [Show error message] → (back to login)
```

---

## Flowchart: Add Skill Process

```
START → [User clicks "Add Skill"] → [Open skill modal form]
→ [User fills: name, category, score, icon, description]
→ <All required fields filled?>
   ├─ NO → [Show validation error] → (back to form)
   └─ YES → [Submit to database]
       → [Insert into 'skills' & 'user_skills' tables]
       → <Database success?>
          ├─ NO → [Show error notification] → END
          └─ YES → [Update state] → [Refresh UI]
              → [Show success notification] → END
```

---

## Pseudo Code: Skill Score Calculation

```
FUNCTION calculateCategoryScores():
  FOR EACH capability IN capabilities:
    SET relevantSkills = EMPTY ARRAY

    FOR EACH userSkill IN userSkills:
      SET skill = FIND skill WHERE skill.id = userSkill.skill_id
      IF skill.capability_id = capability.id THEN:
        ADD userSkill TO relevantSkills

    IF relevantSkills.length > 0 THEN:
      SET totalScore = SUM of all relevantSkills scores
      SET capability.score = ROUND(totalScore / relevantSkills.length)
    ELSE:
      SET capability.score = 0

  RETURN capabilities with scores
END FUNCTION
```

---

## Pseudo Code: Public Portfolio Access

```
FUNCTION loadPublicPortfolio(userId):
  SET profile = DATABASE.query("SELECT * FROM profiles WHERE user_id = userId")

  IF profile.is_public = FALSE THEN:
    DISPLAY "This portfolio is private"
    RETURN NULL

  SET skills = DATABASE.query(
    "SELECT skills.*, user_skills.score FROM skills
     JOIN user_skills ON skills.id = user_skills.skill_id
     WHERE user_skills.user_id = userId")

  SET projects = DATABASE.query(
    "SELECT projects.*, project_skills.skill_id FROM projects
     LEFT JOIN project_skills ON projects.id = project_skills.project_id
     WHERE projects.user_id = userId")

  RETURN {profile, skills, projects}
END FUNCTION
```

---

## Page Layouts

### Dashboard Layout
```
┌─────────────────────────────────────────┐
│ Navbar [Logo] [Dashboard|Map] [Profile]│
├────────────┬────────────────────────────┤
│  Sidebar   │   Main Content             │
│ ┌────────┐ │ ┌────────────────────────┐ │
│ │Profile │ │ │[Skills Tab][Projects]  │ │
│ │Info    │ │ └────────────────────────┘ │
│ ├────────┤ │  [+ Add Skill]             │
│ │Public  │ │ ┌────┬────┬────┐          │
│ │Link    │ │ │Sk1 │Sk2 │Sk3 │          │
│ └────────┘ │ └────┴────┴────┘          │
└────────────┴────────────────────────────┘
```

### Skill Map View
```
┌─────────────────────────────────────────┐
│ Navbar [Logo] [Dashboard|Map] [Profile]│
├──────────┬──────────────────────────────┤
│Analytics │ Visualization Panel          │
│┌────────┐│ [Filter: All ▼]              │
││Total:15││ ┌─ Frontend ─┐ ┌─ Backend ─┐ │
││Cats: 4 ││ │JS React CSS│ │Node Python│ │
│└────────┘│ └────────────┘ └───────────┘ │
└──────────┴──────────────────────────────┘
```

---

## ER Diagram

```
USERS (id, email, password) ──1:1── PROFILES (id, user_id, full_name,
                                               bio, is_public)

CAPABILITIES (id, name, icon) ──1:M── SKILLS (id, user_id, name,
                                               capability_id, icon)
                                         │
                                         M:M (via USER_SKILLS)
                                         │
                                    USER_SKILLS (id, user_id,
                                                 skill_id, score)

PROJECTS (id, user_id, title, description, url)
    │
    M:M (via PROJECT_SKILLS)
    │
PROJECT_SKILLS (id, project_id, skill_id)
```

---

## Data Dictionary: Key Tables

**profiles**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FK → users.id | Links to auth user |
| full_name | TEXT | NOT NULL | User's display name |
| is_public | BOOLEAN | DEFAULT FALSE | Portfolio visibility |

**user_skills**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | UUID | FK → users.id | User who rated |
| skill_id | INT | FK → skills.id | Skill being rated |
| score | INT | CHECK (0-100) | Proficiency level |

---

# Iterations & Development Process

---

## Iteration Evidence

### Version Control
- **Initial commit:** Authentication and dashboard structure
- **Commit 2:** Skill CRUD operations
- **Commit 3:** Project management
- **Commit 4:** Skill map visualization
- **Commit 5:** Public sharing feature
- **Commit 6:** Enhanced UI with icon picker

### Why These Features Were Added
- **Authentication:** Essential for user data isolation
- **Skill CRUD:** Core functionality for portfolio building
- **Project linking:** User feedback requested skill-project connections
- **Visualization:** Testing showed users wanted visual representation
- **Public sharing:** Required for portfolio distribution

---

## Iteration: Skill Score System Evolution

**Version 1: Basic Text Entry**
```javascript
<input type="text" name="proficiency" />
```
**Problem:** Inconsistent data ("good", "expert", numbers)

**Version 2: Dropdown Selection**
```javascript
<select name="proficiency">
  <option>Beginner</option>
  <option>Intermediate</option>
  <option>Expert</option>
</select>
```
**Problem:** Not granular enough, difficult to compare

**Version 3: Numeric Score (Final)**
```javascript
<input type="number" min="0" max="100" name="score" />
```
**Why:** Standardized, quantifiable, enables calculations

---

## Iteration: Database Schema Changes

**Original Schema (Week 1)**
```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  proficiency TEXT
);
```

**Updated Schema (Week 3)**
```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY, user_id UUID, name TEXT,
  capability_id INT REFERENCES capabilities(id), icon TEXT
);
CREATE TABLE user_skills (
  id SERIAL, user_id UUID, skill_id INT,
  score INT CHECK (score >= 0 AND score <= 100)
);
```
**Why Changed:** Separated skill definition from user rating, added categories

---

## Iteration: UI/UX Improvements

**Initial Dashboard (Version 1)**
- Simple list in HTML table
- No visual feedback for actions
- No categorization

**Current Dashboard (Version 3)**
- Card-based layout with hover effects
- Color-coded proficiency indicators (Green 80+, Orange 60-79, Red 0-59)
- Category filtering
- Real-time success/error notifications
- Icon picker modal

**User Feedback:** "Cards are much easier to scan than tables"

---

# Coding & Validation (6 minutes)

---

## Feature 1: User Authentication

**Live Demo Steps:**
1. Navigate to login page
2. Show sign-up form with validation
3. Create new account → Database INSERT to `auth.users`
4. Show database entry in Supabase dashboard
5. Sign in with credentials
6. Show session storage in browser dev tools

**Database Evidence:**
```sql
SELECT * FROM auth.users WHERE email = 'demo@example.com';
```

---

## Feature 2: Add Skill with Validation

**Live Demo Steps:**
1. Click "Add Skill" button → modal opens
2. Try submitting empty form → validation error
3. Fill in skill: Name "JavaScript", Category "Frontend", Score 150 → error (max 100)
4. Change Score to 85 ✓
5. Select icon from picker
6. Submit form → show database insert in real-time

**Database Evidence:**
```sql
SELECT * FROM skills WHERE name = 'JavaScript';
SELECT * FROM user_skills WHERE skill_id = [id];
```

---

## Feature 3: Link Skill to Project

**Live Demo Steps:**
1. Click "Add Project"
2. Enter: Title "Portfolio Website", Description "Built with vanilla JS"
3. Show skill checkboxes (populated from user's skills)
4. Select multiple skills: JavaScript, HTML, CSS
5. Submit form → show database tables updating

**Database Evidence:**
```sql
SELECT * FROM projects ORDER BY created_at DESC LIMIT 1;
SELECT * FROM project_skills WHERE project_id = [id];
```

---

## Feature 4: Skill Map Visualization

**Live Demo:**
1. Navigate to Skill Map tab
2. Show automatic score calculation for categories
3. Filter by category → UI updates
4. Hover over skill nodes → visual feedback
5. Show color coding: Green (80+), Orange (60-79), Red (0-59)

**How It Works:**
- Scores aggregated from `user_skills` table
- Grouped by `capability_id` from `skills` table
- Real-time calculation on page load

---

## Feature 5: Public Portfolio Sharing

**Live Demo:**
1. Toggle profile to "Public" in dashboard → `is_public = true`
2. Copy public link
3. Open in incognito/new browser
4. Show public view (read-only, no edit buttons)
5. Verify RLS: Cannot access other users' private portfolios

**Security Check:**
```sql
SELECT * FROM profiles WHERE user_id != current_user_id;
-- Returns empty if is_public = false
```

---

## Source Code: State Management

**File:** `js/state.js`
```javascript
export default {
  user: null, profile: null, capabilities: [],
  skills: [], userSkills: [], projects: [],
  activeDashboardTab: 'skills',
  editingSkillId: null, editingProjectId: null
};
```

**Purpose:**
- **Single source of truth** for all app data
- Prevents prop drilling through components
- Enables reactive UI updates across all views

---

## Source Code: Authentication Function

**File:** `js/services/auth.js`
```javascript
export async function signUp(email, password, fullName) {
  const { data, error } = await supabaseClient.auth.signUp({
    email, password
  });
  if (error) return { error };

  const { error: profileError } = await supabaseClient
    .from('profiles')
    .insert({ user_id: data.user.id, full_name: fullName,
              is_public: false });
  return { data, error: profileError };
}
```

**Key Concepts:** Variables (`data`, `error`), If statement (error checking), Async/await (database operations), Function (reusable logic)

---

## Source Code: For Loop - Skill Filtering

**File:** `js/components/Dashboard.js`
```javascript
let filteredSkills = state.skills;

if (selectedCapability !== 'all') {
  filteredSkills = [];

  for (let i = 0; i < state.skills.length; i++) {
    const skill = state.skills[i];
    if (skill.capability_id === parseInt(selectedCapability)) {
      filteredSkills.push(skill);
    }
  }
}
```

**Concepts:** For loop (iterate array), If statement (conditional filtering), Variable (`filteredSkills`), Array method (`.push()`)

---

## Source Code: While Loop - Data Validation

**File:** `js/components/Modal.js`
```javascript
function validateSkillScores(skills) {
  let i = 0, allValid = true;

  while (i < skills.length && allValid) {
    const score = skills[i].score;
    if (score < 0 || score > 100) {
      allValid = false;
      console.log(`Invalid score at index ${i}: ${score}`);
    }
    i++;
  }
  return allValid;
}
```

**Concepts:** While loop (conditional iteration), Variable (`i`, `allValid`), If statement (range validation), Comments (logic explanation)

---

## Source Code: Array Methods & SQL

**File:** `js/services/api.js`
```javascript
export async function fetchUserData(userId) {
  const { data: skills } = await supabaseClient
    .from('skills')
    .select(`*, capabilities (id, name, icon)`)
    .eq('user_id', userId);

  const skillsWithScores = skills.map(skill => {
    const userSkill = state.userSkills.find(
      us => us.skill_id === skill.id
    );
    return { ...skill, score: userSkill?.score || 0 };
  });
  return skillsWithScores;
}
```

**Concepts:** SQL JOIN (multiple tables), Array methods (`.map()`, `.find()`), Spread operator

---

## Source Code: Comments Example

**File:** `js/components/SkillMap.js`
```javascript
// Calculate average score for each capability category
const categories = state.capabilities.map(cat => {
  // STEP 1: Filter user skills that belong to this category
  const relevantSkills = state.userSkills.filter(us => {
    const skill = state.skills.find(s => s.id === us.skill_id);
    return skill && skill.capability_id === cat.id;
  });

  // STEP 2: Calculate average if skills exist
  const score = relevantSkills.length > 0
    ? Math.round(relevantSkills.reduce((sum, s) => sum + s.score, 0)
                 / relevantSkills.length)
    : 0; // Default to 0 if no skills

  // STEP 3: Return category with calculated score
  return { ...cat, score, skillCount: relevantSkills.length };
}).sort((a, b) => b.score - a.score); // STEP 4: Sort by highest score
```

---

## Data Validation Walkthrough

**1. Client-Side Validation (HTML5)**
```javascript
<input type="number" min="0" max="100" required />
<input type="email" required />
```

**2. JavaScript Validation**
```javascript
if (score < 0 || score > 100) {
  notie.alert({ type: 'error', text: 'Score must be 0-100' });
  return;
}
```

**3. Database Constraints**
```sql
ALTER TABLE user_skills ADD CONSTRAINT score_range
CHECK (score >= 0 AND score <= 100);
```

**Demo:** Try entering score of 150 → Show error at each layer

---

## Database Updates: Real-Time Demo

**Add Skill Flow**
1. **Before:** Query `skills` table → Show count
2. **Action:** Submit new skill via form
3. **During:** Show network request in dev tools
4. **After:** Query `skills` table → Count increased
5. **UI Update:** New skill card appears without page reload

**SQL Queries:**
```sql
SELECT COUNT(*) FROM skills WHERE user_id = 'xxx';
INSERT INTO skills (user_id, name, capability_id, icon, description)
VALUES ('xxx', 'Python', 2, 'fab fa-python', 'Backend programming');
SELECT * FROM skills WHERE user_id = 'xxx' ORDER BY created_at DESC;
```

---

# User Feedback & Iterations

---

## Gathering User Feedback

**Method 1: Peer Testing**
**Date:** 4/09/2025 | **Tester:** Aiden Tsaai

**Feedback Received:**
- "The skill map is cool but I want to see my projects too"
- "Can you add a way to export my portfolio as PDF?"
- "The icon picker is great, but search would be helpful"

**Method 2: Online Survey**
**Participants:** 5 students/professionals

**Key Findings:**
- 80% wanted project-skill linking (implemented ✓)
- 60% wanted skill progression over time (future feature)
- 100% found the color-coded scoring helpful

---

## Feedback Implementation Examples

**Feedback 1: "I want to see which projects use each skill"**
- **Before:** Skills displayed in isolation
- **After:** Added "Used in X projects" count to skill cards

**Code Change:**
```javascript
const projectCount = state.projects.filter(p =>
  p.project_skills.some(ps => ps.skill_id === skill.id)
).length;
`<span class="tag">Used in ${projectCount} projects</span>`
```

---

## Feedback Implementation Examples

**Feedback 2: "Profile link should be easier to copy"**
- **Before:** User had to manually select and copy URL
- **After:** Added one-click copy button with visual feedback

**Code Change:**
```javascript
case 'copy-public-link':
  const linkInput = document.getElementById('public-link-input');
  linkInput.select();
  document.execCommand('copy');
  notie.alert({ type: 'success', text: 'Link copied!' });
  break;
```

**Improvement:** User testing showed 100% success rate vs 60% before

---

## Feedback Implementation Examples

**Feedback 3: "Skill map is overwhelming with many skills"**
- **Before:** All skills shown at once
- **After:** Added category filter dropdown

**Code Change:**
```javascript
filterSelect.addEventListener('change', (e) => {
  const categoryId = e.target.value;
  const groups = document.querySelectorAll('.category-group');
  groups.forEach(group => {
    group.style.display =
      (categoryId === 'all' || group.dataset.category === categoryId)
      ? 'block' : 'none';
  });
});
```

**Impact:** Users can now focus on specific skill areas

---

## Iteration Story: Features Added

**Feature: Public Portfolio Toggle**
- **Initial:** All portfolios public by default
- **Problem:** Users concerned about privacy while building
- **Solution:** Added `is_public` boolean field and toggle
- **Why:** User feedback indicated fear of sharing incomplete work
- **When:** Week 2 of development
- **Impact:** Increased user comfort and adoption

**Feature: Icon Picker Modal**
- **Initial:** Users typed Font Awesome classes manually
- **Problem:** Users didn't know icon class names
- **Solution:** Visual icon picker with 50+ pre-configured options
- **Why:** User testing showed 70% error rate with manual entry
- **When:** Week 3 of development
- **Impact:** Reduced icon selection errors to 0%

---

## Iteration Story: Removed Features

**Removed: Skill Endorsements**
- **Why added:** Thought users would want peer validation
- **Why removed:** Added complexity, required user discovery features, shifted focus from core functionality
- **Learning:** Stay focused on MVP, avoid feature creep

**Removed: Rich Text Editor**
- **Why added:** Wanted formatted text support
- **Why removed:** Large library (Quill.js) increased page load time, most users wrote short descriptions (< 100 chars)
- **Learning:** Measure actual user behavior before adding complexity

---

# Summary & Reflection

---

## Final Solution Features

### ✅ Implemented Successfully
1. Secure user authentication with Supabase
2. Full CRUD operations for skills and projects
3. Many-to-many skill-project linking
4. Visual skill map with color-coded proficiency
5. Public portfolio sharing with privacy controls
6. Real-time UI updates without page reloads
7. Category-based skill organization
8. Score calculation and analytics
9. Icon picker for visual customization
10. Form validation at multiple levels

---

## Key Technical Achievements

**Computational Thinking Applied**
- **Decomposition:** Broke portfolio problem into auth, skills, projects, visualization
- **Pattern Recognition:** Identified CRUD pattern repeated across entities
- **Abstraction:** Created reusable components (Modal, IconPicker)
- **Algorithms:** Score calculation, filtering, sorting algorithms

**Database Design**
- Normalized schema (3NF) eliminates redundancy
- Many-to-many relationships enable flexible associations
- Row Level Security ensures data isolation
- Foreign keys maintain referential integrity

---

## Evidence of Iterative Development

**Timeline**
- **Week 1:** Authentication + basic skill CRUD
- **Week 2:** Added projects + skill-project linking
- **Week 3:** Built skill map visualization
- **Week 4:** Added public sharing + icon picker
- **Week 5:** User testing + refinements

**Key Iterations**
- Changed from text proficiency to numeric scores
- Split skills into definition + user rating tables
- Added category filtering based on user feedback
- Implemented one-click link copying
- Enhanced error handling throughout

---

## Functional Outcomes Met

| Outcome | Evidence | Location |
|---------|----------|----------|
| Data persistence | Supabase PostgreSQL | All features |
| User authentication | Email/password sessions | auth.js |
| CRUD operations | Skills, projects CRUD | api.js |
| Data validation | Client, JS, DB constraints | Multiple layers |
| Search/filter | Category filtering | SkillMap.js |
| Relationships | Many-to-many links | project_skills |
| Visualization | Skill map with scores | SkillMap.js |
| Security | RLS policies | Migrations |

---

## What I Learned

**Technical Skills**
- Relational database design and normalization
- Row Level Security implementation
- Async JavaScript and Promise handling
- Component-based architecture
- State management patterns

**Problem Solving**
- Importance of user feedback early and often
- Balance between features and complexity
- Iterative development reduces risk
- Documentation helps track decisions

**Future Improvements**
- Add skill progression timeline | Implement PDF export
- Create skill recommendation engine | Add GitHub integration

---

## Thank You

**SACE Number: 563369H**

### Resources
- **GitHub Repository:** [Link]
- **Live Demo:** [URL]
- **Documentation:** [Link]

**Questions?**
