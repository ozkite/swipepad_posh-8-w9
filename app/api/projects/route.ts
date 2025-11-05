import { NextResponse } from 'next/server';
import projects from '@/data/projects.json';

export async function GET() {
  return NextResponse.json(projects);
}
```

**Save** (Ctrl+X, Y, Enter)

---

### **Tell V0 This:**
```
I have private JSON data accessible via API routes:
- GET /api/builders - returns 100 builder profiles
- GET /api/projects - returns 200 project profiles

Each profile has: id, name, category, description, image, wallet

Update the app to:
1. Fetch data from these API routes on page load
2. Display profiles in list view grouped by category
3. Use the same swipe interface but with real data
4. Show "Builders (100)" and "Projects (200)" in category tabs

Use React hooks: useState, useEffect
Fetch on mount, show loading state, then display profiles

