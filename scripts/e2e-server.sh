#!/usr/bin/env bash
# Playwright E2E webServer wrapper
# 移除与 Next.js 内部 FORCE_COLOR 冲突的 NO_COLOR
exec env -u NO_COLOR bun run dev "$@"
