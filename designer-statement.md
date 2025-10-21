---
marp: true
theme: default
paginate: true
backgroundColor: #0f172a
color: #e2e8f0
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  h1 {
    color: #3b82f6;
    font-size: 2.5rem;
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 0.5rem;
  }
  h2 {
    color: #60a5fa;
    font-size: 1.8rem;
  }
  h3 {
    color: #93c5fd;
    font-size: 1.4rem;
  }
  ul {
    font-size: 1.1rem;
  }
  code {
    background: #1e293b;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: #10b981;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .feature-box {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
    margin: 0.5rem 0;
  }
  .highlight {
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }
  .badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
    margin: 0.2rem;
  }
  .badge-success {
    background: #10b981;
    color: #000;
  }
  .badge-warning {
    background: #f59e0b;
    color: #000;
  }
  .badge-info {
    background: #3b82f6;
    color: #fff;
  }
  .icon-box {
    display: inline-block;
    font-size: 2rem;
    margin-right: 0.5rem;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    background: #1e293b;
    padding: 0.5rem;
    border-bottom: 2px solid #3b82f6;
  }
  td {
    padding: 0.5rem;
    border-bottom: 1px solid #334155;
  }
  .diagram-box {
    background: #1e293b;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid #3b82f6;
    font-family: monospace;
  }
---

# 🎯 PortfolioHub
## Designer Statement

**SACE Number: 563369H**
**Duration: 3 Minutes**

---

## 🚀 Innovative Features (90 seconds)

<div class="columns">

<div>

### <span class="icon-box">🎨</span> Dynamic Skill Visualization System
<div class="feature-box">

- **Real-time visual skill mapping** with color-coded proficiency levels
- Interactive category filtering and score aggregation
- Automated score calculations across skill categories

</div>

### <span class="icon-box">🌐</span> Public Portfolio Sharing
<div class="feature-box">

- Unique shareable URLs (`#view/[user-id]`)
- One-click link copying for easy distribution
- Privacy toggle for profile visibility control

</div>

</div>

<div>

### <span class="icon-box">🔗</span> Relational Data Architecture
<div class="feature-box">

- **Smart skill-to-project linking** system
- Multiple skills can be associated with multiple projects
- Database relationships enable automatic aggregation and analytics

</div>

### <span class="icon-box">⚡</span> Real-time Data Processing
<div class="feature-box">

- **Zero page refreshes** for data updates
- Client-side state management ensures fast UI updates
- Background database synchronization

</div>

</div>

</div>

---

## 📊 Data Processing Features

<div class="columns">

<div>

### Making Data Easier for Users

**<span class="icon-box">🎨</span> Dynamic Icon Selection**
- 50+ pre-configured icons with visual picker
- Live preview before selection
- Categorized by skill type

**<span class="icon-box">✓</span> Input Validation**
- Score range validation (0-100)
- Email format checking during authentication
- URL validation for project links

</div>

<div>

**<span class="icon-box">🔍</span> Automated Lookups**
- Capability categories automatically populated
- Skills filtered by selected capability
- Projects dynamically show associated skills

**<span class="icon-box">📈</span> Data Aggregation**
- Average scores calculated per category
- Skill counts per capability
- Visual progress indicators

</div>

</div>

---

## 🗄️ Coding Structures

### Database Design (ER Structure)

<div class="diagram-box">

```
┌──────────┐         ┌──────────┐
│ profiles │◄──1:1──►│  users   │
└──────────┘         └──────────┘

┌──────────────┐
│capabilities  │
└──────┬───────┘
       │ 1:Many
       ↓
┌──────────┐        ┌──────────────┐        ┌──────────┐
│  skills  │◄──M:M──│ user_skills  │───M:M──│ projects │
└──────────┘        └──────────────┘        └────┬─────┘
                                                  │
                                          ┌───────┴─────────┐
                                          │ project_skills  │
                                          └─────────────────┘
```

</div>

<span class="highlight">Key Innovation:</span> Many-to-many relationships enable flexible data associations without duplication

