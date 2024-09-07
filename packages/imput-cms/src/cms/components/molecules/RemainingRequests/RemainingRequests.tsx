import React, { useEffect, useState } from 'react'
import { useGetRateLimit } from '../../../queries/github'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@imput/components/Popover'
import { Lightning } from '@imput/components/Icon'
import { Muted } from '@imput/components/Typography'
import dayjs from 'dayjs'

/**
 * Displays a clickable donut that opens a popover to view how many requests the
 * user has left. Usually rendered in the navbar
 */
export const RemainingRequests = () => {
  const { data, isLoading } = useGetRateLimit()

  const getTextColor = (percent: number) => {
    if (percent > 66) return 'imp-text-green-500'
    if (percent > 33) return 'imp-text-yellow-500'
    return 'imp-text-red-500'
  }

  const getBgColor = (percent: number) => {
    if (percent > 66) return 'imp-bg-green-500'
    if (percent > 33) return 'imp-bg-yellow-500'
    return 'imp-bg-red-500'
  }

  return (
    <Popover>
      <PopoverTrigger>
        <RequestLimitDonut
          isLoading={isLoading}
          limit={isLoading ? 0 : data!.data.rate.limit}
          remaining={isLoading ? 0 : data!.data.rate.remaining}
        />
      </PopoverTrigger>
      <PopoverContent>
        {!isLoading && (
          <>
            <Muted className="imp-mb-2">
              Remaining requests you can make to GitHub:
            </Muted>
            <div className="imp-space-y-3">
              <div className="imp-flex imp-justify-between imp-items-center">
                <div className="imp-flex imp-items-center">
                  <Lightning
                    className={`${getTextColor((data!.data.rate.remaining / data!.data.rate.limit) * 100)} imp-w-4 imp-h-4 imp-mr-2`}
                  />

                  <span className="imp-text-sm imp-text-gray-600">
                    Requests
                  </span>
                </div>
                <span className="imp-text-sm imp-font-medium imp-text-gray-800">
                  {data!.data.rate.remaining} / {data!.data.rate.limit}
                </span>
              </div>
              <div className="imp-w-full imp-bg-gray-200 imp-rounded-full imp-h-1.5">
                <div
                  className={`${getBgColor((data!.data.rate.remaining / data!.data.rate.limit) * 100)} imp-h-1.5 imp-rounded-full imp-transition-all imp-duration-300 imp-ease-in-out`}
                  style={{
                    width: `${(data!.data.rate.remaining / data!.data.rate.limit) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="imp-flex imp-items-center imp-justify-center imp-space-x-2">
                <Muted className="imp-text-xs">
                  Resets {dayjs(data!.data.rate.reset * 1000).fromNow()}
                </Muted>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

interface RequestLimitDonutProps {
  limit: number
  remaining: number
  isLoading: boolean
}

function RequestLimitDonut({
  limit,
  remaining,
  isLoading,
}: RequestLimitDonutProps) {
  const [percentage, setPercentage] = useState(100)

  useEffect(() => {
    const targetPercentage = (remaining / limit) * 100
    const animationDuration = 1000 // 1 second
    const startTime = Date.now()

    const animateDonut = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / animationDuration, 1)

      const newPercentage = 100 - (100 - targetPercentage) * progress
      if (!Number.isNaN(newPercentage)) {
        setPercentage(newPercentage)
      }

      if (progress < 1) {
        requestAnimationFrame(animateDonut)
      }
    }

    requestAnimationFrame(animateDonut)
  }, [limit, remaining])

  const getColor = (percent: number) => {
    if (isLoading) return 'imp-text-gray-200'
    if (percent > 66) return 'imp-text-green-500'
    if (percent > 33) return 'imp-text-yellow-500'
    return 'imp-text-red-500'
  }

  const strokeWidth = 2
  const radius = 10
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="imp-w-6 imp-h-6">
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <circle
          className="imp-text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="12"
          cy="12"
        />
        <circle
          className={`${getColor(percentage)} imp-transition-all imp-duration-300 imp-ease-in-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="12"
          cy="12"
          transform="rotate(-90 12 12)"
        />
      </svg>
    </div>
  )
}
