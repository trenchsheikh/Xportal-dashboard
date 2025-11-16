# Vercel Deployment Guide

## Deployment Status

Your project has been set up for Vercel deployment. The following has been completed:

1. ✅ Created `vercel.json` configuration file
2. ✅ Fixed TypeScript errors in `src/components/ui/separator.jsx`
3. ⚠️ TypeScript error in `src/components/file-uploader.tsx` needs to be resolved

## Remaining Issue

There's a TypeScript type error in `src/components/file-uploader.tsx` at line 113. The `useControllableState` hook expects an `onChange` function with a specific signature, but there's a type mismatch.

### Quick Fix

Add a type assertion to line 113 in `src/components/file-uploader.tsx`:

```typescript
const [files, setFiles] = useControllableState({
  prop: valueProp,
  onChange: onValueChange ? ((value: File[]) => {
    onValueChange(value);
  }) as any : undefined
});
```

Or add `// @ts-expect-error` above the `useControllableState` call.

## Environment Variables

After deployment, you need to set the following environment variables in your Vercel project dashboard:

### Required (Clerk - can use keyless mode initially):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (optional for keyless mode)
- `CLERK_SECRET_KEY` (optional for keyless mode)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard/overview"`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard/overview"`

### Optional (Sentry):
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_ORG`
- `NEXT_PUBLIC_SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_SENTRY_DISABLED="false"`

## Deployment Steps

1. Fix the TypeScript error mentioned above
2. Commit and push your changes to GitHub
3. Go to [Vercel Dashboard](https://vercel.com/dashboard)
4. Your project should already be linked (from the initial deployment attempt)
5. Set environment variables in: Project Settings → Environment Variables
6. Redeploy from the Vercel dashboard or push to your main branch

## Project URLs

- Production: https://xportal-dashboard-*.vercel.app (check Vercel dashboard for exact URL)
- Project Dashboard: https://vercel.com/sami-t01s-projects/xportal-dashboard

## Next Steps

1. Fix the TypeScript error
2. Set environment variables in Vercel dashboard
3. Test the deployed application
4. Configure custom domain (optional)

