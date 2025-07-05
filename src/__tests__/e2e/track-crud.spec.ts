import { test, expect, Page } from '@playwright/test';

async function createTrack({ page, title }: { page: Page; title: string }) {
  await page.getByRole('button', { name: /create track/i }).click();

  await page.getByLabel(/title/i).fill(title);
  await page.getByLabel(/artist/i).fill('E2E Test Artist');
  await page.getByLabel(/album/i).fill('E2E Test Album');
  await page.getByTestId('genre-button').first().click();

  await page.getByRole('button', { name: /create track/i }).click();
}

async function deleteTrack({ page }: { page: Page }) {
  const trackRow = page.getByTestId(/track-item/i).first();

  await trackRow.getByTestId('delete-track').click();

  await page.getByTestId('confirm-delete').click();
}

test.describe('Track CRUD operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow a user to create a new track', async ({ page }) => {
    const hash = Date.now();
    const newTrackTitle = `My New E2E Track ${hash}`;

    await createTrack({ page, title: newTrackTitle });

    await expect(page.getByText(newTrackTitle)).toBeVisible();

    // Cleanup
    await deleteTrack({ page });
  });

  test('should allow a user to update an existing track', async ({ page }) => {
    const hash = Date.now();
    const trackTitle = `Track to Update ${hash}`;
    const updatedTrackTitle = `Updated Track ${hash}`;

    await createTrack({ page, title: trackTitle });

    const trackRow = page.getByTestId(/track-item/i).first();
    await trackRow.getByTestId('edit-track').click();

    await page.getByLabel(/title/i).clear();
    await page.getByLabel(/title/i).fill(updatedTrackTitle);
    await page.getByRole('button', { name: /save changes/i }).click();

    await expect(
      page.getByRole('heading', { name: updatedTrackTitle })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: trackTitle })
    ).not.toBeVisible();

    // Cleanup
    await deleteTrack({ page });
  });

  test('should allow a user to delete a track', async ({ page }) => {
    const hash = Date.now();
    const trackTitle = `Track to Delete ${hash}`;

    await createTrack({ page, title: trackTitle });
    await deleteTrack({ page });

    await expect(page.getByText(trackTitle)).not.toBeVisible();
  });
});
