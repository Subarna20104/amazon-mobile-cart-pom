import { Page, expect } from '@playwright/test';
export class ProductPage {
    constructor(private page: Page) {}
    async addToCart(asin: string) {
        const productTitle = this.page.locator('span#productTitle');
        await expect(productTitle).toBeVisible();
        const title = (await productTitle.innerText()).trim();
        const addButton = this.page.locator('#add-to-cart-button:visible, #add-to-cart-button-ubb:visible, input[name="submit.add-to-cart"]:visible').first();
        await expect(addButton).toBeVisible();
        const cartFormAsin = addButton.locator('xpath=ancestor::form[1]').locator('input[name="ASIN"]').first();
        await expect(cartFormAsin, 'The add-to-cart form should match the selected search result').toHaveValue(asin);
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        const confirmation = this.page
            .getByRole('heading', { name: /\badded to (?:your )?cart\b/i })
            .or(this.page.getByText(/\badded to (?:your )?cart\b/i))
            .and(this.page.locator(':visible'))
            .first();
        await expect(confirmation, 'Amazon should confirm the product was added before opening the cart').toBeVisible();
        console.log('Confirmed Add to Cart:', title);
        return title;
    }
    async goToCart() {
        await this.page.goto('/gp/cart/view.html');
        await expect(this.page).toHaveURL(/\/cart|\/gp\/cart/i);
        console.log('Cart page opened');
    }
}
