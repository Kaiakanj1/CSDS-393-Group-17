import { mapCategory, formatPostTime } from '../../../packages/app/utils/profileHelpers'

// This test verifies that the feed helper functions correctly transform API data into the format needed for display in the feed cards. It checks that the category mapping and date formatting work as expected, ensuring that the feed displays accurate and user-friendly information.
describe('Feed helper integration', () => {
  test('maps API feed data into display-ready feed card data', () => {
    const apiPost = {
      postId: 1,
      userId: 7,
      username: 'kaia',
      categoryName: 'Academic',
      likes: 3,
      postDate: '2026-04-01T00:00:00Z',
      likedByCurrentUser: false,
      caption: 'Finished my task',
    }

    // Use the helper functions to transform the API post data into the format needed for display
    const displayPost = {
      id: apiPost.postId,
      user: apiPost.username,
      category: mapCategory(apiPost.categoryName),
      likes: apiPost.likes,
      date: formatPostTime(apiPost.postDate),
      likedByCurrentUser: apiPost.likedByCurrentUser,
      details: apiPost.caption,
    }

    // Verify that the display post has the expected structure and values
    expect(displayPost).toEqual({
      id: 1,
      user: 'kaia',
      category: 'School',
      likes: 3,
      date: expect.stringContaining('2026'),
      likedByCurrentUser: false,
      details: 'Finished my task',
    })
  })
})