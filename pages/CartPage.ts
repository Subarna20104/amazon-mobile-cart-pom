import { Page, expect } from '@playwright/test';
export class CartPage {
    constructor(private page: Page) {}
    async verifyProductInCart(asin: string, title: string) {
        await expect(this.page).toHaveURL(/\/cart|\/gp\/cart/i);
        const selectedProduct = this.page.locator(`#sc-active-cart [data-asin="${asin}"]`).first();
        await expect(selectedProduct, 'The selected mobile should appear in the active cart').toBeVisible();
        await expect(selectedProduct).toContainText(title);
        console.log('VERIFIED PRODUCT IN CART');
        console.log('Product:', title);
        console.log('Expected ASIN:', asin);
    }
}
