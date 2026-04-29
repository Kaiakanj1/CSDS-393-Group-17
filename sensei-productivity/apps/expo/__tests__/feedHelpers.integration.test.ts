import { mapCategory, formatPostTime } from '../../../packages/app/utils/profileHelpers'

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

    const displayPost = {
      id: apiPost.postId,
      user: apiPost.username,
      category: mapCategory(apiPost.categoryName),
      likes: apiPost.likes,
      date: formatPostTime(apiPost.postDate),
      likedByCurrentUser: apiPost.likedByCurrentUser,
      details: apiPost.caption,
    }

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