# bl1nk Editor - Installation Guide

## ปัญหาที่แก้ไขแล้ว ✅

### 1. โครงสร้างโปรเจ็คที่ขัดแย้งกัน
- **ปัญหา**: โปรเจ็คผสม Next.js App Router กับ SPA (Wouter) และ Static HTML
- **การแก้ไข**: ปรับเป็น Next.js 16 App Router เต็มรูปแบบ

### 2. Entry Point ที่สับสน
- **ปัญหา**: มี main.tsx (SPA), index.html (Static), และ page.tsx (Next.js)
- **การแก้ไข**: ใช้ Next.js App Router structure เท่านั้น

### 3. Pages ที่สร้างใหม่
- ✅ `/` - Landing page
- ✅ `/ide` - IDE interface
- ✅ `/dashboard` - User dashboard
- ✅ `/login` - Login page
- ✅ `/marketplace` - Marketplace
- ✅ `/skills` - AI Skills library
- ✅ `/price` - Pricing page

### 4. Configuration Files
- ✅ `next.config.js` - Updated สำหรับ Next.js 16
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/globals.css` - Global styles
- ✅ `tsconfig.json` - TypeScript configuration

## การติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
pnpm install
# หรือ
npm install
# หรือ
yarn install
```

### 2. รันโปรเจ็คในโหมด Development
```bash
pnpm dev
# หรือ
npm run dev
```

### 3. เปิดเบราว์เซอร์
```
http://localhost:3000
```

## โครงสร้างโฟลเดอร์ใหม่

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page (/)
├── globals.css         # Global styles
├── ide/
│   └── page.tsx        # IDE page (/ide)
├── dashboard/
│   └── page.tsx        # Dashboard (/dashboard)
├── login/
│   └── page.tsx        # Login (/login)
├── marketplace/
│   └── page.tsx        # Marketplace (/marketplace)
├── skills/
│   └── page.tsx        # Skills (/skills)
├── price/
│   └── page.tsx        # Pricing (/price)
└── components/
    └── ui/             # UI components (existing)
```

## ไฟล์ที่ถูกย้ายไป backup/
- `app/main.tsx` (SPA entry point - ไม่ใช้แล้ว)
- `app/App.tsx` (Wouter router - ไม่ใช้แล้ว)

## ขั้นตอนถัดไป (Optional)

### 1. เพิ่ม API Routes
```bash
mkdir -p app/api
```

### 2. เพิ่ม Environment Variables
```bash
cp app/.env.example .env.local
```

### 3. ติดตั้ง Database
```bash
# ตาม database-schema.sql
```

### 4. Deploy
```bash
pnpm build
pnpm start
```

## Troubleshooting

### หาก Build ล้มเหลว
```bash
# ลบ cache
rm -rf .next

# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
pnpm install

# Build อีกครั้ง
pnpm build
```

### หากมีปัญหา TypeScript
```bash
# Type check
pnpm type-check
```

### หากมีปัญหา ESLint
```bash
# Fix linting issues
pnpm lint:fix
```

## Notes

1. **TypeScript errors**: ตั้งค่า `ignoreBuildErrors: false` ใน next.config.js เพื่อให้เห็น errors
2. **UI Components**: ใช้ shadcn/ui components ที่มีอยู่แล้วใน `app/components/ui/`
3. **Server Components**: ส่วนใหญ่เป็น client components ('use client') เนื่องจากใช้ hooks และ state
4. **Router**: ใช้ Next.js Link component แทน Wouter

## Support

หากพบปัญหา:
1. ตรวจสอบ console errors
2. ตรวจสอบ terminal logs
3. ดู Next.js documentation: https://nextjs.org/docs
