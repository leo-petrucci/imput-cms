const config = {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? `https://imput.computer`
      : `http://localhost:3000`,
}

export { config }
