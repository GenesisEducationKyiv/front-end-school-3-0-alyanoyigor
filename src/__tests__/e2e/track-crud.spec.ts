import { test, expect, Page } from '@playwright/test';

async function createTrack({ page, title }: { page: Page; title: string }) {
  // Open the create track modal
  await page.getByRole('button', { name: /create track/i }).click();

  // Fill in the track details
  await page.getByLabel(/title/i).fill(title);
  await page.getByLabel(/artist/i).fill('E2E Test Artist');
  await page.getByLabel(/album/i).fill('E2E Test Album');
  await page.getByTestId('genre-button').first().click();

  // Submit the form
  await page.getByRole('button', { name: /create track/i }).click();
}

async function deleteTrack({ page }: { page: Page }) {
  // Get first track row
  const trackRow = page.getByTestId(/track-item/i).first();

  // Click delete button
  await trackRow.getByTestId('delete-track').click();

  // Click confirm button
  await page.getByTestId('confirm-delete').click();
}

// Using a describe block to group related tests for track management
test.describe('Track CRUD operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow a user to create a new track', async ({ page }) => {
    // Arrange
    const newTrackTitle = `My New E2E Track ${Date.now()}`;

    // Act
    await createTrack({ page, title: newTrackTitle });

    // Assert
    await expect(page.getByText(newTrackTitle)).toBeVisible();

    // Cleanup
    await deleteTrack({ page });
  });

  test('should allow a user to update an existing track', async ({ page }) => {
    // Arrange
    const trackTitle = `Track to Update ${Date.now()}`;
    const updatedTrackTitle = `Updated Track ${Date.now()}`;

    await createTrack({ page, title: trackTitle });

    const trackRow = page.getByTestId(/track-item/i).first();
    await trackRow.getByTestId('edit-track').click();

    // Act
    await page.getByLabel(/title/i).clear();
    await page.getByLabel(/title/i).fill(updatedTrackTitle);
    await page.getByRole('button', { name: /save changes/i }).click();

    // Assert
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
    // Arrange
    const trackTitle = `Track to Delete ${Date.now()}`;

    // Act
    await createTrack({ page, title: trackTitle });
    await deleteTrack({ page });

    // Assert
    await expect(page.getByText(trackTitle)).not.toBeVisible();
  });
});