---

## 💻 Coding Structures (cont.)

<div class="columns">

<div>

### Dynamic Data Lookups
```javascript
// Skills filtered by capability
const filteredSkills = state.skills.filter(
  skill => skill.capability_id === selectedCapabilityId
);

// Score calculation across categories
const avgScore = relevantSkills.reduce((sum, s) =>
  sum + s.score, 0) / relevantSkills.length;
```

<span class="highlight">Innovation:</span> No hardcoded data - system scales automatically

</div>

<div>

### <span class="icon-box">📦</span> Architecture Layers

<div class="feature-box">

**UI Layer:** Components (Navbar, Dashboard, SkillMap)

**State Layer:** Centralized application state (state.js)

**Service Layer:** API & Auth services

**Data Layer:** Supabase Database

</div>

</div>

</div>

---

## ✅ Evaluation: Effectiveness

### What Works Well

<div class="columns">

<div>

**Effective Features:**
- <span class="badge badge-success">✓ Secure</span> Authentication system provides user isolation
- <span class="badge badge-success">✓ Protected</span> Row Level Security policies prevent unauthorized access
- <span class="badge badge-success">✓ Flexible</span> Public/private toggle gives users control
- <span class="badge badge-success">✓ Visual</span> Skill map provides immediate understanding

</div>

<div>

**Evidence from Feedback:**

<div class="feature-box">

💬 "Visual skill map makes portfolio understanding instant"

💬 "Love the color-coded scoring system"

💬 "Public sharing feature is exactly what I needed"

</div>

</div>

</div>

---

## ⚡ Evaluation: Efficiency

### Performance Strengths

<div class="columns">

<div>

**Efficient Processing:**
- <span class="badge badge-info">Fast</span> Client-side routing eliminates page reloads
- <span class="badge badge-info">Smart</span> State caching reduces database queries
- <span class="badge badge-info">Optimized</span> Batch operations for multiple associations

</div>

<div>

**Database Efficiency:**
- <span class="badge badge-info">Indexed</span> Foreign keys for fast lookups
- <span class="badge badge-info">Normalized</span> Structure eliminates data redundancy
- <span class="badge badge-info">Efficient</span> Single queries return related data via joins

</div>

</div>

---

## 🛡️ Evaluation: Reliability

### System Reliability

<div class="columns">

<div>

**Reliable Components:**
- ✓ Error handling on all API calls
- ✓ Form validation prevents invalid data entry
- ✓ Supabase provides automatic backups and data safety
- ✓ RLS policies ensure data security even with API keys exposed

</div>

<div>

**Safe Practices:**
- ✓ No data loss on failed operations
- ✓ User notifications for all actions
- ✓ Confirmation dialogs for destructive operations (delete)

</div>

</div>

---

## ⚠️ Evaluation: Areas for Improvement

<div class="columns">

<div>

### Current Limitations

**1. <span class="icon-box">📂</span> Project Portfolio Display**
<span class="badge badge-warning">Basic</span>
- Currently basic card layout
- Could add filtering and sorting options
- Image upload capability for projects

**2. <span class="icon-box">🗺️</span> Skill Map Visualization**
<span class="badge badge-warning">Static</span>
- Static grid layout
- Could implement force-directed graph (D3.js)
- Interactive node dragging and clustering

</div>

<div>

### Enhancement Opportunities

**3. <span class="icon-box">📊</span> Analytics Dashboard**
<span class="badge badge-info">Expandable</span>
- Basic score averages shown
- Could add skill growth tracking over time
- Comparison with similar portfolios (anonymized)

**4. <span class="icon-box">📤</span> Export Capabilities**
<span class="badge badge-info">Future</span>
- No PDF export yet
- Could add resume generation
- LinkedIn integration for profile sync

</div>

</div>

---

## 🎯 Evaluation: Goal Achievement

### Original Project Goals

