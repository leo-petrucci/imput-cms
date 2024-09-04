import React, { useEffect, useState } from 'react'
import { useGetRateLimit } from '../../../queries/github'

export const RemainingRequests = () => {
  const { data, isLoading } = useGetRateLimit()

  console.log(data)

  if (isLoading)
    return <RequestLimitDonut limit={100} remaining={75} loading={true} />

  return (
    <RequestLimitDonut
      limit={data?.data.rate.limit}
      remaining={data?.data.rate.remaining}
    />
  )
}

const RequestLimitDonut = ({
  limit = 100,
  remaining = 100,
  loading = false,
  size = 24,
}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const percentage = (remaining / limit) * 100
    setProgress(percentage)
  }, [limit, remaining])

  const getColor = (percentage: any) => {
    if (percentage > 66) return '#21C55E' // Vercel green
    if (percentage > 33) return '#F0B429' // Vercel yellow
    return '#E54D2E' // Vercel red
  }

  const strokeWidth = size * 0.1
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  if (loading) {
    return (
      <div
        className={`w-${size} h-${size} rounded-full bg-gray-200 animate-pulse`}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={getColor(progress)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  )
}

export default RequestLimitDonut
