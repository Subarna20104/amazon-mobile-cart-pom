import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
type PageFixtures = {
    home: HomePage;
    search: SearchResultsPage;
    product: ProductPage;
    cart: CartPage;
};
export const test = base.extend<PageFixtures>({
    home: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    search: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    product: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cart: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});
export { expect } from '@playwright/test';
