import { test } from '../fixtures/page-fixtures';

test('Search mobile, add to cart and verify', async ({ page, home, search, product, cart }, testInfo) => {
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