| Goal | Status | Evidence |
|------|--------|----------|
| 🔐 User authentication | <span class="badge badge-success">✓ Complete</span> | Email/password with secure sessions |
| 📝 Skill management | <span class="badge badge-success">✓ Complete</span> | Add, edit, delete with scores |
| 📂 Project tracking | <span class="badge badge-success">✓ Complete</span> | Full CRUD operations |
| 🌐 Public sharing | <span class="badge badge-success">✓ Complete</span> | Unique URLs with privacy toggle |
| 🎨 Visual skill map | <span class="badge badge-success">✓ Complete</span> | Category-based visualization |

**Result:** <span class="highlight">All core functional outcomes achieved! 🎉</span>

---

## 📊 Evaluation: Comparison

### vs. Current Solutions

<div class="columns">

<div>

**Traditional Resume/Portfolio (Paper/Word)**
- ❌ Static, no interactivity
- ❌ Difficult to update
- ❌ No skill visualization

<div class="feature-box">

✓ **PortfolioHub:** Real-time updates, visual analytics

</div>

</div>

<div>

**LinkedIn/Portfolio Sites**
- ❌ Generic templates, limited customization
- ❌ No skill score tracking
- ❌ No project-skill linking visualization

<div class="feature-box">

✓ **PortfolioHub:** Structured skill assessment, relational mapping

</div>

</div>

</div>

---

## 🚀 Evaluation: Real-World Deployment

<div class="columns">

<div>

### Usability Factors

**<span class="icon-box">👥</span> Easy to Use:**
- Intuitive modal forms for data entry
- Clear navigation between Dashboard and Skill Map
- Visual feedback for all actions (notie alerts)

**<span class="icon-box">🌍</span> Easy to Deploy:**
- Web-based, no installation required
- Works on any device with modern browser
- Supabase handles hosting and database

</div>

<div>

### Security & Safety

**<span class="icon-box">🔒</span> User Data Protection:**
- Row Level Security prevents cross-user data access
- Password hashing handled by Supabase Auth
- Environment variables protect API keys

**<span class="icon-box">💾</span> Data Integrity:**
- Foreign key constraints prevent orphaned data
- Transaction handling ensures atomic operations
- Backup systems in place via Supabase

</div>

</div>

---

## 🔮 Realistic Improvements

### Next Version Features

<div class="columns">

<div>

**<span class="icon-box">📈</span> Skill Progression Timeline**
- Track skill score changes over time
- Visualize learning journey
- Set skill goals and milestones

**<span class="icon-box">🤝</span> Collaboration Features**
- Share projects with team members
- Collaborative skill endorsements
- Portfolio templates marketplace

</div>

<div>

**<span class="icon-box">📊</span> Enhanced Analytics**
- Skill gap analysis (identify missing skills for job roles)
- Learning resource recommendations
- Industry benchmark comparisons

**<span class="icon-box">🔌</span> Integration Capabilities**
- GitHub API for automatic project import
- Certificate validation (Coursera, Udemy)
- ATS (Applicant Tracking System) compatibility

</div>

</div>

---

## 🎓 Conclusion

### Project Reflection

<div class="columns">

<div>

**<span class="icon-box">💪</span> Strengths:**
- Solves real problem of portfolio management for students/professionals
- Innovative relational approach to skill-project mapping
- Scalable database architecture
- Secure and reliable implementation

</div>

<div>

**<span class="icon-box">📈</span> Impact:**
- Enables visual representation of competencies
- Simplifies portfolio sharing with potential employers
- Provides structured approach to skill tracking

</div>

</div>

---

## 🙏 Thank You

**SACE Number: 563369H**

<div class="feature-box">

### <span class="highlight">💡 Key Takeaway</span>

PortfolioHub demonstrates complex problem-solving through:
- 🗄️ Relational database design
- 🎨 Dynamic user interfaces
- 🔒 Secure data management

Creating an **effective solution** for modern portfolio presentation needs.

</div>

<div style="text-align: center; margin-top: 2rem; font-size: 2rem; color: #3b82f6;">

**Questions? 🤔**

</div>
