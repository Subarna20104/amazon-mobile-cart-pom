import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
test('Search mobile, add to cart and verify', async ({ page }, testInfo) => {
    const home = new HomePage(page);
    const search = new SearchResultsPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    await test.step('Search for mobile phones', () => home.searchForMobiles());
    await test.step('Apply and verify Redmi and Apple filters', async () => {
        await search.selectBrands();
        await testInfo.attach('filtered-brands', {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });
    });
    const selected = await test.step('Open the first eligible non-sponsored phone', () => search.openFirstRegularProduct());
    const title = await test.step('Add the selected phone and wait for confirmation', () => product.addToCart(selected.asin));
    await test.step('Verify the selected phone in the active cart', async () => {
        await product.goToCart();
        await cart.verifyProductInCart(selected.asin, title);
        await testInfo.attach('cart-verified', {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });
    });
});
