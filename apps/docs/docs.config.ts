const config = {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:3000`,
}

export { config }
