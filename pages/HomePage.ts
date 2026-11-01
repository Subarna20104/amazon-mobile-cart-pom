import { Page, expect } from '@playwright/test';
export class HomePage {
    constructor(private page: Page) {}
    async searchForMobiles() {
        await this.page.goto('/');
        const searchBox = this.page.locator('#twotabsearchtextbox');
        const searchButton = this.page.locator('#nav-search-submit-button');
        const firstProduct = this.page.locator('[data-component-type="s-search-result"]').first();
        await expect(searchBox).toBeVisible();
        await searchBox.fill('mobile phones');
        await searchButton.click();
        await expect(firstProduct).toBeVisible();
    }
}