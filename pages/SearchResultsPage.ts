import { Page, expect } from '@playwright/test';
export class SearchResultsPage {
    constructor(private page: Page) {}
    private brandFilter(brand: string) {
        const names = brand === 'Apple' ? 'Apple|iPhone' : 'Redmi|Xiaomi';
        return this.page.locator('#s-refinements').getByRole('link', {
            name: new RegExp(`(?:Apply|Remove) the filter (${names})(?: to narrow results)?`, 'i'),
        }).first();
    }
    private brandCheckbox(brand: string) {
        return this.brandFilter(brand).locator('xpath=ancestor::li[1]').locator('input[type="checkbox"]');
    }
    async selectBrands() {
        const brands = ['Redmi', 'Apple'];
        for (const brand of brands) {
            const sidebar = this.page.locator('#s-refinements');
            await expect(sidebar).toBeVisible();
            const brandFilter = this.brandFilter(brand);
            const seeMore = sidebar.locator('#brandsRefinements').getByText(/see more|show more/i).first();
            if (!(await brandFilter.isVisible()) && await seeMore.isVisible()) {
                await seeMore.click();
            }
            await expect(brandFilter).toBeVisible();
            if (!(await this.brandCheckbox(brand).isChecked())) {
                await brandFilter.click();
            }
            await expect(this.brandCheckbox(brand), `${brand} filter should be selected`).toBeChecked();
            const firstProduct = this.page.locator('[data-component-type="s-search-result"]').first();
            await expect(firstProduct).toBeVisible();
            console.log('Applied brand:', brand);
        }
        for (const brand of brands) {
            await expect(this.brandCheckbox(brand), `${brand} should remain selected after applying both filters`).toBeChecked();
        }
    }
    async openFirstRegularProduct() {
        const products = this.page.locator('[data-component-type="s-search-result"][data-asin]');
        await expect(products.first()).toBeVisible();
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const product = products.nth(i);
            const asin = await product.getAttribute('data-asin');
            if (!asin) {
                continue;
            }
            const heading = product.locator('h2').first();
            if (!(await heading.count())) {
                continue;
            }
            const title = (await heading.innerText()).trim();
            if (!/redmi|xiaomi|iphone/i.test(title)) {
                continue;
            }
            const sponsored = product.locator('[aria-label^="Sponsored"], .puis-sponsored-label-text');
            if (await sponsored.count() > 0) {
                continue;
            }
            const productLink = product.locator('h2 a[href], a.a-link-normal[href*="/dp/"]').first();
            if (await productLink.count() === 0) {
                continue;
            }
            const href = await productLink.getAttribute('href');
            if (!href) {
                continue;
            }
            const productUrl = new URL(href, this.page.url()).toString();
            await this.page.goto(productUrl);
            console.log('Selected product:', title);
            console.log('ASIN:', asin);
            return { title, asin };
        }
        throw new Error('No non-sponsored Redmi or iPhone mobile found');
    }
}
