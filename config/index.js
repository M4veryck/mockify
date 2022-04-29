const dev = process.env.NODE_ENV !== 'production'

export const server = dev
    ? 'http://localhost:3000'
    : 'https://mockify-tawny.vercel.app'

// For testing in localhost production:
// export const server = 'http://localhost:3000'
