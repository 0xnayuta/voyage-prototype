import { expect, test } from "@playwright/test";

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // 无存档时先创建
  const startBtn = page.getByRole("button", { name: "开始航海" });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForURL("/");
    await page.waitForLoadState("networkidle");
  }

  await expect(page.getByRole("heading", { name: "泉州" })).toBeVisible({
    timeout: 15_000,
  });
  await page.close();
});

test.describe("纵横四海 (Seaforge)：E2E 游戏流程", () => {
  test("首页自动加载、显示港口视图", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "泉州" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("第 1 天")).toBeVisible();
    await expect(page.getByText("5,000")).toBeVisible();
    await expect(page.getByText(/舱容/)).toBeVisible();
    await expect(page.getByText(/船员/).first()).toBeVisible();
    await expect(page.getByText(/Lv\./)).toBeVisible();
  });

  test("导航栏各链接冒烟测试", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "泉州" })).toBeVisible({
      timeout: 15_000,
    });

    // 交易所
    await page.locator("nav").getByRole("link", { name: "交易所" }).click();
    await expect(
      page.getByRole("button", { name: /^买入$/ }).first(),
    ).toBeVisible({ timeout: 15_000 });

    // 造船厂
    await page.locator("nav").getByRole("link", { name: "造船厂" }).click();
    await expect(page.getByText("造船厂")).toBeVisible({ timeout: 15_000 });

    // 舰队
    await page.locator("nav").getByRole("link", { name: "舰队" }).click();
    await expect(page.getByText("舰队")).toBeVisible({ timeout: 15_000 });

    // 酒馆
    await page.locator("nav").getByRole("link", { name: "酒馆" }).click();
    await expect(page.getByText("酒馆")).toBeVisible({ timeout: 15_000 });

    // 航海图
    await page.locator("nav").getByRole("link", { name: "航海图" }).click();
    await expect(
      page.getByRole("button", { name: "前往" }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("造船厂：装备购买与装卸", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 进入造船厂
    await page.locator("nav").getByRole("link", { name: "造船厂" }).click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "港口铁匠铺" })).toBeVisible(
      { timeout: 15_000 },
    );

    // 购买第一个可购买的装备
    const buyBtn = page.getByRole("button", { name: "购买" }).first();
    await expect(buyBtn).toBeEnabled({ timeout: 5_000 });
    await buyBtn.click();
    // 等待操作完成：装备出现在可装配区，有"出售"按钮
    await expect(page.getByRole("button", { name: /^出售/ })).toBeVisible({
      timeout: 10_000,
    });

    // 装配装备
    const equipBtn = page.getByRole("button", { name: "装配" });
    await expect(equipBtn).toBeVisible({ timeout: 5_000 });
    await equipBtn.click();
    await expect(page.getByRole("button", { name: "卸下" })).toBeVisible({
      timeout: 5_000,
    });

    // 卸下装备
    const unequipBtn = page.getByRole("button", { name: "卸下" });
    await unequipBtn.click();
    // 装备回到可装配区，"装配"按钮重新出现
    await expect(page.getByRole("button", { name: "装配" })).toBeVisible({
      timeout: 5_000,
    });

    // 出售装备
    const sellBtn = page.getByRole("button", { name: /^出售/ });
    await sellBtn.click();
    // 装备已出售，可装配区无装备
    await page.waitForTimeout(500);
    await expect(page.getByText("仓库中无可用装备")).toBeVisible({
      timeout: 5_000,
    });
  });

  test("酒馆：招募与解雇船员", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 进入酒馆
    await page.locator("nav").getByRole("link", { name: "酒馆" }).click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("航海家酒馆")).toBeVisible({ timeout: 15_000 });

    // 招募 1 名船员（默认数量为 1）
    const hireBtn = page.getByRole("button", { name: "招募" });
    await expect(hireBtn).toBeEnabled({ timeout: 5_000 });
    await hireBtn.click();
    await expect(page.getByText(/成功招募 1 名船员/)).toBeVisible({
      timeout: 10_000,
    });

    // 裁撤多余船员
    const fireSurplusBtn = page.getByRole("button", { name: "裁撤多余" });
    await expect(fireSurplusBtn).toBeEnabled({ timeout: 10_000 });
    await fireSurplusBtn.click();
    await expect(page.getByText(/成功解雇所有多余船员/)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("存档管理：保存并删除", async ({ page }) => {
    // 直接进入存档管理页
    await page.goto("/saves");
    await page.waitForLoadState("networkidle");

    const slot1 = page
      .locator("div.rounded-lg")
      .filter({ hasText: "存档位 1" })
      .first();

    // 存入第一个手动槽位（slot 1）
    const saveBtn = slot1.getByRole("button", { name: "存入此槽位" });
    await expect(saveBtn).toBeVisible({ timeout: 10_000 });
    await saveBtn.click();
    await page.waitForLoadState("networkidle");

    // 验证存档已存在（按钮变为"覆盖存档"）
    await expect(slot1.getByRole("button", { name: "覆盖存档" })).toBeVisible({
      timeout: 10_000,
    });

    // 验证存档信息预览显示（等级、金币等）
    await expect(slot1.getByText(/Lv\./)).toBeVisible();
    await expect(slot1.getByText(/泉州/)).toBeVisible();

    // 删除存档（处理 window.confirm 弹窗）
    page.once("dialog", (dialog) => dialog.accept());
    await slot1.getByRole("button", { name: "删除" }).click();
    await page.waitForLoadState("networkidle");

    // 验证 slot 1 恢复为空
    await expect(slot1.getByText("空槽位")).toBeVisible({ timeout: 10_000 });
  });

  test("完整流程：在交易所购买商品后查看", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "泉州" })).toBeVisible({
      timeout: 15_000,
    });

    // 进入交易所
    await page.locator("nav").getByRole("link", { name: "交易所" }).click();
    await expect(
      page.getByRole("button", { name: /^买入$/ }).first(),
    ).toBeVisible({ timeout: 15_000 });

    // 点击第一个可购买的"买入"按钮
    await page
      .getByRole("button", { name: /^买入$/ })
      .first()
      .click();

    // 购买弹窗出现 → 确认购买
    await expect(page.getByRole("button", { name: "确认购买" })).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: "确认购买" }).click();

    // 进入舰队页面查看货物
    await page.locator("nav").getByRole("link", { name: "舰队" }).click();
    await expect(page.getByText("舰队货物总览")).toBeVisible({
      timeout: 15_000,
    });

    // 应有货物（不再显示空舱提示）
    await expect(page.getByText("空空如也，去交易所采购些货物吧")).toHaveCount(
      0,
      {
        timeout: 15_000,
      },
    );
  });

  test("完整流程：出航并抵达", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "泉州" })).toBeVisible({
      timeout: 15_000,
    });

    // 进入航海图
    await page.locator("nav").getByRole("link", { name: "航海图" }).click();
    await expect(
      page.getByRole("button", { name: "前往" }).first(),
    ).toBeVisible({ timeout: 15_000 });

    // 点击第一个目的地的"前往"按钮
    await page.getByRole("button", { name: "前往" }).first().click();

    await expect(page.getByText("确认出航")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "确认出航" }).click();

    // 跳转到航行页
    await page.waitForURL("**/voyage", { timeout: 15_000 });

    // 显示"航行中"
    await expect(page.getByText("航行中")).toBeVisible({ timeout: 15_000 });

    // 点击"抵达"完成航行 → completeVoyage 会 redirect("/")
    await page.getByRole("button", { name: "抵达" }).click();

    // 等待重定向回港口页
    await page.waitForURL("/", { timeout: 15_000 });
    await page.waitForLoadState("networkidle");

    // 回到港口页，应显示港口名 heading（已抵达目的港）
    await expect(page.getByRole("heading").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
