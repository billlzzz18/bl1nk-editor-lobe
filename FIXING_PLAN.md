# แผนการแก้ไขโปรเจ็ค bl1nk-editor-lobe

## ปัญหาที่พบ

### 1. **โครงสร้างที่ขัดแย้งกัน**
- มีทั้ง Next.js App Router (app/layout.tsx, app/src/page.tsx)
- มีทั้ง SPA with Wouter (App.tsx, main.tsx)
- มีทั้ง Static HTML (app/src/index.html)
- Package.json config สำหรับ Next.js แต่โครงสร้างเป็น SPA

### 2. **Entry Point ไม่ชัดเจน**
- main.tsx ใช้ createRoot (React 18 SPA style)
- มี page.tsx หลายตัวสำหรับ Next.js
- มี index.html แบบ static site

### 3. **Router Conflict**
- Wouter router ใน App.tsx
- Next.js App Router structure

## วิธีแก้ไข

### **เลือก Architecture: Next.js 16 App Router**
เหตุผล:
- Package.json มี next.config.js และ dependencies สำหรับ Next.js
- ต้องการ API routes (/api/trpc)
- มี SSR/SSG capabilities
- Production-ready

### การแก้ไขทีละขั้น:

1. **ลบ/ย้ายไฟล์ที่ขัดแย้ง**
   - ลบ app/main.tsx (SPA entry point)
   - ลบ app/App.tsx (Wouter router)
   - ลบ app/src/index.html (Static HTML)
   - ย้าย pages components

2. **สร้าง Next.js App Router structure ใหม่**
   - app/page.tsx (root page)
   - app/layout.tsx (root layout) 
   - app/ide/page.tsx
   - app/dashboard/page.tsx
   - app/login/page.tsx
   - etc.

3. **แก้ไข next.config.js**
   - ปรับ config ให้เหมาะกับ Next.js 16
   - เพิ่ม rewrites ถ้าจำเป็น

4. **จัดการ Client Components**
   - ใส่ 'use client' ตรงที่ต้องการ client-side rendering
   - แยก server components กับ client components

5. **แก้ไข Import paths**
   - ตรวจสอบ @/ paths
   - แก้ imports ที่ผิด

